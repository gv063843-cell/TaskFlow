// =========================================================
// TASKFLOW — MAIN JAVASCRIPT
// FINAL CLEAN VERSION
// =========================================================

// =========================================================
// API CONFIG
// =========================================================

const API =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://taskflow-api-ax00.onrender.com";


// =========================================================
// CURRENT SELECTED PROJECT
// =========================================================

let currentProjectId = null;


// =========================================================
// GET LOGIN TOKEN
// =========================================================

function getToken() {
    return localStorage.getItem("token");
}


// =========================================================
// AUTHORIZATION HEADERS
// =========================================================

function getAuthHeaders() {
    const token = getToken();

    return {
        Authorization: `Bearer ${token}`
    };
}


function getJsonHeaders() {
    const token = getToken();

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}


// =========================================================
// CHECK LOGIN
// =========================================================

function checkLogin() {
    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}


// =========================================================
// HANDLE API RESPONSE
// =========================================================

async function handleResponse(response) {

    if (response.status === 401) {

        alert("Session expired. Please login again.");

        localStorage.removeItem("token");

        window.location.href = "login.html";

        return null;
    }

    if (!response.ok) {

        const errorText = await response.text();

        console.error("API Error:", errorText);

        alert("API Error: " + response.status);

        return null;
    }

    return await response.json();
}


// =========================================================
// ELEMENTS
// =========================================================

const taskList =
    document.getElementById("taskList");

const projectSelect =
    document.getElementById("projectSelect");

const projectInfo =
    document.getElementById("projectInfo");


// =========================================================
// PROJECT PROGRESS
// =========================================================

function getProjectProgress(projectId, stats) {

    const projectStats = stats.find(
        project =>
            Number(project.project_id) === Number(projectId)
    );

    if (!projectStats) {

        return {
            total: 0,
            completed: 0,
            pending: 0,
            progress: 0
        };
    }

    return {
        total: Number(projectStats.total_tasks || 0),
        completed: Number(projectStats.completed_tasks || 0),
        pending: Number(projectStats.pending_tasks || 0),
        progress: Number(projectStats.progress || 0)
    };
}


// =========================================================
// LOAD PROJECT PROGRESS
// =========================================================

