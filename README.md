# TaskFlow — Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management application built with **FastAPI, SQLAlchemy, SQLite/PostgreSQL, HTML, CSS and JavaScript**.

The application allows users to create projects and tasks, manage tasks through CRUD operations, search and sort tasks using custom algorithms, view task statistics, and create structured tasks from natural-language descriptions using an AI-assisted rule-based Quick Add parser.

---

## Features

* User registration and login
* JWT-based authentication
* Project creation and listing
* Task creation, listing, updating and deletion
* Project-wise task management
* Task priority management
* Task due-date support
* Task status management
* Task statistics
* Custom insertion sort
* Custom binary search
* Custom linear search
* Algorithm comparison benchmarks
* AI-assisted Quick Add
* Deterministic mock AI parser
* LocalStorage task caching
* Responsive frontend dashboard
* FastAPI request-timing middleware
* CORS configuration
* SQLite for local development
* PostgreSQL support for production deployment
* Swagger/OpenAPI documentation

---

# Technology Stack

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn
* SQLite
* PostgreSQL
* JWT Authentication

## Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* LocalStorage

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
│   │   ├── project.py
│   │   ├── task.py
│   │   └── ...
│   │
│   ├── schemas/
│   │   ├── task.py
│   │   ├── project.py
│   │   └── quick_add.py
│   │
│   ├── ai_parser.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

---

# Environment Setup

Clone the repository:

```bash
git clone https://github.com/gv063843-cell/TaskFlow.git
cd TaskFlow
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

---

# Running the Backend Locally

Move into the backend directory:

```powershell
cd backend
```

Run FastAPI with Uvicorn:

```powershell
python -m uvicorn main:app --reload
```

The local API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# API Endpoints

## Authentication

### Register

```text
POST /auth/register
```

Creates a new user account.

### Login

```text
POST /auth/login
```

Authenticates a user and returns an access token.

The token is used as:

```text
Authorization: Bearer <token>
```

---

# Projects

## Create Project

```text
POST /projects/
```

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
  "owner_id": 4
}
```

## List Projects

```text
GET /projects/
```

Returns projects belonging to the authenticated user.

---

# Tasks

## Create Task

```text
POST /tasks/
```

Example request:

```json
{
  "title": "Complete project",
  "description": "Complete TaskFlow API project",
  "priority": "medium",
  "due_date": null,
  "status": "Pending",
  "project_id": 1
}
```

Example response:

```json
{
  "title": "Complete project",
  "description": "Complete TaskFlow API project",
  "priority": "medium",
  "due_date": null,
  "status": "Pending",
  "project_id": 1,
  "id": 1
}
```

## List Tasks

```text
GET /tasks/
```

Returns tasks belonging to projects owned by the authenticated user.

## Sort Tasks by Priority

```text
GET /tasks/?sort=priority
```

Tasks are sorted using the custom insertion-sort implementation.

Priority ranking:

```text
low = 1
medium = 2
high = 3
```

## Get Task by ID

```text
GET /tasks/{task_id}
```

Example:

```text
GET /tasks/2
```

## Update Task

```text
PUT /tasks/{task_id}
```

Example request:

```json
{
  "title": "game updated",
  "description": "updated test task",
  "priority": "high",
  "due_date": "tomorrow",
  "status": "Completed",
  "project_id": 1
}
```

## Delete Task

```text
DELETE /tasks/{task_id}
```

Example response:

```json
{
  "message": "Task Deleted Successfully"
}
```

---

# Task Search

TaskFlow supports two custom search algorithms.

## Binary Search

```text
GET /tasks/search?title=game&algo=binary
```

Before binary search, the task index is sorted using custom insertion sort.

Binary search provides:

```text
O(log n)
```

search complexity after sorting.

## Linear Search

```text
GET /tasks/search?title=game&algo=linear
```

Linear search checks records sequentially.

Worst-case complexity:

```text
O(n)
```

---

# Task Statistics

```text
GET /projects/stats/summary
```

Example response:

```json
[
  {
    "project_id": 1,
    "project_name": "TaskFlow API",
    "total_tasks": 1,
    "completed_tasks": 0,
    "pending_tasks": 1
  }
]
```

Statistics are calculated using SQL aggregate operations.

---

# Algorithms Engine

TaskFlow implements the following algorithms manually rather than relying on Python's built-in sorting/searching functions.

## Insertion Sort

Insertion sort is used for:

* Sorting tasks by priority
* Preparing task data for binary search

Complexity:

```text
Best Case:    O(n)
Average Case: O(n²)
Worst Case:   O(n²)
Space:        O(1)
```

## Binary Search

Binary search operates on a sorted list.

Complexity:

