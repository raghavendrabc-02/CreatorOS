"""Request and response shapes for the Visual Asset Generator API."""

from datetime import datetime
from typing import Annotated, Self

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

from app.models.visual_asset import MAX_SCRIPT_LENGTH, AspectRatio, ImageQuality, Platform, VisualStyle

# Leading and trailing spaces are removed before the length checks.
Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Script = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_SCRIPT_LENGTH)]
LongText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=10_000)]
TimeRange = Annotated[str, StringConstraints(strip_whitespace=True, max_length=50)]
Note = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=500)]
Notes = Annotated[list[Note], Field(max_length=20)]

MAX_SCENES = 200


def reject_nulls(model: BaseModel, fields: tuple[str, ...]) -> None:
    """In a partial update, leaving a field out means "keep it", but these fields can't be cleared with null."""
    for field in fields:
        if field in model.model_fields_set and getattr(model, field) is None:
            raise ValueError(f"{field} cannot be null")


# Scenes


class SceneCreate(BaseModel):
    """One scene of a plan. Its position comes from its place in the list."""

    title: Title
    time_range: TimeRange | None = None
    line: LongText
    prompt: LongText
    notes: Notes = []


class SceneUpdate(BaseModel):
    """Changes to one scene. Fields left out stay as they are."""

    title: Title | None = None
    time_range: TimeRange | None = None
    line: LongText | None = None
    prompt: LongText | None = None
    notes: Notes | None = None

    @model_validator(mode="after")
    def check_nulls(self) -> Self:
        reject_nulls(self, ("title", "line", "prompt", "notes"))
        return self


class SceneRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    position: int
    title: str
    time_range: str | None
    line: str
    prompt: str
    notes: list[str]
    created_at: datetime
    updated_at: datetime


# Projects


class ProjectCreate(BaseModel):
    platform: Platform
    title: Title | None = None
    script: Script
    style: VisualStyle = "cinematic"
    aspect_ratio: AspectRatio
    quality: ImageQuality = "high"
    # Optional: a plan can be saved together with the project, or later with PUT .../scenes.
    scenes: Annotated[list[SceneCreate], Field(max_length=MAX_SCENES)] = []


class ProjectUpdate(BaseModel):
    """Changes to a project. Fields left out stay as they are; title can be cleared with null."""

    platform: Platform | None = None
    title: Title | None = None
    script: Script | None = None
    style: VisualStyle | None = None
    aspect_ratio: AspectRatio | None = None
    quality: ImageQuality | None = None

    @model_validator(mode="after")
    def check_nulls(self) -> Self:
        reject_nulls(self, ("platform", "script", "style", "aspect_ratio", "quality"))
        return self


class ScenePlan(BaseModel):
    """A complete scene plan, in order. Replaces the project's current scenes."""

    scenes: Annotated[list[SceneCreate], Field(max_length=MAX_SCENES)]


class ProjectSummary(BaseModel):
    """A project in the list view: no script or scenes, just enough to pick one."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    platform: Platform
    title: str | None
    style: VisualStyle
    aspect_ratio: AspectRatio
    quality: ImageQuality
    scene_count: int
    created_at: datetime
    updated_at: datetime


class ProjectRead(BaseModel):
    """A full project with its script and scenes."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    platform: Platform
    title: str | None
    script: str
    style: VisualStyle
    aspect_ratio: AspectRatio
    quality: ImageQuality
    scenes: list[SceneRead]
    created_at: datetime
    updated_at: datetime


class AnalysisResult(BaseModel):
    """The project after analysis. reused is true when the script was unchanged and no AI request was made."""

    project: ProjectRead
    reused: bool
