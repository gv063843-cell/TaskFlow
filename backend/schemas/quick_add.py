from pydantic import BaseModel, Field


class QuickAddRequest(BaseModel):
    description: str = Field(min_length=1)
    project_id: int


class QuickAddParsed(BaseModel):
    title: str
    priority: str = Field(
        pattern="^(low|medium|high)$"
    )
    due_date_hint: str | None = None