async function loadProjectProgress() {

    if (!currentProjectId) {
        return;
    }

    try {

        const response = await fetch(
            `${API}/projects/stats/summary`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const data =
            await handleResponse(response);

        if (!data) {
            return;
        }

        const progress =
            getProjectProgress(
                currentProjectId,
                data
            );

        const progressBox =
            document.getElementById(
                "projectProgress"
            );

        if (!progressBox) {
            return;
        }

        progressBox.innerHTML = `
            <div class="project-progress-header">

                <span>Project Progress</span>

                <strong>
                    ${progress.progress}%
                </strong>

            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${progress.progress}%"
                ></div>

            </div>

            <div class="project-progress-info">

                ${progress.completed} completed
                ·
                ${progress.pending} pending
                ·
                ${progress.total} total

            </div>
        `;

    } catch (error) {

        console.error(
            "Project Progress Error:",
            error
        );
    }
}


// =========================================================
// EDIT PROJECT
// =========================================================

async function editProject() {

    if (!checkLogin()) {
        return;
    }

    if (!currentProjectId) {

        alert(
            "Please select a project first."
        );

        return;
    }

    try {

        const response = await fetch(
            `${API}/projects/${currentProjectId}`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const project =
            await handleResponse(response);

        if (!project) {
            return;
        }

        const newName = prompt(
            "Edit Project Name:",
            project.name || ""
        );

        if (newName === null) {
            return;
        }

        if (newName.trim() === "") {

            alert(
                "Project name cannot be empty."
            );

            return;
        }

        const newDescription = prompt(
            "Edit Project Description:",
            project.description || ""
        );

        if (newDescription === null) {
            return;
        }

        const updateResponse =
            await fetch(
                `${API}/projects/${currentProjectId}`,
                {
                    method: "PUT",
                    headers: getJsonHeaders(),

                    body: JSON.stringify({
                        name: newName.trim(),
                        description:
                            newDescription.trim()
                    })
                }
            );

        const updatedProject =
            await handleResponse(
                updateResponse
            );

        if (!updatedProject) {
            return;
        }

        alert(
            "✏️ Project Updated Successfully"
        );

        await loadProjects();

        currentProjectId =
            Number(updatedProject.id);

        if (projectSelect) {

            projectSelect.value =
                String(updatedProject.id);
        }

        if (projectInfo) {

            projectInfo.innerText =
                `Current Project: ${updatedProject.name}`;
        }

        await loadTasks();

        await loadProjectProgress();

    } catch (error) {

        console.error(
            "Edit Project Error:",
            error
        );

        alert(
            "Project edit nahi ho paya."
        );
    }
}


// =========================================================
// DELETE PROJECT
// =========================================================

async function deleteProject() {

    if (!checkLogin()) {
        return;
    }

    if (!currentProjectId) {

        alert(
            "Please select a project first."
        );

        return;
    }

    const selectedProjectName =
        projectSelect.options[
            projectSelect.selectedIndex
        ]?.text || "this project";

    const confirmed = confirm(
        `Delete "${selectedProjectName}"?\n\n` +
        "This will also delete all tasks inside this project."
    );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/projects/${currentProjectId}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders()
                }
            );

        const result =
            await handleResponse(response);

        if (!result) {
            return;
        }

        alert(
            "🗑️ Project Deleted Successfully"
        );

        currentProjectId = null;

        await loadProjects();

    } catch (error) {

        console.error(
            "Delete Project Error:",
            error
        );

        alert(
            "Project delete nahi ho paya."
        );
    }
}


// =========================================================
// LOAD PROJECTS
// =========================================================

async function loadProjects() {

    if (!checkLogin()) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/projects/`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

        const projects =
            await handleResponse(response);

        if (!projects) {
            return;
        }

        if (!projectSelect) {
            return;
        }

        projectSelect.innerHTML = "";

        if (projects.length === 0) {

            projectSelect.innerHTML = `
                <option value="">
                    No Projects Found
                </option>
            `;

            if (projectInfo) {

                projectInfo.innerText =
                    "Please create a project first.";
            }

            currentProjectId = null;

            if (taskList) {

                taskList.innerHTML = `
                    <li>
                        No Project Selected
                    </li>
                `;
            }

            return;
        }

        projects.forEach(project => {

            const option =
                document.createElement("option");

            option.value = project.id;

            option.textContent =
                project.name;

            projectSelect.appendChild(option);
        });

        currentProjectId =
            Number(projects[0].id);

        projectSelect.value =
            String(currentProjectId);

        if (projectInfo) {

            projectInfo.innerText =
                `Current Project: ${projects[0].name}`;
        }

        await loadTasks();

        await loadProjectProgress();

    } catch (error) {

        console.error(
            "Load Projects Error:",
            error
        );

        alert(
            "Projects load nahi ho paaye."
        );
    }
}


// =========================================================
// CREATE PROJECT
// =========================================================

const createProjectBtn =
    document.getElementById(
        "createProjectBtn"
    );

if (createProjectBtn) {

    createProjectBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) {
                return;
            }

            const projectNameElement =
                document.getElementById(
                    "projectName"
                );

            const projectDescriptionElement =
                document.getElementById(
                    "projectDescription"
                );

            const name =
                projectNameElement
                    ? projectNameElement.value.trim()
                    : "";

            const description =
                projectDescriptionElement
                    ? projectDescriptionElement.value.trim()
                    : "";

            if (name === "") {

                alert(
                    "Enter Project Name"
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/projects/`,
                        {
                            method: "POST",

                            headers:
                                getJsonHeaders(),

                            body:
                                JSON.stringify({
                                    name: name,
                                    description:
                                        description
                                })
                        }
                    );

                const project =
                    await handleResponse(
                        response
                    );

                if (!project) {
                    return;
                }

                alert(
                    "Project Created Successfully"
                );

                if (projectNameElement) {
                    projectNameElement.value = "";
                }

                if (projectDescriptionElement) {
                    projectDescriptionElement.value = "";
                }

                await loadProjects();

                if (project.id) {

                    currentProjectId =
                        Number(project.id);

                    projectSelect.value =
                        String(project.id);

                    if (projectInfo) {

                        projectInfo.innerText =
                            `Current Project: ${project.name}`;
                    }

                    await loadTasks();

                    await loadProjectProgress();
                }

            } catch (error) {

                console.error(
                    "Create Project Error:",
                    error
                );

                alert(
                    "Project create nahi ho paya."
                );
            }
        }
    );
}


