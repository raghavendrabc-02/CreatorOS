from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# The backend/ folder. Used to find backend/.env no matter which folder the server is started from.
BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Application settings.

    Each value comes from, in order of priority: a real environment variable, backend/.env,
    then the default below. Names are not case-sensitive (APP_NAME sets app_name).
    """

    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", env_file_encoding="utf-8")

    app_name: str = "CreatorOS API"
    environment: Literal["development", "production"] = "development"

    # Frontend origins allowed to call the API from a browser (CORS).
    # Set as a JSON list, e.g. CORS_ORIGINS='["http://localhost:5173","https://example.com"]'.
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

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
