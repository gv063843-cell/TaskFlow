from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.user import User
from models.project import Project
from models.task import Task

from schemas.user import UserCreate, UserResponse

from security import hash_password
from dependencies import get_current_user


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ==========================
# Get All Users
# ==========================

@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):

    return db.query(User).all()


# ==========================
# Create User
# ==========================

@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # Check existing email
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create User
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)

    # Get new user's ID
    db.flush()

    # ==========================
    # Automatically Create Project
    # ==========================

    default_project = Project(
        name="My Tasks",
        description="Default task project",
        owner_id=new_user.id
    )

    db.add(default_project)

    # Save everything
    db.commit()

    db.refresh(new_user)

    return new_user


# ==========================
# Current Logged-in User
# ==========================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):

    return current_user


# ==========================
# Get Single User
# ==========================

@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# ==========================
# Update User
# ==========================

@router.put(
    "/{user_id}",
    response_model=UserResponse
)
def update_user(
    user_id: int,
    updated_user: UserCreate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.name = updated_user.name
    user.email = updated_user.email

    user.password = hash_password(
        updated_user.password
    )

    db.commit()
    db.refresh(user)

    return user


# ==========================
# Delete User
# ==========================

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    # Find user
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    try:

        # ==========================
        # Find User Projects
        # ==========================

        projects = (
            db.query(Project)
            .filter(Project.owner_id == user_id)
            .all()
        )

        # ==========================
        # Delete Tasks
        # ==========================

        if projects:

            project_ids = [
                project.id
                for project in projects
            ]

            db.query(Task).filter(
                Task.project_id.in_(project_ids)
            ).delete(
                synchronize_session=False
            )

            # ==========================
            # Delete Projects
            # ==========================

            db.query(Project).filter(
                Project.id.in_(project_ids)
            ).delete(
                synchronize_session=False
            )

        # ==========================
        # Delete User
        # ==========================

        db.delete(user)

        db.commit()

        return {
            "message": "User Deleted Successfully"
        }

    except Exception as error:

        db.rollback()

        print(
            "Delete User Error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to delete user"
        )