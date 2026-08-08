from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.user import router as user_router
from routers.project import router as project_router
from routers.task import router as task_router
from routers.auth import router as auth_router

from database import Base, engine

from models.user import User
from models.project import Project
from models.task import Task


# Create Database Tables

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="TaskFlow API",
    version="1.0.0",
    description="AI Powered Task Management System"
)


# CORS Configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Routers

app.include_router(user_router)
app.include_router(project_router)
app.include_router(task_router)
app.include_router(auth_router)


# Home Route

@app.get("/")
def home():
    return {
        "message": "🚀 Welcome to TaskFlow API"
    }


# Health Check

@app.get("/health")
def health():
    return {
        "status": "✅ Server Running Successfully"
    }