from pydantic import BaseModel, Field, field_validator
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = Field(pattern="^(low|medium|high)$")
    due_date: Optional[str] = None
    status: Optional[str] = "Pending"
    project_id: int

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if not value.strip():
            raise ValueError("Title cannot be empty")
        return value


class TaskResponse(TaskCreate):
    id: int

    model_config = {
        "from_attributes": True
    }