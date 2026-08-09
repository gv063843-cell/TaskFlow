# TaskFlow — Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management application built with FastAPI, SQLAlchemy, SQLite, HTML, CSS and JavaScript.

The application allows users to create projects and tasks, manage tasks through CRUD operations, search and sort tasks using custom algorithms, and create tasks using an AI-assisted rule-based quick-add parser.

---

## Features

- User registration and login
- Project creation and listing
- Task creation, listing, updating and deletion
- Task priority management
- Task due-date support
- Task statistics
- Custom insertion sort
- Custom binary search
- Custom linear search
- Algorithm comparison benchmarks
- AI-assisted Quick Add
- LocalStorage task caching
- Responsive frontend dashboard
- FastAPI request timing middleware
- CORS configuration
- SQLite for local development
- PostgreSQL for production deployment
- SQLAlchemy ORM

---

# Technology Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- PostgreSQL
- Uvicorn

## Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage

---

# Project Structure

```text
TaskFlow/
│
├── backend/
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── sorting_searching.py
│   │   ├── check_algorithms.py
│   │   └── benchmark.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── quick_add.py
│   │
│   ├── ai_parser.py
│   ├── auth.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── security.py
│   └── taskflow.db
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── login.js
│   ├── register.html
│   ├── register.js
│   ├── script.js
│   └── style.css
│
├── requirements.txt
├── README.md
└── .gitignore

---

# Environment Setup

## 1. Clone the Repository

```bash
git clone https://github.com/gv063843-cell/TaskFlow.git
cd TaskFlow
```

## 2. Create Virtual Environment

Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Running the App

## Start the Backend

From the `TaskFlow` root directory:

```powershell
cd backend
uvicorn main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

The backend uses PostgreSQL when the `DATABASE_URL` environment variable is configured. If it is not configured, the application falls back to SQLite for local development.

---

# API Endpoints

All protected endpoints require a valid JWT access token in the request header:

```text
Authorization: Bearer <access_token>
```

## Authentication

### POST `/auth/login`

Logs in an existing user and returns a JWT access token.

Example request:

```text
username=user@example.com
password=yourpassword
```

Example response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

---

# User Endpoints

### POST `/users/`

Creates a new user.