// =========================================================
// PROJECT CHANGE
// =========================================================

if (projectSelect) {

    projectSelect.addEventListener(
        "change",
        async function () {

            currentProjectId =
                Number(this.value);

            const selectedOption =
                this.options[
                    this.selectedIndex
                ];

            const selectedText =
                selectedOption
                    ? selectedOption.text
                    : "No Project";

            if (projectInfo) {

                projectInfo.innerText =
                    `Current Project: ${selectedText}`;
            }

            await loadTasks();

            await loadProjectProgress();

        }
    );
}


// =========================================================
// FORMAT DUE DATE
// =========================================================

function formatDueDate(date) {

    if (!date) {
        return "No due date";
    }

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {

        const parts =
            date.split("-");

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return date;
}


// =========================================================
// RENDER TASKS
// =========================================================

function renderTasks(tasks) {

    if (!taskList) {
        return;
    }

    taskList.innerHTML = "";

    if (!tasks || tasks.length === 0) {

        taskList.innerHTML = `
            <li>
                No Tasks Found in this Project
            </li>
        `;

        return;
    }

    tasks.forEach(task => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            <b>
                ${task.title || "No Title"}
            </b>

            <span class="task-priority">
                🎯 Priority :
                <strong>
                    ${task.priority || "medium"}
                </strong>
            </span>

            <span class="task-due-date">
                📅 Due Date :
                <strong>
                    ${formatDueDate(task.due_date)}
                </strong>
            </span>

            <span class="task-status">
                📌 Status :
                <strong>
                    ${task.status || "Pending"}
                </strong>
            </span>

            <button
                class="edit-btn"
                onclick="editTask(${task.id})"
            >
                ✏️ Edit
            </button>

            <button
                class="complete-btn"
                onclick="completeTask(${task.id})"
            >
                ✅ Complete
            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                🗑 Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}


// =========================================================
// LOAD TASKS
// =========================================================

async function loadTasks() {

    if (!checkLogin()) {
        return;
    }

    if (!currentProjectId) {

        if (taskList) {

            taskList.innerHTML = `
                <li>
                    Please select a project.
                </li>
            `;
        }

        return;
    }

    try {

        const response =
            await fetch(
                `${API}/tasks/`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

        const allTasks =
            await handleResponse(response);

        if (!allTasks) {
            return;
        }

        const tasks =
            Array.isArray(allTasks)
                ? allTasks.filter(
                    task =>
                        Number(task.project_id) ===
                        Number(currentProjectId)
                )
                : [];

        renderTasks(tasks);

    } catch (error) {

        console.error(
            "Load Tasks Error:",
            error
        );

        alert(
            "Server se connection nahi ho raha."
        );
    }
}


// =========================================================
// ADD NEW TASK
// =========================================================

const addTaskBtn =
    document.getElementById(
        "addTaskBtn"
    );

if (addTaskBtn) {

    addTaskBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) {
                return;
            }

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            const taskTitleElement =
                document.getElementById(
                    "taskTitle"
                );

            const taskPriorityElement =
                document.getElementById(
                    "taskPriority"
                );

            const dueDateElement =
                document.getElementById(
                    "taskDueDate"
                );

            const title =
                taskTitleElement
                    ? taskTitleElement.value.trim()
                    : "";

            const priority =
                taskPriorityElement
                    ? taskPriorityElement.value
                    : "medium";

            const dueDate =
                dueDateElement
                    ? dueDateElement.value || null
                    : null;

            if (title === "") {

                alert(
                    "Enter Task Title"
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/tasks/`,
                        {
                            method: "POST",

                            headers:
                                getJsonHeaders(),

                            body:
                                JSON.stringify({
                                    title: title,

                                    description: "",

                                    priority: priority,

                                    due_date: dueDate,

                                    status: "Pending",

                                    project_id:
                                        currentProjectId
                                })
                        }
                    );

                const task =
                    await handleResponse(
                        response
                    );

                if (!task) {
                    return;
                }

                if (taskTitleElement) {
                    taskTitleElement.value = "";
                }

                if (dueDateElement) {
                    dueDateElement.value = "";
                }

                alert(
                    "✅ Task Added Successfully"
                );

                await loadTasks();

                await loadProjectProgress();

            } catch (error) {

                console.error(
                    "Add Task Error:",
                    error
                );

                alert(
                    "Task add nahi ho paya."
                );
            }
        }
    );
}


// =========================================================
// EDIT TASK
// =========================================================

async function editTask(taskId) {

    if (!checkLogin()) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

        const task =
            await handleResponse(
                response
            );

        if (!task) {
            return;
        }

        const newTitle =
            prompt(
                "Edit Task Title:",
                task.title || ""
            );

        if (newTitle === null) {
            return;
        }

        if (newTitle.trim() === "") {

            alert(
                "Task title cannot be empty."
            );

            return;
        }

        const newPriority =
            prompt(
                "Edit Priority (low / medium / high):",
                task.priority || "medium"
            );

        if (newPriority === null) {
            return;
        }

        const priority =
            newPriority.trim().toLowerCase();

        if (
            priority !== "low" &&
            priority !== "medium" &&
            priority !== "high"
        ) {

            alert(
                "Priority must be low, medium or high."
            );

            return;
        }

        const newDueDate =
            prompt(
                "Edit Due Date (YYYY-MM-DD):",
                task.due_date || ""
            );

        if (newDueDate === null) {
            return;
        }

        const updateResponse =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers:
                        getJsonHeaders(),

                    body:
                        JSON.stringify({

                            title:
                                newTitle.trim(),

                            description:
                                task.description || "",

                            priority:
                                priority,

                            due_date:
                                newDueDate.trim() || null,

                            status:
                                task.status || "Pending",

                            project_id:
                                task.project_id
                        })
                }
            );

        const updatedTask =
            await handleResponse(
                updateResponse
            );

        if (!updatedTask) {
            return;
        }

        alert(
            "✏️ Task Updated Successfully"
        );

        await loadTasks();

        await loadProjectProgress();

    } catch (error) {

        console.error(
            "Edit Task Error:",
            error
        );

        alert(
            "Task modify nahi ho paya."
        );
    }
}


// =========================================================
// COMPLETE TASK
// =========================================================

async function completeTask(taskId) {

    if (!checkLogin()) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

        const task =
            await handleResponse(
                response
            );

        if (!task) {
            return;
        }

        const updateResponse =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers:
                        getJsonHeaders(),

                    body:
                        JSON.stringify({

                            title:
                                task.title,

                            description:
                                task.description || "",

                            priority:
                                task.priority || "medium",

                            due_date:
                                task.due_date || null,

                            status:
                                "Completed",

                            project_id:
                                task.project_id
                        })
                }
            );

        const updatedTask =
            await handleResponse(
                updateResponse
            );

        if (!updatedTask) {
            return;
        }

        await loadTasks();

        await loadProjectProgress();

    } catch (error) {

        console.error(
            "Complete Task Error:",
            error
        );

        alert(
            "Task update nahi ho paya."
        );
    }
}


// =========================================================
// DELETE TASK
// =========================================================

async function deleteTask(taskId) {

    if (!checkLogin()) {
        return;
    }

    if (!confirm("Delete this task?")) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders()
                }
            );

        const result =
            await handleResponse(
                response
            );

        if (!result) {
            return;
        }

        alert(
            "🗑 Task Deleted Successfully"
        );

        await loadTasks();

        await loadProjectProgress();

    } catch (error) {

        console.error(
            "Delete Task Error:",
            error
        );

        alert(
            "Task delete nahi ho paya."
        );
    }
}


// =========================================================
// STATISTICS — PREMIUM VERSION
// =========================================================

const statsBtn =
    document.getElementById(
        "statsBtn"
    );

if (statsBtn) {

    statsBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) {
                return;
            }

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/projects/stats/summary`,
                        {
                            method: "GET",
                            headers:
                                getAuthHeaders()
                        }
                    );

                const data =
                    await handleResponse(
                        response
                    );

                if (!data) {
                    return;
                }

                const projectStats =
                    data.find(
                        project =>
                            Number(
                                project.project_id
                            ) ===
                            Number(
                                currentProjectId
                            )
                    );

                const statsElement =
                    document.getElementById(
                        "stats"
                    );

                if (!statsElement) {
                    return;
                }

                // No statistics
                if (!projectStats) {

                    statsElement.innerHTML = `
                        <div class="stat-box stat-total">
                            <span>Total Tasks</span>
                            <strong>0</strong>
                        </div>

                        <div class="stat-box stat-completed">
                            <span>Completed</span>
                            <strong>0</strong>
                        </div>

                        <div class="stat-box stat-pending">
                            <span>Pending</span>
                            <strong>0</strong>
                        </div>
                    `;

                    return;
                }

                const total =
                    Number(
                        projectStats.total_tasks || 0
                    );

                const completed =
                    Number(
                        projectStats.completed_tasks || 0
                    );

                const pending =
                    Number(
                        projectStats.pending_tasks || 0
                    );

                statsElement.innerHTML = `
                    <div class="stat-box stat-total">
                        <span>Total Tasks</span>

                        <strong>
                            ${total}
                        </strong>
                    </div>

                    <div class="stat-box stat-completed">
                        <span>Completed</span>

                        <strong>
                            ${completed}
                        </strong>
                    </div>

                    <div class="stat-box stat-pending">
                        <span>Pending</span>

                        <strong>
                            ${pending}
                        </strong>
                    </div>
                `;

            } catch (error) {

                console.error(
                    "Statistics Error:",
                    error
                );

                alert(
                    "Statistics load nahi ho payi."
                );
            }
        }
    );
}


