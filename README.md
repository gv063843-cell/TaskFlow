# TaskFlow — Full-Stack AI-Assisted Task Management Platform

TaskFlow is a full-stack task and project management application built with **FastAPI, SQLAlchemy, SQLite, HTML, CSS and JavaScript**.

The application allows users to register and log in, create projects and tasks, manage tasks through CRUD operations, search and sort tasks using custom algorithms, view project statistics, and create structured tasks from natural-language descriptions using an AI-assisted rule-based Quick Add parser.

The application supports both **local development and live deployment**.

---

# Features

* User registration and login
* JWT-based authentication
* Secure password handling
* Project creation and listing
* Project-wise task management
* Task creation, listing, updating and deletion
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
* Deterministic mock AI parser
* LocalStorage support
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
│   ├── app/
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
│   ├── tests/
│   │
│   ├── utils/
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
├── venv/
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

## Live Environment

Frontend:

```text
https://wonderful-licorice-7b4921.netlify.app
```

Backend:

```text
https://taskflow-api-ax00.onrender.com
```

The frontend API configuration is connected to the deployed backend, while the backend CORS configuration allows both local and deployed frontend origins.

---

# Authentication

TaskFlow uses JWT-based authentication.

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

## Login

```text
POST /auth/login
```

Authenticates a registered user and returns a JWT access token.

The frontend sends login credentials using form URL encoding.

The returned token is stored in browser LocalStorage.

Authenticated API requests use:

```text
Authorization: Bearer <token>
```

If the token expires or becomes invalid, the frontend clears the stored token and redirects the user to the login page.

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

The frontend displays projects inside a project-selection dropdown.

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

Example response:

```json
{
  "title": "Complete project",
  "description": "Complete TaskFlow project",
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

The frontend filters the returned tasks according to the currently selected project.

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

The endpoint supports updating:

* Title
* Description
* Priority
* Due date
* Status
* Project

Example request:

```json
{
  "title": "Updated task",
  "description": "Updated description",
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

# Task Priority

TaskFlow supports three task priority levels:

```text
low
medium
high
```

The frontend allows the user to select the priority while creating or editing a task.

The backend validates the allowed priority values.

Priority ranking used by the sorting algorithm:

```text
low = 1
medium = 2
high = 3
```

---

# Task Status

Tasks support status management.

Typical statuses include:

```text
Pending
Completed
```

The dashboard provides a Complete action that updates the selected task status to:

```text
Completed
```

---

# Task Due Dates

Tasks support optional due dates.

The frontend allows users to provide a due date when creating or editing a task.

Dates are displayed in a user-friendly format in the dashboard.

The AI Quick Add parser can also detect natural-language date hints such as:

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

TaskFlow supports custom task-search algorithms.

## Binary Search

```text
GET /tasks/search?title=game&algo=binary
```

Before binary search, task data is prepared using the custom insertion-sort implementation.

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

The frontend allows users to search tasks and displays the matching tasks for the selected project.

---

# Task Statistics

TaskFlow provides project-wise task statistics.

Endpoint:

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

Statistics include:

* Total tasks
* Completed tasks
* Pending tasks

The statistics are calculated using SQL aggregate operations.

The frontend displays statistics for the currently selected project.

---

# Algorithms Engine

TaskFlow implements custom algorithms manually instead of relying entirely on Python's built-in sorting and searching functions.

The algorithm implementations are located in:

```text
backend/algorithms/
```

---

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

Algorithm checks are implemented in:

```text
backend/algorithms/check_algorithms.py
```

Run the checks from the backend directory:

```powershell
python algorithms\check_algorithms.py
```

The test suite verifies:

* Insertion sort
* Binary search
* Linear search
* Comparison-count behaviour
* Empty-list handling
* Single-element handling
* First, middle and last search positions
* Not-found conditions

Example successful output:

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

Insertion sort requires significantly more comparisons as the dataset grows, while binary search remains efficient on sorted data.

---

# AI Quick Add

TaskFlow provides an AI-assisted Quick Add feature.

The feature accepts a natural-language task description and converts it into structured task information.

The generated task can contain:

* Title
* Priority
* Due-date hint
* Description
* Status
* Project

The implementation uses a deterministic mock AI parser and does not require an external AI API key or external network request.

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

The parser recognizes priority-related keywords and phrases such as:

```text
urgent
asap
high priority
low priority
```

It also recognizes due-date phrases such as:

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

Recognized priority and date phrases are extracted from the natural-language input and converted into structured task fields.

The parser also removes recognized priority and date phrases when generating the task title.

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

---

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

---

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

---

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

---

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

The frontend uses browser LocalStorage for client-side state and authentication handling.

The JWT token is stored after successful login.

Example:

```text
localStorage
    ↓
token
    ↓
Authorization: Bearer <token>
```

The frontend uses the stored token when making authenticated API requests.

When a user logs out, the token is removed from LocalStorage.

If the backend returns an HTTP 401 response, the frontend clears the token and redirects the user to the login page.

---

# Request Timing Middleware

FastAPI middleware measures the processing time of incoming requests.

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

This helps monitor backend request performance during development and deployment.

---

# CORS Configuration

The FastAPI application includes CORS configuration to allow the frontend to communicate with the backend.

Configured local frontend origins include:

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

This allows TaskFlow to work in both local and live environments.

---

# Local Architecture

When testing locally, the application works as follows:

```text
                Browser
                   │
                   ▼
        Local Frontend Server
        http://127.0.0.1:3000
                   │
                   ▼
          FastAPI Backend
        http://127.0.0.1:8000
                   │
                   ▼
             SQLite DB
```

The local database is:

```text
backend/taskflow.db
```

---

# Live Architecture

The deployed application works as follows:

```text
                 Browser
                    │
                    ▼
             Netlify Frontend
                    │
                    ▼
             Render FastAPI
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

## Backend Deployment

The TaskFlow backend is deployed using Render.

Live API:

```text
https://taskflow-api-ax00.onrender.com
```

Swagger documentation:

```text
https://taskflow-api-ax00.onrender.com/docs
```

Health endpoint:

```text
https://taskflow-api-ax00.onrender.com/health
```

---

## Frontend Deployment

The frontend is deployed using Netlify.

Live application:

```text
https://wonderful-licorice-7b4921.netlify.app
```

The live frontend communicates with the deployed Render API.

---

# Local and Live Testing

TaskFlow can be tested locally without replacing or disabling the live deployment.

## Local Testing

```text
Frontend:
http://127.0.0.1:3000

Backend:
http://127.0.0.1:8000
```

## Live Testing

```text
Frontend:
https://wonderful-licorice-7b4921.netlify.app

Backend:
https://taskflow-api-ax00.onrender.com
```

The CORS configuration supports both environments.

---

# API Documentation

FastAPI automatically provides Swagger/OpenAPI documentation.

## Local Swagger

```text
http://127.0.0.1:8000/docs
```

## Live Swagger

```text
https://taskflow-api-ax00.onrender.com/docs
```

The Swagger interface can be used to inspect and test available API endpoints.

---

# Database

TaskFlow uses SQLAlchemy for database interaction.

## Local Database

Local development uses SQLite:

```text
backend/taskflow.db
```

Database tables are created using:

```python
Base.metadata.create_all(bind=engine)
```

The project contains models for:

* Users
* Projects
* Tasks

## Production Database

The application also supports PostgreSQL for production deployment.

---

# Security

TaskFlow implements authentication using JWT tokens.

Security-related functionality includes:

* Password authentication
* JWT access tokens
* Authorization headers
* Protected API endpoints
* User-specific project access
* User-specific task access
* Automatic logout when authentication expires

The frontend does not send the password with every API request. After authentication, the JWT token is used for protected requests.

---

# Error Handling

The frontend handles common API errors including:

* HTTP 401 Unauthorized
* HTTP 404 Not Found
* HTTP 4xx validation errors
* Network connection failures

When authentication fails, the user is redirected to the login page.

The frontend also displays user-friendly messages for failed project, task, search, statistics and AI Quick Add operations.

---

# Frontend Functionality

The dashboard provides:

* User authentication
* Project selection
* Project creation
* Task creation
* Task listing
* Task editing
* Task completion
* Task deletion
* Task search
* Statistics
* AI Quick Add
* Logout

Tasks are displayed according to the currently selected project.

The frontend communicates with the FastAPI backend using the JavaScript Fetch API.

---

# Git Workflow

TaskFlow is maintained using Git and GitHub for version control.

The repository contains the final application source code including:

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

GitHub repository:

```text
https://github.com/gv063843-cell/TaskFlow
```

---

# Submission

TaskFlow is maintained as a single GitHub repository containing:

* `backend/` — FastAPI backend, SQLAlchemy models, routers, schemas, authentication, algorithms, tests and AI Quick Add parser
* `frontend/` — HTML, CSS and JavaScript dashboard
* `requirements.txt` — Python dependencies
* `README.md` — complete project documentation, API information, algorithms, benchmarks, setup instructions and deployment information

The application has been tested locally and is also deployed online.

The final system supports both local development and live usage.
