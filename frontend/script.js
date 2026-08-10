const API =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://taskflow-api-ax00.onrender.com";

// =========================
// Current Selected Project
// =========================

let currentProjectId = null;

// =========================
// Get Login Token
// =========================

function getToken() {
    return localStorage.getItem("token");
}

// =========================
// Authorization Headers
// =========================

function getAuthHeaders() {

    const token = getToken();

    return {
        "Authorization": `Bearer ${token}`
    };
}

function getJsonHeaders() {

    const token = getToken();

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}

// =========================
// Check Login
// =========================

function checkLogin() {

    const token = getToken();

    if (!token) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}

// =========================
// Handle API Response
// =========================

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

// =========================
// Elements
// =========================

const taskList =
    document.getElementById("taskList");

const projectSelect =
    document.getElementById("projectSelect");

const projectInfo =
    document.getElementById("projectInfo");

// =========================
// Load Projects
// =========================

async function loadProjects() {

    if (!checkLogin()) return;

    try {

        const response = await fetch(
            `${API}/projects/`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const projects =
            await handleResponse(response);

        if (!projects) return;

        projectSelect.innerHTML = "";

        if (projects.length === 0) {

            projectSelect.innerHTML = `
                <option value="">
                    No Projects Found
                </option>
            `;

            projectInfo.innerText =
                "Please create a project first.";

            currentProjectId = null;

            taskList.innerHTML = `
                <li>No Project Selected</li>
            `;

            return;
        }

        // Add projects to dropdown

        projects.forEach(project => {

            const option =
                document.createElement("option");

            option.value = project.id;

            option.textContent =
                project.name;

            projectSelect.appendChild(option);

        });

        // Select first project automatically

        currentProjectId =
            projects[0].id;

        projectSelect.value =
            currentProjectId;

        projectInfo.innerText =
            `Current Project: ${projects[0].name}`;

        // Load tasks

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Projects load nahi ho paaye.");
    }
}

// =========================
// Create Project
// =========================

const createProjectBtn =
    document.getElementById("createProjectBtn");

if (createProjectBtn) {

    createProjectBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;

            const name =
                document
                    .getElementById("projectName")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("projectDescription")
                    .value
                    .trim();

            if (name === "") {

                alert("Enter Project Name");

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
                    await handleResponse(response);

                if (!project) return;

                alert(
                    "Project Created Successfully"
                );

                document
                    .getElementById("projectName")
                    .value = "";

                document
                    .getElementById("projectDescription")
                    .value = "";

                await loadProjects();

                // Select newly created project

                if (project.id) {

                    currentProjectId =
                        Number(project.id);

                    projectSelect.value =
                        String(project.id);

                    projectInfo.innerText =
                        `Current Project: ${project.name}`;

                    await loadTasks();
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

// =========================
// Project Change
// =========================

if (projectSelect) {

    projectSelect.addEventListener(
        "change",
        function () {

            currentProjectId =
                parseInt(this.value);

            const selectedText =
                this.options[
                    this.selectedIndex
                ].text;

            projectInfo.innerText =
                `Current Project: ${selectedText}`;

            loadTasks();
        }
    );
}

// =========================
// Format Due Date
// =========================

function formatDueDate(date) {

    if (!date) {
        return "No due date";
    }

    // If backend sends YYYY-MM-DD

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {

        const parts =
            date.split("-");

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return date;
}

// =========================
// Load Tasks
// =========================

async function loadTasks() {

    if (!checkLogin()) return;

    if (!currentProjectId) {

        taskList.innerHTML = `
            <li>Please select a project.</li>
        `;

        return;
    }

    try {

        const response = await fetch(
            `${API}/tasks/`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const allTasks =
            await handleResponse(response);

        if (!allTasks) return;

        // Only selected project's tasks

        const tasks =
            Array.isArray(allTasks)
                ? allTasks.filter(
                    task =>
                        Number(task.project_id)
                        ===
                        Number(currentProjectId)
                )
                : [];

        taskList.innerHTML = "";

        if (tasks.length === 0) {

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

    } catch (error) {

        console.error(error);

        alert(
            "Server se connection nahi ho raha."
        );
    }
}

// =========================
// Add New Task
// =========================

const addTaskBtn =
    document.getElementById("addTaskBtn");

if (addTaskBtn) {

    addTaskBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            const title =
                document
                    .getElementById("taskTitle")
                    .value
                    .trim();

            const priority =
                document
                    .getElementById("taskPriority")
                    .value;

            // Optional due date input

            const dueDateElement =
                document.getElementById(
                    "taskDueDate"
                );

            const dueDate =
                dueDateElement
                    ? dueDateElement.value || null
                    : null;

            if (title === "") {

                alert("Enter Task Title");

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
                    await handleResponse(response);

                if (!task) return;

                document
                    .getElementById("taskTitle")
                    .value = "";

                if (dueDateElement) {
                    dueDateElement.value = "";
                }

                alert(
                    "✅ Task Added Successfully"
                );

                await loadTasks();

            } catch (error) {

                console.error(error);

                alert(
                    "Task add nahi ho paya."
                );
            }

        }
    );
}

// =========================
// EDIT TASK
// =========================

async function editTask(taskId) {

    if (!checkLogin()) return;

    try {

        // Get current task

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

        const task =
            await handleResponse(response);

        if (!task) return;

        // New title

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

        // New priority

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

        // New due date

        const newDueDate =
            prompt(
                "Edit Due Date (YYYY-MM-DD):",
                task.due_date || ""
            );

        if (newDueDate === null) {
            return;
        }

        // Update task

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

        if (!updatedTask) return;

        alert(
            "✏️ Task Updated Successfully"
        );

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert(
            "Task modify nahi ho paya."
        );
    }
}

// =========================
// Complete Task
// =========================

async function completeTask(taskId) {

    if (!checkLogin()) return;

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        const task =
            await handleResponse(response);

        if (!task) return;

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

        if (!updatedTask) return;

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert(
            "Task update nahi ho paya."
        );
    }
}

// =========================
// Delete Task
// =========================

async function deleteTask(taskId) {

    if (!checkLogin()) return;

    if (
        !confirm(
            "Delete this task?"
        )
    ) return;

    try {

        const response =
            await fetch(
                `${API}/tasks/${taskId}`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );

        const result =
            await handleResponse(
                response
            );

        if (!result) return;

        alert(
            "🗑 Task Deleted Successfully"
        );

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert(
            "Task delete nahi ho paya."
        );
    }
}

// =========================
// Statistics
// =========================

const statsBtn =
    document.getElementById("statsBtn");

if (statsBtn) {

    statsBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;

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

                if (!data) return;

                const projectStats =
                    data.find(
                        project =>
                            Number(
                                project.project_id
                            )
                            ===
                            Number(
                                currentProjectId
                            )
                    );

                if (!projectStats) {

                    document
                        .getElementById("stats")
                        .innerHTML = `
                            No statistics available.
                        `;

                    return;
                }

                document
                    .getElementById("stats")
                    .innerHTML = `

                        📋 Total Tasks :
                        <b>
                            ${projectStats.total_tasks}
                        </b>

                        <br><br>

                        ✅ Completed :
                        <b>
                            ${projectStats.completed_tasks}
                        </b>

                        <br><br>

                        ⏳ Pending :
                        <b>
                            ${projectStats.pending_tasks}
                        </b>

                    `;

            } catch (error) {

                console.error(error);

                alert(
                    "Statistics load nahi ho payi."
                );
            }

        }
    );
}

// =========================
// AI Quick Add
// =========================

const aiBtn =
    document.getElementById("aiBtn");

if (aiBtn) {

    aiBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            const text =
                document
                    .getElementById("aiText")
                    .value
                    .trim();

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

                if (!data) return;

                alert(
                    "🤖 AI Task Created: "
                    + data.title
                );

                document
                    .getElementById("aiText")
                    .value = "";

                await loadTasks();

            } catch (error) {

                console.error(error);

                alert(
                    "AI Quick Add failed."
                );
            }

        }
    );
}