// =========================================================
// AI QUICK ADD
// =========================================================

const aiBtn =
    document.getElementById(
        "aiBtn"
    );

if (aiBtn) {

    aiBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) {
                return;
            }

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            const aiInput =
                document.getElementById(
                    "aiText"
                );

            if (!aiInput) {
                return;
            }

            const text =
                aiInput.value.trim();

            if (text === "") {

                alert(
                    "Describe your task"
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/tasks/quick-add`,
                        {
                            method: "POST",

                            headers:
                                getJsonHeaders(),

                            body:
                                JSON.stringify({
                                    description:
                                        text,

                                    project_id:
                                        currentProjectId
                                })
                        }
                    );

                const data =
                    await handleResponse(
                        response
                    );

                if (!data) {
                    return;
                }

                alert(
                    "🤖 AI Task Created: " +
                    data.title
                );

                aiInput.value = "";

                await loadTasks();

                await loadProjectProgress();

            } catch (error) {

                console.error(
                    "AI Quick Add Error:",
                    error
                );

                alert(
                    "AI Quick Add failed."
                );
            }
        }
    );
}


// =========================================================
// SEARCH TASK
// =========================================================

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) {
                return;
            }

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            const searchInput =
                document.getElementById(
                    "searchText"
                );

            if (!searchInput) {
                return;
            }

            const text =
                searchInput.value.trim();

            if (text === "") {

                await loadTasks();

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/tasks/search/?title=${encodeURIComponent(text)}`,
                        {
                            method: "GET",
                            headers:
                                getAuthHeaders()
                        }
                    );

                if (response.status === 404) {

                    taskList.innerHTML = `
                        <li>
                            No Task Found
                        </li>
                    `;

                    return;
                }

                const result =
                    await handleResponse(
                        response
                    );

                if (!result) {
                    return;
                }

                const allTasks =
                    Array.isArray(result)
                        ? result
                        : [result];

                const tasks =
                    allTasks.filter(
                        task =>
                            Number(
                                task.project_id
                            ) ===
                            Number(
                                currentProjectId
                            )
                    );

                if (tasks.length === 0) {

                    taskList.innerHTML = `
                        <li>
                            No Task Found
                        </li>
                    `;

                    return;
                }

                renderTasks(tasks);

            } catch (error) {

                console.error(
                    "Search Error:",
                    error
                );

                alert(
                    "Search failed."
                );
            }
        }
    );
}


