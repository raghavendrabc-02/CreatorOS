"""Turns a script into a scene-by-scene visual plan with OpenAI, in a single request.

Only text is generated here (scene titles, timings, image prompts and editing notes). Images are a separate step.
"""

import hashlib
import logging
from functools import lru_cache

import openai
from openai import OpenAI
from pydantic import BaseModel, ValidationError

from app.config import get_settings
from app.models.visual_asset import AspectRatio, Platform, VisualStyle
from app.schemas.visual_asset import SceneCreate

logger = logging.getLogger(__name__)

# Change this whenever INSTRUCTIONS or GeneratedPlan change, so plans made the old way are re-analysed, not reused.
PROMPT_VERSION = "1"

MAX_SCENES_PER_PLAN = 60
# Caps what one analysis can cost: room for MAX_SCENES_PER_PLAN scenes plus the model's (low) reasoning.
MAX_OUTPUT_TOKENS = 16_000
REQUEST_TIMEOUT_SECONDS = 120

PLATFORM_FORMATS: dict[Platform, str] = {
    "instagram": "Instagram Reel (short vertical video, fast pacing)",
    "youtube": "YouTube video (longer video, steadier pacing)",
}

STYLE_DESCRIPTIONS: dict[VisualStyle, str] = {
    "cinematic": "cinematic, photorealistic, film lighting",
    "documentary": "documentary photography, natural light, authentic",
    "illustration": "digital illustration, clean shapes, rich colour",
    "3d": "3D render, soft studio lighting",
    "minimal": "minimal flat design, simple shapes, limited palette",
}

INSTRUCTIONS = f"""You turn a video script into a scene-by-scene visual plan.

Rules:
- Cover the whole script in order. Each scene illustrates the next part of it; don't skip or repeat parts.
- Scene length: about 3-6 seconds of narration for Instagram Reels, 6-15 seconds for YouTube. \
Use at most {MAX_SCENES_PER_PLAN} scenes; merge neighbouring parts if needed.
- title: 2-5 words naming the moment.
- time_range: estimated narration timing at about 150 words per minute, written like "0:00 – 0:05".
- line: the script text this scene covers, in the script's original language. Shorten with "…" if over 200 characters.
- prompt: one self-contained image-generation prompt in English: subject, setting, composition, lighting and \
mood, in the requested visual style and framed for the requested aspect ratio. Refer to real people by their role \
and general appearance, not by name. No text, captions, logos or watermarks in the image.
- notes: 1-3 short editing hints in English, such as shot type or camera movement, transition, on-screen text or \
sound cue."""


class AnalysisError(Exception):
    """A failure with a message that is safe to show to the user (it never contains the API key)."""

    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


# The structure OpenAI must return (Structured Outputs). Kept separate from SceneCreate so the API's
# own validation rules don't become part of the request sent to the model.
class GeneratedScene(BaseModel):
    title: str
    time_range: str
    line: str
    prompt: str
    notes: list[str]


class GeneratedPlan(BaseModel):
    scenes: list[GeneratedScene]


def analysis_fingerprint(
    *, model: str, platform: Platform, style: VisualStyle, aspect_ratio: AspectRatio, script: str
) -> str:
    """A short code that changes whenever anything sent to OpenAI would change."""
    parts = (PROMPT_VERSION, model, platform, style, aspect_ratio, script)
    return hashlib.sha256("\x1f".join(parts).encode()).hexdigest()


@lru_cache
def get_openai_client() -> OpenAI:
    key = get_settings().openai_api_key
    if key is None:
        raise AnalysisError(
            "AI analysis is not configured. Add OPENAI_API_KEY to backend/.env and restart the backend.", 503
        )
    return OpenAI(api_key=key.get_secret_value(), timeout=REQUEST_TIMEOUT_SECONDS, max_retries=2)


