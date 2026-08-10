# TaskFlow — Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management application built with **FastAPI, SQLAlchemy, SQLite, HTML, CSS and JavaScript**.

The application allows users to register and log in, create projects and tasks, manage tasks through CRUD operations, search tasks, view project statistics, and create structured tasks from natural-language descriptions using an **AI-assisted deterministic rule-based Quick Add parser**.

The application supports both **local development and live deployment**.

---

# Features

* User registration and login
* JWT-based authentication
* Secure password hashing
* Automatic default project creation for new users
* Project creation, listing, editing and deletion
* Project-wise task management
* Task creation, listing, updating and deletion
* Task completion
* Task priority management
* Task due-date support
* Task status management
* Task search
* Custom insertion sort
* Custom binary search
* Custom linear search
* Algorithm comparison benchmarks
* Algorithm test cases
* AI-assisted Quick Add
* Deterministic rule-based task parser
* LocalStorage authentication handling
* Responsive frontend dashboard
* FastAPI request-timing middleware
* CORS configuration
* SQLite database for local development
* PostgreSQL support for production
* Swagger/OpenAPI documentation
* Local frontend and backend testing
* Live frontend and backend deployment

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

## Deployment

* Render — Backend API
* Netlify — Frontend
* GitHub — Version Control

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
│   │   └── user.py
│   │
│   ├── schemas/
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── project.py
│   │   └── quick_add.py
│   │
│   ├── tests/
│   │
│   ├── ai_parser.py
│   ├── auth.py
│   ├── database.py
│   ├── dependencies.py
│   ├── security.py
│   ├── main.py
│   ├── requirements.txt
│   ├── taskflow.db
│   └── __init__.py
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
├── README.md
└── requirements.txt
```

---

# Environment Setup

Clone the repository:

```bash
git clone https://github.com/gv063843-cell/TaskFlow.git
cd TaskFlow
```

Create a virtual environment:

## Windows

```powershell
python -m venv venv
```

Activate the virtual environment:

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

Swagger/OpenAPI documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Expected health response:

```json
{
  "status": "✅ Server Running Successfully"
}
```

---

# Running the Frontend Locally

Open another terminal from the project root.

Move into the frontend directory:

```powershell
cd frontend
```

Start a local HTTP server:

```powershell
python -m http.server 3000
```

The frontend will be available at:

```text
http://127.0.0.1:3000
```

The local frontend communicates with the local FastAPI backend.

```text
Local Frontend
http://127.0.0.1:3000
        │
        ▼
Local FastAPI Backend
http://127.0.0.1:8000
        │
        ▼
SQLite Database
```

---

# Local and Live Environment

TaskFlow supports both local and live environments.

## Local Environment

Frontend:

```text
http://127.0.0.1:3000
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Live Environment

Frontend:

```text
https://wonderful-licorice-7b4921.netlify.app
```

Backend:

```text
https://taskflow-api-ax00.onrender.com
```

Swagger:

```text
https://taskflow-api-ax00.onrender.com/docs
```

The frontend automatically selects the local API when running on localhost/127.0.0.1 and the deployed Render API when running on the live frontend.

---

# Authentication

TaskFlow uses **JWT-based authentication**.

## User Registration

```text
POST /users/
```

Creates a new user account.

Example request:

```json
{
  "name": "Gaurav",
  "email": "user@example.com",
  "password": "password123"
}
```

After registration, TaskFlow automatically creates a default project:

```text
My Tasks
```

## Login

```text
POST /auth/login
```

Authenticates a registered user and returns a JWT access token.

The token is stored in browser LocalStorage.

Authenticated API requests use:

```text
Authorization: Bearer <token>
```

If the token becomes invalid or expires, the frontend removes the token and redirects the user to the login page.

---

# Projects

Projects allow users to organize tasks into separate work areas.

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

## List Projects

```text
GET /projects/
```

Returns projects belonging to the authenticated user.

## Get Project

```text
GET /projects/{project_id}
```

## Update Project

```text
PUT /projects/{project_id}
```

Supports updating:

* Project name
* Project description

## Delete Project

```text
DELETE /projects/{project_id}
```

Deleting a project also removes its associated tasks according to the configured database relationships.

The frontend provides:

* Project selection
* Create Project
* Edit Project
* Delete Project
* Project progress

---

# Tasks

Tasks are associated with projects and can be managed through the dashboard.

## Create Task

```text
POST /tasks/
```

Example request:

```json
{
  "title": "Complete project",
  "description": "Complete TaskFlow project",
  "priority": "medium",
  "due_date": null,
  "status": "Pending",
  "project_id": 1
}
```

## List Tasks

```text
GET /tasks/
```

Returns tasks accessible to the authenticated user.

The frontend filters tasks according to the currently selected project.

## Get Task

```text
GET /tasks/{task_id}
```

## Update Task

```text
PUT /tasks/{task_id}
```

Supports updating:

* Title
* Description
* Priority
* Due date
* Status
* Project

## Delete Task

```text
DELETE /tasks/{task_id}
```

## Complete Task

The frontend provides a **Complete** action that updates the task status to:

