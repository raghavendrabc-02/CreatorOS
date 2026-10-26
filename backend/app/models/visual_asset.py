"""Tables for the Visual Asset Generator: a script and its scene-by-scene visual plan.

The allowed values match the options in src/features/visual-assets/options.js on the frontend.
"""

from datetime import datetime
from typing import Literal, get_args

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# Each type lists the allowed values once. The API validates against the type, the database against the tuple.
Platform = Literal["instagram", "youtube"]
VisualStyle = Literal["cinematic", "documentary", "illustration", "3d", "minimal"]
AspectRatio = Literal["9:16", "4:5", "1:1", "16:9"]
ImageQuality = Literal["standard", "high"]

PLATFORMS = get_args(Platform)
VISUAL_STYLES = get_args(VisualStyle)
ASPECT_RATIOS = get_args(AspectRatio)
IMAGE_QUALITIES = get_args(ImageQuality)

# Same limit as the script textarea on the frontend.
MAX_SCRIPT_LENGTH = 50_000


def _one_of(column: str, values: tuple[str, ...]) -> CheckConstraint:
    """A database rule that only allows the listed values in the column."""
    allowed = ", ".join(f"'{value}'" for value in values)
    return CheckConstraint(f"{column} IN ({allowed})", name=column)


class VisualProject(Base):
    """One script to turn into visuals, with the settings chosen for it."""

    __tablename__ = "visual_projects"
    __table_args__ = (
        _one_of("platform", PLATFORMS),
        _one_of("style", VISUAL_STYLES),
        _one_of("aspect_ratio", ASPECT_RATIOS),
        _one_of("quality", IMAGE_QUALITIES),
        CheckConstraint(f"char_length(script) <= {MAX_SCRIPT_LENGTH}", name="script_length"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    platform: Mapped[str] = mapped_column(String(20))
    # Optional name to recognise the project later, e.g. "The real story of Zomato".
    title: Mapped[str | None] = mapped_column(String(200))
    script: Mapped[str] = mapped_column(Text)
    style: Mapped[str] = mapped_column(String(20), server_default="cinematic")
    aspect_ratio: Mapped[str] = mapped_column(String(10))
    quality: Mapped[str] = mapped_column(String(20), server_default="high")
    # Identifies the script and settings the current scenes were generated from (see app/services/script_analysis.py).
    # If they haven't changed, analysing again reuses the saved scenes instead of calling OpenAI.
    analysis_fingerprint: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Deleting a project also deletes its scenes.
    scenes: Mapped[list["VisualScene"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="VisualScene.position"
    )


class VisualScene(Base):
    """One scene of a project's visual plan, as produced by the AI analysis and edited by hand."""

    __tablename__ = "visual_scenes"
    __table_args__ = (
        # Each position appears once per project, so the scene order is unambiguous.
        UniqueConstraint("project_id", "position", name="uq_visual_scenes_project_id_position"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("visual_projects.id", ondelete="CASCADE"))
    # Order of the scene in the plan, starting at 1.
    position: Mapped[int]
    title: Mapped[str] = mapped_column(String(200))
    # Shown as written, e.g. "0:00 – 0:05".
    time_range: Mapped[str | None] = mapped_column(String(50))
    # The part of the script this scene illustrates.
    line: Mapped[str] = mapped_column(Text)
    # Prompt sent to the image generator.
    prompt: Mapped[str] = mapped_column(Text)
    # Editing notes, e.g. ["Slow zoom in", "Add text: \"2008\""].
    notes: Mapped[list[str]] = mapped_column(ARRAY(Text), server_default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    project: Mapped[VisualProject] = relationship(back_populates="scenes")
