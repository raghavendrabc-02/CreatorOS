from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.config import get_settings
from app.database import engine

settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0")

# Lets the configured frontend origins call the API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Confirms the API process is running. Does not check the database."""
    return {"status": "ok"}


@app.get("/health/db", tags=["health"])
def health_db() -> dict[str, str]:
    """Confirms the API can reach PostgreSQL. Returns 503 without error details if it can't."""
    if engine is None:
        raise HTTPException(status_code=503, detail="database not configured")
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="database unreachable") from None
    return {"status": "ok", "database": "ok"}
