from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from database import get_db
from models.project import Project
from models.task import Task
from models.user import User

from schemas.project import ProjectCreate, ProjectResponse
from dependencies import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


# =========================================================
# GET ALL PROJECTS
# =========================================================

@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    projects = (
        db.query(Project)
        .filter(Project.owner_id == current_user.id)
        .all()
    )

    return projects


# =========================================================
# CREATE PROJECT
# =========================================================

@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=201
)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_project = Project(
        name=project.name,
        description=project.description,
        owner_id=current_user.id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


# =========================================================
# PROJECT STATISTICS
# IMPORTANT: KEEP THIS ABOVE /{project_id}
# =========================================================

@router.get("/stats/summary")
def project_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    stats = (
        db.query(
            Project.id,
            Project.name,

            func.count(Task.id).label(
                "total_tasks"
            ),

            func.sum(
                case(
                    (Task.status == "Completed", 1),
                    else_=0
                )
            ).label(
                "completed_tasks"
            )
        )
        .outerjoin(
            Task,
            Project.id == Task.project_id
        )
        .filter(
            Project.owner_id == current_user.id
        )
        .group_by(
            Project.id,
            Project.name
        )
        .all()
    )

    result = []

    for project in stats:

        total = project.total_tasks or 0

        completed = (
            project.completed_tasks or 0
        )

        pending = total - completed

        progress = (
            round(
                (completed / total) * 100
            )
            if total > 0
            else 0
        )

        result.append({
            "project_id": project.id,
            "project_name": project.name,
            "total_tasks": total,
            "completed_tasks": completed,
            "pending_tasks": pending,
            "progress": progress
        })

    return result


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return project


# =========================================================
# UPDATE PROJECT
# =========================================================

@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project.name = project_data.name

    project.description = (
        project_data.description
    )

    db.commit()
    db.refresh(project)

    return project


# =========================================================
# DELETE PROJECT
# =========================================================

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Delete tasks belonging to project first
    db.query(Task).filter(
        Task.project_id == project_id
    ).delete(
        synchronize_session=False
    )

    db.delete(project)

    db.commit()

    return {
        "message": "Project deleted successfully"
    }