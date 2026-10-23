from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()

# None when DATABASE_URL is not set, so the API can still start (and /health still works) without a database.
# pool_pre_ping checks each pooled connection before use, so a restarted PostgreSQL doesn't cause errors.
engine = create_engine(settings.database_url, pool_pre_ping=True) if settings.database_url else None

SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    """Parent class for all database models (tables)."""


def get_db() -> Iterator[Session]:
    """FastAPI dependency: gives a route one database session and closes it when the request ends."""
    if engine is None:
        raise RuntimeError("DATABASE_URL is not set; add it to backend/.env")
    with SessionLocal() as session:
        yield session