// =========================================================
// SHOW ALL BUTTON
// =========================================================

const showAllBtn =
    document.getElementById(
        "showAllBtn"
    );

if (showAllBtn) {

    showAllBtn.addEventListener(
        "click",
        async () => {

            const searchInput =
                document.getElementById(
                    "searchText"
                );

            if (searchInput) {
                searchInput.value = "";
            }

            await loadTasks();
        }
    );
}


// =========================================================
// LOGOUT
// =========================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";
        }
    );
}


// =========================================================
// INITIAL LOAD
// =========================================================

window.addEventListener(
    "load",
    async () => {

        if (!checkLogin()) {
            return;
        }

        await loadProjects();
    }
);


// =========================================================
// HERO SLIDER
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const slides =
            document.querySelectorAll(
                ".hero-slide"
            );

        const dots =
            document.querySelectorAll(
                ".hero-dot"
            );

        const prevBtn =
            document.querySelector(
                ".hero-prev"
            );

        const nextBtn =
            document.querySelector(
                ".hero-next"
            );

        if (!slides.length) {
            return;
        }

        let currentSlide = 0;

        let sliderTimer;


        function showSlide(index) {

            if (index >= slides.length) {

                currentSlide = 0;

            } else if (index < 0) {

                currentSlide =
                    slides.length - 1;

            } else {

                currentSlide = index;
            }


            slides.forEach(
                (slide, i) => {

                    slide.classList.toggle(
                        "active",
                        i === currentSlide
                    );
                }
            );


            dots.forEach(
                (dot, i) => {

                    dot.classList.toggle(
                        "active",
                        i === currentSlide
                    );
                }
            );
        }


        function nextSlide() {

            showSlide(
                currentSlide + 1
            );
        }


        function previousSlide() {

            showSlide(
                currentSlide - 1
            );
        }


        function startSlider() {

            clearInterval(
                sliderTimer
            );

            sliderTimer =
                setInterval(
                    () => {

                        nextSlide();

                    },
                    5000
                );
        }


        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                () => {

                    nextSlide();

                    startSlider();
                }
            );
        }


        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                () => {

                    previousSlide();

                    startSlider();
                }
            );
        }


        dots.forEach(
            (dot, index) => {

                dot.addEventListener(
                    "click",
                    () => {

                        showSlide(index);

                        startSlider();
                    }
                );
            }
        );


        showSlide(0);

        startSlider();
    }
);