Example request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "id": 1,
  "email": "user@example.com"
}
```

---

# Project Endpoints

### POST `/projects/`

Creates a project for the authenticated user.

Example request:

```json
{
  "name": "TaskFlow API",
  "description": "My First Project"
}
```

Example response:

```json
{
  "id": 1,
  "name": "TaskFlow API",
  "description": "My First Project",
  "owner_id": 1
}
```

### GET `/projects/`

Returns all projects belonging to the authenticated user.

Example response:

```json
[
  {
    "id": 1,
    "name": "TaskFlow API",
    "description": "My First Project",
    "owner_id": 1
  }
]
```

### GET `/projects/{project_id}`

Returns a single project.

Example:

```text
GET /projects/1
```

Example response:

```json
{
  "id": 1,
  "name": "TaskFlow API",
  "description": "My First Project",
  "owner_id": 1
}
```

### GET `/projects/stats/summary`

Returns task statistics for the user's projects.

Example response:

```json
[
  {
    "project_id": 1,
    "project_name": "TaskFlow API",
    "total_tasks": 3,
    "completed_tasks": 1,
    "pending_tasks": 2
  }
]
```

---

# Task Endpoints

### POST `/tasks/`

Creates a task.

Example request:

```json
{
  "title": "Complete project",
  "description": "Finish TaskFlow assignment",
  "priority": "high",
  "due_date": "2026-08-15",
  "status": "Pending",
  "project_id": 1
}
```

Example response:

```json
{
  "title": "Complete project",
  "description": "Finish TaskFlow assignment",
  "priority": "high",
  "due_date": "2026-08-15",
  "status": "Pending",
  "project_id": 1,
  "id": 1
}
```

### GET `/tasks/`

Returns all tasks belonging to the authenticated user's projects.

Example response:

```json
[
  {
    "title": "Complete project",
    "description": "Finish TaskFlow assignment",
    "priority": "high",
    "due_date": "2026-08-15",
    "status": "Pending",
    "project_id": 1,
    "id": 1
  }
]
```

### GET `/tasks/{task_id}`

Returns a single task.

Example:

```text
GET /tasks/1
```

Example response:

```json
{
  "title": "Complete project",
  "description": "Finish TaskFlow assignment",
  "priority": "high",
  "due_date": "2026-08-15",
  "status": "Pending",
  "project_id": 1,
  "id": 1
}
```

### PUT `/tasks/{task_id}`

Updates an existing task.

Example request:

```json
{
  "title": "Complete TaskFlow project",
  "description": "Finish and submit the project",
  "priority": "high",
  "due_date": "2026-08-16",
  "status": "Completed",
  "project_id": 1
}
```

Example response:

```json
{
  "title": "Complete TaskFlow project",
  "description": "Finish and submit the project",
  "priority": "high",
  "due_date": "2026-08-16",
  "status": "Completed",
  "project_id": 1,
  "id": 1
}
```

### DELETE `/tasks/{task_id}`

Deletes a task.

Example:

```text
DELETE /tasks/1
```

Example response:

```json
{
  "message": "Task Deleted Successfully"
}
```

---

# Sorted Task List

### GET `/tasks/?sort=priority`

Returns tasks sorted by priority using the custom insertion sort algorithm.

Priority order:

```text
low → medium → high
```

Example response:

```json
[
  {
    "title": "Read documentation",
    "priority": "low",
    "status": "Pending",
    "project_id": 1,
    "id": 2
  },
  {
    "title": "Complete project",
    "priority": "high",
    "status": "Pending",
    "project_id": 1,
    "id": 1
  }
]
```

---

# Task Search

### GET `/tasks/search/`

Searches tasks using either binary search or linear search.

## Binary Search

Example:

```text
GET /tasks/search/?title=Complete%20project&algo=binary
```

Example response:

```json
[
  {
    "title": "Complete project",
    "description": "Finish TaskFlow assignment",
    "priority": "high",
    "due_date": "2026-08-15",
    "status": "Pending",
    "project_id": 1,
    "id": 1
  }
]
```

## Linear Search

Example:

```text
GET /tasks/search/?title=Complete%20project&algo=linear
```

The endpoint also supports partial title matching when an exact match is not found.

---

# AI-Assisted Quick Add

### POST `/tasks/quick-add`

Creates a task using the rule-based AI-assisted parser.

The feature does not require an API key or external network request.

Example request:

```json
{
  "description": "Complete the project tomorrow with high priority",
  "project_id": 1
}
```

Example response:

```json
{
  "title": "Complete the project",
  "description": "Complete the project tomorrow with high priority",
  "priority": "high",
  "due_date": "2026-08-11",
  "status": "Pending",
  "project_id": 1,
  "id": 2
}
```

---

# Algorithms

TaskFlow implements custom searching and sorting algorithms in:

```text
backend/algorithms/sorting_searching.py
```

## Insertion Sort

Insertion sort is used to sort task records by priority and to prepare task records for binary search.

Time complexity:

```text
Best Case:    O(n)
Average Case: O(n²)
Worst Case:   O(n²)
```

Space complexity:

```text
O(1)
```

## Binary Search

Binary search is used to search an ordered task index.

Time complexity:

```text
Best Case:    O(1)
Average Case: O(log n)
Worst Case:   O(log n)
```

Space complexity:

```text
O(1)
```

## Linear Search

Linear search checks task records sequentially.

Time complexity:

```text
Best Case:    O(1)
Average Case: O(n)
Worst Case:   O(n)
```

Space complexity:

```text
O(1)
```

---

# Algorithm Benchmark Results

The benchmark script compares the custom algorithms using different data sizes.

## Data Size: 10

```text
Insertion Sort comparisons: 45
Binary Search: index = 4, comparisons = 1
Linear Search: index = 5, comparisons = 6
```

## Data Size: 500

```text
Insertion Sort comparisons: 124750
Binary Search: index = 249, comparisons = 1
Linear Search: index = 250, comparisons = 251
```

## Data Size: 3000

```text
Insertion Sort comparisons: 4498500
Binary Search: index = 1499, comparisons = 1
Linear Search: index = 1500, comparisons = 1501
```

The benchmark demonstrates the expected difference between quadratic insertion sort, logarithmic binary search, and linear search.

---

# AI Quick-Add Technique

The Quick Add feature uses a local rule-based parser rather than a real external LLM.

The parser receives a natural-language task description and extracts useful task information such as:

* Task title
* Priority
* Due date

The parsed information is then used to create a normal TaskFlow task.

No API key is required and no external network request is made.

## Why This Technique Is Used

A rule-based parser provides a simple and deterministic implementation for the assignment. It also keeps the required Quick Add feature independent of paid AI services or external API availability.

---

# Five Quick-Add Examples

## Example 1

Input:

```text
Complete project tomorrow with high priority
```

Parsed result:

```json
{
  "title": "Complete project",
  "priority": "high",
  "due_date": "tomorrow"
}
```

## Example 2

Input:

```text
Buy groceries today
```

Parsed result:

```json
{
  "title": "Buy groceries",
  "priority": "medium",
  "due_date": "today"
}
```

## Example 3

Input:

```text
Read Python documentation next week
```

Parsed result:

```json
{
  "title": "Read Python documentation",
  "priority": "medium",
  "due_date": "next week"
}
```

## Example 4

Input:

```text
Submit assignment with low priority
```

Parsed result:

```json
{
  "title": "Submit assignment",
  "priority": "low",
  "due_date": null
}
```

## Example 5

Input:

```text
Finish backend task urgently
```

Parsed result:

```json
{
  "title": "Finish backend task",
  "priority": "high",
  "due_date": null
}
```

---

# LocalStorage

The frontend uses browser LocalStorage for task caching.

This allows the dashboard to retain cached task information in the browser and reduce unnecessary repeated data handling on the client side.

---

# Request Timing Middleware

FastAPI middleware measures the processing time of each incoming request.

The backend prints the request method, path and processing time in milliseconds.

Example:

```text
GET /tasks/ 3.42 ms
```

---

# CORS

The FastAPI application includes CORS configuration to allow requests from the configured local frontend and deployed frontend.

---

# Deployment

The TaskFlow backend is deployed as a live FastAPI service.

Live API:

```text
https://taskflow-api-ax00.onrender.com
```

Swagger API documentation:

```text
https://taskflow-api-ax00.onrender.com/docs
```

---

# Git Workflow

The project uses Git with a feature-branch workflow.

The `assignment-complete` branch was used for assignment development and contains multiple commits before being merged into the `main` branch.

The repository therefore contains the required feature-branch and merge history.

---

# Submission

TaskFlow is maintained as a single GitHub repository containing:

* `backend/` — FastAPI backend, SQLAlchemy models, algorithms and AI quick-add parser
* `frontend/` — HTML, CSS and JavaScript dashboard
* `README.md` — project setup, API documentation, algorithms, benchmarks and AI Quick Add documentation

GitHub repository:

```text
https://github.com/gv063843-cell/TaskFlow
```
