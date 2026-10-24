"""API routes for the Visual Asset Generator: projects (a script plus settings) and their scene plans."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.visual_asset import Platform, VisualProject, VisualScene
from app.schemas.visual_asset import (
    ProjectCreate,
    ProjectRead,
    ProjectSummary,
    ProjectUpdate,
    SceneCreate,
    ScenePlan,
    SceneRead,
    SceneUpdate,
)

router = APIRouter(prefix="/visual-projects", tags=["visual assets"])

DbSession = Annotated[Session, Depends(get_db)]


def get_project_or_404(db: Session, project_id: int) -> VisualProject:
    """Loads a project together with its scenes, or responds 404 if it doesn't exist."""
    project = db.get(VisualProject, project_id, options=[selectinload(VisualProject.scenes)])
    if project is None:
        raise HTTPException(status_code=404, detail="project not found")
    return project


def build_scenes(scenes: list[SceneCreate]) -> list[VisualScene]:
    """Turns a plan into scene rows, numbering them 1, 2, 3... in list order."""
    return [VisualScene(position=index, **scene.model_dump()) for index, scene in enumerate(scenes, start=1)]


def touch(project: VisualProject) -> None:
    """Marks the project as edited, so changing only its scenes still moves it to the top of the list."""
    project.updated_at = func.now()


# Projects


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(data: ProjectCreate, db: DbSession) -> VisualProject:
    project = VisualProject(**data.model_dump(exclude={"scenes"}), scenes=build_scenes(data.scenes))
    db.add(project)
    db.commit()
    return get_project_or_404(db, project.id)


@router.get("", response_model=list[ProjectSummary])
def list_projects(
    db: DbSession,
    platform: Platform | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> list[ProjectSummary]:
    """Projects with their scene counts, most recently edited first."""
    query = (
        select(VisualProject, func.count(VisualScene.id))
        .outerjoin(VisualProject.scenes)
        .group_by(VisualProject.id)
        .order_by(VisualProject.updated_at.desc(), VisualProject.id.desc())
        .limit(limit)
        .offset(offset)
    )
    if platform is not None:
        query = query.where(VisualProject.platform == platform)

    summary_fields = ProjectSummary.model_fields.keys() - {"scene_count"}
    return [
        ProjectSummary(scene_count=scene_count, **{field: getattr(project, field) for field in summary_fields})
        for project, scene_count in db.execute(query)
    ]


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: DbSession) -> VisualProject:
    return get_project_or_404(db, project_id)


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, data: ProjectUpdate, db: DbSession) -> VisualProject:
    project = get_project_or_404(db, project_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    return get_project_or_404(db, project_id)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: DbSession) -> Response:
    """Deletes the project and all of its scenes."""
    db.delete(get_project_or_404(db, project_id))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Scenes


@router.put("/{project_id}/scenes", response_model=ProjectRead)
def replace_scenes(project_id: int, plan: ScenePlan, db: DbSession) -> VisualProject:
    """Replaces the whole scene plan, e.g. after AI analysis or reordering. An empty list removes all scenes."""
    project = get_project_or_404(db, project_id)
    project.scenes.clear()
    # Remove the old scenes before adding the new ones, which reuse the same positions.
    db.flush()
    project.scenes.extend(build_scenes(plan.scenes))
    touch(project)
    db.commit()
    return get_project_or_404(db, project_id)


def get_scene_or_404(db: Session, project_id: int, scene_id: int) -> VisualScene:
    scene = db.get(VisualScene, scene_id)
    if scene is None or scene.project_id != project_id:
        raise HTTPException(status_code=404, detail="scene not found")
    return scene


@router.patch("/{project_id}/scenes/{scene_id}", response_model=SceneRead)
def update_scene(project_id: int, scene_id: int, data: SceneUpdate, db: DbSession) -> VisualScene:
    scene = get_scene_or_404(db, project_id, scene_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(scene, field, value)
    touch(scene.project)
    db.commit()
    db.refresh(scene)
    return scene


@router.delete("/{project_id}/scenes/{scene_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scene(project_id: int, scene_id: int, db: DbSession) -> Response:
    """Removes one scene. The others keep their positions, so their order is unchanged."""
    scene = get_scene_or_404(db, project_id, scene_id)
    touch(scene.project)
    db.delete(scene)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
