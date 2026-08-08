from pydantic import BaseModel

class QuickAddRequest(BaseModel):
    description: str
    project_id: int