// =========================
// Search Task
// =========================

const searchBtn =
    document.getElementById("searchBtn");

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;

            if (!currentProjectId) {

                alert(
                    "Please select a project first."
                );

                return;
            }

            const text =
                document
                    .getElementById("searchText")
                    .value
                    .trim();

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

                // Task not found

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

                if (!result) return;

                // Backend can return
                // object or array

                const allTasks =
                    Array.isArray(result)
                        ? result
                        : [result];

                const tasks =
                    allTasks.filter(
                        task =>
                            Number(
                                task.project_id
                            )
                            ===
                            Number(
                                currentProjectId
                            )
                    );

                taskList.innerHTML = "";

                if (tasks.length === 0) {

                    taskList.innerHTML = `
                        <li>
                            No Task Found
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

            } catch (error) {

                console.error(error);

                alert(
                    "Search failed."
                );
            }

        }
    );
}

// =========================
// Show All Button
// =========================

const showAllBtn =
    document.getElementById(
        "showAllBtn"
    );

if (showAllBtn) {

    showAllBtn.addEventListener(
        "click",
        () => {

            loadTasks();

        }
    );
}

// =========================
// Initial Load
// =========================

window.addEventListener(
    "load",
    () => {

        loadProjects();

    }
);

// =========================
// Logout
// =========================

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