import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routers.user import router as user_router
from routers.project import router as project_router
from routers.task import router as task_router
from routers.auth import router as auth_router

from database import Base, engine

from models.user import User
from models.project import Project
from models.task import Task


# ==========================================
# Create Database Tables
# ==========================================

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="TaskFlow API",
    version="1.0.0",
    description="AI Powered Task Management System"
)


# ==========================================
# Request Timing Middleware
# ==========================================

@app.middleware("http")
async def request_timing_middleware(
    request: Request,
    call_next
):
    start_time = time.perf_counter()

    response = await call_next(request)

    process_time = (
        time.perf_counter() - start_time
    ) * 1000

    print(
        f"{request.method} "
        f"{request.url.path} "
        f"{process_time:.2f} ms"
    )

    return response


# ==========================================
# CORS Configuration
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://wonderful-licorice-7b4921.netlify.app"
    ],

    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],

    allow_headers=[
        "Authorization",
        "Content-Type"
    ],
)


# ==========================================
# Include Routers
# ==========================================

app.include_router(user_router)
app.include_router(project_router)
app.include_router(task_router)
app.include_router(auth_router)


# ==========================================
# Home Route
# ==========================================

@app.get("/")
def home():
    return {
        "message": "🚀 Welcome to TaskFlow API"
    }


# ==========================================
# Health Check
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "✅ Server Running Successfully"
    }