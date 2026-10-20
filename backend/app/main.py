from fastapi import FastAPI

from app.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0")


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Confirms the API process is running. Does not check the database."""
    return {"status": "ok"}