def to_scenes(plan: GeneratedPlan) -> list[SceneCreate]:
    """Maps the model's scenes onto the scene table's fields and limits, dropping any without a line or prompt."""
    scenes = []
    for number, scene in enumerate(plan.scenes, start=1):
        if len(scenes) == MAX_SCENES_PER_PLAN:
            break
        notes = [note.strip()[:500] for note in scene.notes if note.strip()][:20]
        try:
            scenes.append(
                SceneCreate(
                    title=scene.title.strip()[:200] or f"Scene {number}",
                    time_range=scene.time_range.strip()[:50] or None,
                    line=scene.line.strip()[:10_000],
                    prompt=scene.prompt.strip()[:10_000],
                    notes=notes,
                )
            )
        except ValidationError:
            continue
    if not scenes:
        raise AnalysisError("The AI didn't return any usable scenes. Try analysing again.", 502)
    return scenes


def _describe_request(script: str, platform: Platform, style: VisualStyle, aspect_ratio: AspectRatio) -> str:
    return (
        f"Format: {PLATFORM_FORMATS[platform]}\n"
        f"Visual style: {STYLE_DESCRIPTIONS[style]}\n"
        f"Aspect ratio: {aspect_ratio}\n\n"
        f"Script:\n{script}"
    )


def _log_failure(error: Exception) -> None:
    # Only the error type, status and request id: OpenAI's error messages can quote part of the API key.
    logger.warning(
        "OpenAI script analysis failed: %s (status %s, request id %s)",
        type(error).__name__,
        getattr(error, "status_code", None),
        getattr(error, "request_id", None),
    )


def analyse_script(
    *, script: str, platform: Platform, style: VisualStyle, aspect_ratio: AspectRatio
) -> list[SceneCreate]:
    """Sends the script to OpenAI once and returns validated scenes, or raises AnalysisError."""
    client = get_openai_client()
    model = get_settings().openai_model
    try:
        response = client.responses.parse(
            model=model,
            instructions=INSTRUCTIONS,
            input=_describe_request(script, platform, style, aspect_ratio),
            text_format=GeneratedPlan,
            reasoning={"effort": "low"},
            max_output_tokens=MAX_OUTPUT_TOKENS,
            # Don't keep the script on OpenAI's side; nothing here needs a stored response.
            store=False,
        )
    except openai.AuthenticationError as error:
        _log_failure(error)
        raise AnalysisError("OpenAI rejected the API key. Check OPENAI_API_KEY in backend/.env.", 503) from None
    except (openai.PermissionDeniedError, openai.NotFoundError) as error:
        _log_failure(error)
        raise AnalysisError(f"Your OpenAI account can't use the model '{model}'. Check OPENAI_MODEL.", 503) from None
    except openai.RateLimitError as error:
        _log_failure(error)
        raise AnalysisError(
            "OpenAI's rate limit or quota was reached. Wait a minute, or check billing on your OpenAI account.", 429
        ) from None
    except openai.APITimeoutError as error:
        _log_failure(error)
        raise AnalysisError("OpenAI took too long to respond. Try again.", 504) from None
    except openai.APIConnectionError as error:
        _log_failure(error)
        raise AnalysisError("Couldn't connect to OpenAI. Check the internet connection and try again.", 502) from None
    except openai.APIStatusError as error:
        _log_failure(error)
        raise AnalysisError(f"OpenAI returned an error ({error.status_code}). Try again.", 502) from None
    except (ValidationError, ValueError) as error:
        # The reply wasn't valid JSON for GeneratedPlan, usually because it hit MAX_OUTPUT_TOKENS.
        _log_failure(error)
        raise AnalysisError(
            "The AI's reply was incomplete or not in the expected format. Try again, or shorten the script.", 502
        ) from None

    for item in response.output:
        if item.type == "message" and any(content.type == "refusal" for content in item.content):
            raise AnalysisError("The AI declined to analyse this script.", 422)
    if response.status == "incomplete":
        reason = getattr(response.incomplete_details, "reason", None)
        logger.warning("OpenAI script analysis incomplete: %s", reason)
        raise AnalysisError("The AI couldn't finish the plan. Try again, or shorten the script.", 502)

    plan = response.output_parsed
    if plan is None:
        raise AnalysisError("The AI returned an empty plan. Try analysing again.", 502)

    if response.usage is not None:
        logger.info(
            "Script analysis with %s: %d input + %d output tokens, %d scenes",
            model,
            response.usage.input_tokens,
            response.usage.output_tokens,
            len(plan.scenes),
        )
    return to_scenes(plan)
