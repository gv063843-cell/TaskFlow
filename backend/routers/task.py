from schemas.quick_add import QuickAddRequest
from ai_parser import mock_ai_parser

from algorithms.sorting_searching import (
    insertion_sort,
    binary_search,
    linear_search,
)

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.task import Task
from models.project import Project
from models.user import User

from schemas.task import TaskCreate, TaskResponse
from dependencies import get_current_user


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# ======================================
# Get All Tasks + Sorting
# ======================================

@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    sort: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    tasks = (
        db.query(Task)
        .join(Project)
        .filter(Project.owner_id == current_user.id)
        .all()
    )

    # ----------------------------------
    # Sort by Priority
    # ----------------------------------

    if sort == "priority":

        priority_rank = {
            "low": 1,
            "medium": 2,
            "high": 3
        }

        task_list = []

        for task in tasks:

            task_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": priority_rank[task.priority],
                "due_date": task.due_date,
                "status": task.status,
                "project_id": task.project_id
            })

        # Custom insertion sort
        insertion_sort(task_list, "priority")

        reverse_rank = {
            1: "low",
            2: "medium",
            3: "high"
        }

        for task in task_list:
            task["priority"] = reverse_rank[task["priority"]]

        return task_list

    return tasks


# ======================================
# Search Task
# ======================================

@router.get("/search", response_model=TaskResponse)
def search_task(
    title: str,
    algo: str = "binary",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    tasks = (
        db.query(Task)
        .join(Project)
        .filter(Project.owner_id == current_user.id)
        .all()
    )

    # ----------------------------------
    # Build task index
    # ----------------------------------

    task_index = []

    for task in tasks:

        task_index.append({
            "id": task.id,
            "title": task.title
        })

    search_title = title.strip()

    # ----------------------------------
    # Binary Search
    # ----------------------------------

    if algo == "binary":

        # Sort using custom insertion sort
        insertion_sort(task_index, "title")

        index = binary_search(
            task_index,
            search_title,
            "title"
        )

    # ----------------------------------
    # Linear Search
    # ----------------------------------

    elif algo == "linear":

        index = linear_search(
            task_index,
            search_title,
            "title"
        )

    # ----------------------------------
    # Invalid Algorithm
    # ----------------------------------

    else:

        raise HTTPException(
            status_code=400,
            detail="Invalid search algorithm. Use binary or linear."
        )

    # ----------------------------------
    # Not Found
    # ----------------------------------

    if index == -1:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    # ----------------------------------
    # Get Matching Task
    # ----------------------------------

    task_id = task_index[index]["id"]

    task = (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# ======================================
# Create Task
# ======================================

@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(
            Project.id == task.project_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        status=task.status,
        project_id=task.project_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# ======================================
# Quick Add / AI Task
# ======================================

@router.post(
    "/quick-add",
    response_model=TaskResponse,
    status_code=201
)
def quick_add_task(
    request: QuickAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    project = (
        db.query(Project)
        .filter(
            Project.id == request.project_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not project:

        raise HTTPException(
            status_code=422,
            detail="Project not found"
        )

    # Run deterministic mock AI parser
    parsed = mock_ai_parser(request.description)

    task = Task(
        title=parsed["title"],
        description=request.description,
        priority=parsed["priority"],
        due_date=parsed["due_date"],
        status="Pending",
        project_id=request.project_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# ======================================
# Get Single Task
# ======================================

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    task = (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# ======================================
# Update Task
# ======================================

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    updated_task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    task = (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.title = updated_task.title
    task.description = updated_task.description
    task.priority = updated_task.priority
    task.due_date = updated_task.due_date
    task.status = updated_task.status

    db.commit()
    db.refresh(task)

    return task


# ======================================
# Delete Task
# ======================================

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    task = (
        db.query(Task)
        .join(Project)
        .filter(
            Task.id == task_id,
            Project.owner_id == current_user.id
        )
        .first()
    )

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task Deleted Successfully"
    }