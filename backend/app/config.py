from functools import lru_cache
from pathlib import Path
from typing import Literal

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


@lru_cache
def get_settings() -> Settings:
    """Returns the settings, read once and reused."""
    return Settings()
