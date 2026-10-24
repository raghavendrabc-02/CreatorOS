from collections.abc import Iterator

from fastapi import HTTPException
from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()

# None when DATABASE_URL is not set, so the API can still start (and /health still works) without a database.
# pool_pre_ping checks each pooled connection before use, so a restarted PostgreSQL doesn't cause errors.
engine = create_engine(settings.database_url, pool_pre_ping=True) if settings.database_url else None

SessionLocal = sessionmaker(bind=engine, autoflush=False)

# Predictable names for keys, indexes and constraints (e.g. uq_users_email), so Alembic migrations can
# refer to them by name later. Must stay unchanged once the first migration has been applied.
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Parent class for all database models (tables)."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: gives a route one database session and closes it when the request ends."""
    if engine is None:
        # Same response as /health/db, instead of a 500 error. Set DATABASE_URL in backend/.env.
        raise HTTPException(status_code=503, detail="database not configured")
    with SessionLocal() as session:
        yield session