```text
Best Case:    O(1)
Average Case: O(log n)
Worst Case:   O(log n)
Space:        O(1)
```

## Linear Search

Linear search checks records one by one.

Complexity:

```text
Best Case:    O(1)
Average Case: O(n)
Worst Case:   O(n)
Space:        O(1)
```

---

# Algorithm Testing

Algorithm checks are implemented in:

```text
backend/algorithms/check_algorithms.py
```

Run:

```powershell
python algorithms\check_algorithms.py
```

Successful test output includes:

```text
PASS: insertion_sort empty list
PASS: insertion_sort single element
PASS: binary_search first index
PASS: binary_search middle index
PASS: binary_search last index
PASS: binary_search not found
PASS: insertion_sort_count sorted result
PASS: insertion_sort_count comparison count
PASS: binary_search_count
PASS: linear_search_count absent value

Algorithm checks completed.
```

---

# Benchmark Results

Benchmark implementation:

```text
backend/algorithms/benchmark.py
```

Run:

```powershell
python algorithms\benchmark.py
```

Observed comparison counts:

| Data Size | Insertion Sort | Binary Search | Linear Search |
| --------: | -------------: | ------------: | ------------: |
|        10 |             45 |             1 |             6 |
|       500 |        124,750 |             1 |           251 |
|     3,000 |      4,498,500 |             1 |         1,501 |

The benchmark demonstrates the expected growth of insertion sort and linear search compared with binary search.

---

# AI Quick Add

TaskFlow provides an AI-assisted Quick Add feature.

The feature accepts a natural-language task description and converts it into a structured task containing:

* Title
* Priority
* Due-date hint
* Description
* Status
* Project

The required implementation is a deterministic mock AI parser and does not require an external API key or network request.

Endpoint:

```text
POST /tasks/quick-add
```

Example request:

```json
{
  "description": "Complete project tomorrow with high priority",
  "project_id": 4
}
```

Example response:

```json
{
  "title": "Complete project with",
  "description": "Complete project tomorrow with high priority",
  "priority": "high",
  "due_date": "tomorrow",
  "status": "Pending",
  "project_id": 4,
  "id": 19
}
```

---

# AI Parser Logic

The parser recognizes priority keywords such as:

```text
urgent
asap
whenever
low priority
```

It recognizes due-date phrases such as:

```text
today
tomorrow
next week
next monday
next tuesday
next wednesday
next thursday
next friday
next saturday
next sunday
monday
tuesday
wednesday
thursday
friday
saturday
sunday
```

The parser removes recognized priority and date phrases from the generated title.

---

# AI Quick Add Examples

## Example 1

Input:

```text
Finish report today
```

Parsed result:

```json
{
  "title": "Finish report",
  "priority": "medium",
  "due_date": "today"
}
```

## Example 2

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

## Example 3

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

## Example 4

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

## Example 5

Input:

```text
Complete project tomorrow with high priority
```

Parsed result:

```json
{
  "title": "Complete project with",
  "priority": "high",
  "due_date": "tomorrow"
}
```

---

# LocalStorage

The frontend uses browser LocalStorage for task caching.

This allows the dashboard to retain cached task information in the browser and reduce unnecessary repeated data handling on the client side.

---

# Request Timing Middleware

FastAPI middleware measures the processing time of incoming requests.

The backend logs:

* HTTP method
* Request path
* Processing time in milliseconds

Example:

```text
GET /tasks/ 3.42 ms
```

---

# CORS

The FastAPI application includes CORS configuration to allow requests from the configured frontend origins.

This enables the deployed frontend to communicate with the FastAPI backend.

---

# Deployment

## Backend

The TaskFlow backend is deployed using Render.

Live API:

```text
https://taskflow-api-ax00.onrender.com
```

Swagger documentation:

```text
https://taskflow-api-ax00.onrender.com/docs
```

## Frontend

The frontend is deployed separately and communicates with the deployed FastAPI backend through the configured API URL.

---

# Git Workflow

TaskFlow uses a feature-branch workflow.

The assignment development was completed on:

```text
assignment-complete
```

The completed changes were then merged into:

```text
main
```

The final production code is available on the `main` branch.

The repository contains the assignment development and merge history.

---

# Repository

GitHub repository:

```text
https://github.com/gv063843-cell/TaskFlow
```

---

# Submission

TaskFlow is maintained as a single GitHub repository containing:

* `backend/` — FastAPI backend, SQLAlchemy models, algorithms and AI Quick Add parser
* `frontend/` — HTML, CSS and JavaScript dashboard
* `README.md` — project setup, API documentation, algorithms, benchmarks and AI Quick Add documentation

The application has been tested locally and the backend is deployed as a live FastAPI service.
