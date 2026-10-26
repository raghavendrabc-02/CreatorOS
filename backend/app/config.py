from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# The backend/ folder. Used to find backend/.env no matter which folder the server is started from.
BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Application settings.

    Each value comes from, in order of priority: a real environment variable, backend/.env,
    then the default below. Names are not case-sensitive (APP_NAME sets app_name).
    """

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        # A mistyped or invalid setting still stops startup, but its value (which may be a secret) isn't printed.
        hide_input_in_errors=True,
    )

    app_name: str = "CreatorOS API"
    environment: Literal["development", "production"] = "development"

    # Frontend origins allowed to call the API from a browser (CORS).
    # Set as a JSON list, e.g. CORS_ORIGINS='["http://localhost:5173","https://example.com"]'.
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # PostgreSQL connection string, e.g. postgresql+psycopg://user:password@localhost:5432/creatoros.
    # Contains a password, so it only ever goes in backend/.env or the hosting service's settings.
    database_url: str | None = None

    # OpenAI, used to analyse scripts into scene plans. Without a key the rest of the API still works.
    # SecretStr keeps the key out of logs and error messages: it prints as '**********'.
    openai_api_key: SecretStr | None = None
    # Model for script analysis. Cost-effective default; change it here or in backend/.env.
    openai_model: str = "gpt-6-luna"

    @field_validator("openai_api_key")
    @classmethod
    def empty_key_means_unset(cls, key: SecretStr | None) -> SecretStr | None:
        # OPENAI_API_KEY= (left blank) counts as not configured.
        return key if key is not None and key.get_secret_value().strip() else None

    @field_validator("cors_origins")
    @classmethod
    def check_cors_origins(cls, origins: list[str]) -> list[str]:
        # Browsers send origins without a trailing slash, so "https://site.com/" would never match.
        cleaned = [origin.strip().rstrip("/") for origin in origins]
        if "*" in cleaned:
            raise ValueError("wildcard '*' is not allowed; list each frontend origin explicitly")
        return cleaned


@lru_cache
def get_settings() -> Settings:
    """Returns the settings, read once and reused."""
    return Settings()