```text
Completed
```

---

# Task Priority

TaskFlow supports three priority levels:

```text
low
medium
high
```

Priority ranking used by the custom sorting algorithm:

```text
low = 1
medium = 2
high = 3
```

The backend validates the allowed priority values.

---

# Task Status

Tasks support status management.

The dashboard currently uses:

```text
Pending
Completed
```

Users can mark a pending task as completed directly from the dashboard.

---

# Task Due Dates

Tasks support optional due dates.

The frontend allows users to provide a due date while creating or editing a task.

The dashboard displays dates in a user-friendly format.

The Quick Add parser can also recognize natural-language date hints such as:

```text
today
tomorrow
next week
monday
tuesday
wednesday
thursday
friday
saturday
sunday
```

---

# Task Search

TaskFlow supports custom search algorithms.

## Binary Search

Example:

```text
GET /tasks/search/?title=game&algo=binary
```

Binary search operates on sorted data prepared using the custom insertion-sort implementation.

Complexity:

```text
O(log n)
```

## Linear Search

Example:

```text
GET /tasks/search/?title=game&algo=linear
```

Linear search checks records sequentially.

Worst-case complexity:

```text
O(n)
```

The frontend provides task search and displays results belonging to the currently selected project.

---

# Task Statistics

TaskFlow provides project-wise task statistics.

Endpoint:

```text
GET /projects/stats/summary
```

Statistics include:

* Total tasks
* Completed tasks
* Pending tasks
* Project progress percentage

The frontend displays the statistics for the currently selected project.

The backend calculates the statistics using SQL aggregate operations.

---

# Algorithms Engine

TaskFlow implements custom sorting and searching algorithms instead of relying entirely on Python's built-in sorting and searching functions.

The implementations are located in:

```text
backend/algorithms/
```

---

## Insertion Sort

Insertion sort is used for:

* Sorting task data
* Preparing data for binary search

Complexity:

```text
Best Case:    O(n)
Average Case: O(n²)
Worst Case:   O(n²)
Space:        O(1)
```

---

## Binary Search

Binary search operates on sorted data.

Complexity:

```text
Best Case:    O(1)
Average Case: O(log n)
Worst Case:   O(log n)
Space:        O(1)
```

---

## Linear Search

Linear search checks records sequentially.

Complexity:

```text
Best Case:    O(1)
Average Case: O(n)
Worst Case:   O(n)
Space:        O(1)
```

---

# Algorithm Testing

Algorithm validation is implemented in:

```text
backend/algorithms/check_algorithms.py
```

Run:

```powershell
python algorithms\check_algorithms.py
```

The checks cover:

* Insertion sort
* Binary search
* Linear search
* Comparison counting
* Empty-list handling
* Single-element handling
* First, middle and last search positions
* Not-found conditions

Example:

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

Example observed comparison counts:

| Data Size | Insertion Sort | Binary Search | Linear Search |
| --------: | -------------: | ------------: | ------------: |
|        10 |             45 |             1 |             6 |
|       500 |        124,750 |             1 |           251 |
|     3,000 |      4,498,500 |             1 |         1,501 |

These results demonstrate the expected growth patterns of the implemented algorithms.

Insertion sort requires significantly more comparisons as the dataset grows, while binary search remains efficient when operating on sorted data.

---

# AI-Assisted Quick Add

TaskFlow provides an **AI-assisted Quick Add** feature that converts natural-language task descriptions into structured task information.

The current implementation uses a **deterministic rule-based parser** and does not require an external AI API key or external AI service.

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

The parser can generate:

* Title
* Description
* Priority
* Due-date hint
* Status
* Project ID

Example:

```json
{
  "title": "Complete project with",
  "description": "Complete project tomorrow with high priority",
  "priority": "high",
  "due_date": "tomorrow",
  "status": "Pending",
  "project_id": 4
}
```

---

# AI Parser Logic

The parser recognizes priority-related phrases such as:

```text
urgent
asap
high priority
low priority
```

It also recognizes date-related phrases such as:

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

Recognized priority and date phrases are converted into structured fields.

The parser also removes recognized keywords from the task title where applicable.

---

# AI Quick Add Examples

### Example 1

Input:

```text
Finish report today
```

Result:

```json
{
  "title": "Finish report",
  "priority": "medium",
  "due_date": "today"
}
```

### Example 2

Input:

```text
Read Python documentation next week
```

Result:

```json
{
  "title": "Read Python documentation",
  "priority": "medium",
  "due_date": "next week"
}
```

### Example 3

Input:

```text
Submit assignment with low priority
```

Result:

```json
{
  "title": "Submit assignment",
  "priority": "low",
  "due_date": null
}
```

### Example 4

Input:

```text
Finish backend task urgently
```

Result:

```json
{
  "title": "Finish backend task",
  "priority": "high",
  "due_date": null
}
```

---

# LocalStorage

The frontend uses browser LocalStorage for authentication state.

After successful login:

```text
Login
  ↓
JWT Token
  ↓
LocalStorage
  ↓
Authorization Header
```

Authenticated requests use:

```text
Authorization: Bearer <token>
```

During logout, the token is removed.

If the backend returns HTTP `401 Unauthorized`, the frontend clears the token and redirects the user to the login page.

---

# Request Timing Middleware

FastAPI middleware measures the processing time of incoming HTTP requests.

The middleware logs:

* HTTP method
* Request path
* Processing time in milliseconds

Example:

```text
GET /tasks/ 3.42 ms
POST /projects/ 8.15 ms
PUT /tasks/2 5.27 ms
```

This provides basic backend performance monitoring during development and deployment.

---

# CORS Configuration

The backend is configured to allow communication from local and deployed frontend environments.

Configured local origins include:

```text
http://localhost:3000
http://127.0.0.1:3000
http://localhost:5500
http://127.0.0.1:5500
```

The deployed Netlify frontend is also allowed:

```text
https://wonderful-licorice-7b4921.netlify.app
```

This allows TaskFlow to operate in both local and live environments.

---

# Local Architecture

```text
                 Browser
                    │
                    ▼
          Local Frontend Server
          127.0.0.1:3000
                    │
                    ▼
             FastAPI Backend
             127.0.0.1:8000
                    │
                    ▼
              SQLite Database
             taskflow.db
```

---

# Live Architecture

```text
                 Browser
                    │
                    ▼
            Netlify Frontend
                    │
                    ▼
             Render Backend
                    │
                    ▼
          Production Database
```

Live frontend:

```text
https://wonderful-licorice-7b4921.netlify.app
```

Live backend:

```text
https://taskflow-api-ax00.onrender.com
```

---

# Deployment

## Backend

The FastAPI backend is deployed using Render.

Live API:

```text
https://taskflow-api-ax00.onrender.com
```

Swagger documentation:

```text
https://taskflow-api-ax00.onrender.com/docs
```

Health check:

```text
https://taskflow-api-ax00.onrender.com/health
```

## Frontend

The frontend is deployed using Netlify.

Live application:

```text
https://wonderful-licorice-7b4921.netlify.app
```

The deployed frontend communicates with the deployed Render backend.

---

# Local and Live Testing

TaskFlow can be tested independently in both environments.

## Local

```text
Frontend:
http://127.0.0.1:3000

Backend:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs
```

## Live

```text
Frontend:
https://wonderful-licorice-7b4921.netlify.app

Backend:
https://taskflow-api-ax00.onrender.com

Swagger:
https://taskflow-api-ax00.onrender.com/docs
```

The same application architecture works in both environments.

---

# API Documentation

FastAPI automatically provides Swagger/OpenAPI documentation.

Local:

```text
http://127.0.0.1:8000/docs
```

Live:

```text
https://taskflow-api-ax00.onrender.com/docs
```

Swagger can be used to inspect and manually test the available API endpoints.

---

# Database

TaskFlow uses SQLAlchemy as its ORM.

## Local Database

Local development uses SQLite:

```text
backend/taskflow.db
```

Database tables include:

* Users
* Projects
* Tasks

Tables are initialized using:

```python
Base.metadata.create_all(bind=engine)
```

## Production Database

The backend is designed to support PostgreSQL for production environments.

---

# Security

TaskFlow implements JWT-based authentication and protected API access.

Security-related functionality includes:

* Password hashing
* JWT authentication
* Authorization headers
* Protected endpoints
* User-specific project access
* User-specific task access
* Automatic logout when authentication becomes invalid

Passwords are hashed before being stored in the database.

---

# Error Handling

The frontend handles common API errors including:

* HTTP 401 Unauthorized
* HTTP 404 Not Found
* HTTP 4xx validation errors
* Network connection failures
* Project operation failures
* Task operation failures
* Search failures
* Statistics failures
* Quick Add failures

Authentication failures automatically redirect the user to the login page.

---

# Frontend Functionality

The dashboard provides:

* Login
* Registration
* Project selection
* Project creation
* Project editing
* Project deletion
* Project progress
* Task creation
* Task listing
* Task editing
* Task completion
* Task deletion
* Task search
* Task statistics
* AI Quick Add
* Logout
* Hero slider

The frontend communicates with the FastAPI backend using the JavaScript Fetch API.

Tasks displayed on the dashboard are associated with the currently selected project.

---

# Git Workflow

TaskFlow is maintained using Git and GitHub for version control.

The repository contains:

* Backend
* Frontend
* Algorithms
* Tests
* AI parser
* Database configuration
* Documentation

The final production code is maintained on the `main` branch.

---

# Repository

GitHub:

```text
https://github.com/gv063843-cell/TaskFlow
```

---

# Final Project Status

TaskFlow is a full-stack application combining:

```text
Frontend
HTML + CSS + JavaScript
        │
        ▼
Backend
FastAPI + SQLAlchemy
        │
        ▼
Database
SQLite / PostgreSQL
```

The project includes authentication, project management, task management, custom algorithms, search, statistics, AI-assisted Quick Add, responsive frontend functionality, API documentation and deployment configuration.

The application has been tested in the local environment and is deployed for live usage.

TaskFlow supports both **local development/testing** and **live production usage**.
