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
- SQLite database using SQLAlchemy ORM

---

# Technology Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
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