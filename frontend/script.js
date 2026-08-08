const API = "https://taskflow-api-ax00.onrender.com";

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

        try {

            const errorData = JSON.parse(errorText);

            alert(
                "API Error: " +
                response.status +
                " - " +
                (errorData.detail || "Something went wrong")
            );

        } catch {

            alert("API Error: " + response.status);
        }

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

const projectSelectTask =
    document.getElementById("projectSelectTask");

const projectSelectAI =
    document.getElementById("projectSelectAI");


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


        // Clear project dropdowns

        if (projectSelect) {

            projectSelect.innerHTML = `
                <option value="">
                    Select Project
                </option>
            `;

        }

        if (projectSelectTask) {

            projectSelectTask.innerHTML = `
                <option value="">
                    Select Project First
                </option>
            `;

        }

        if (projectSelectAI) {

            projectSelectAI.innerHTML = `
                <option value="">
                    Select Project First
                </option>
            `;

        }


        // No projects

        if (projects.length === 0) {

            console.log("No projects found.");

            return;
        }


        // Add projects

        projects.forEach(project => {

            const option1 =
                document.createElement("option");

            option1.value = project.id;

            option1.textContent =
                project.name;

            if (projectSelect) {

                projectSelect.appendChild(option1);
            }


            const option2 =
                document.createElement("option");

            option2.value = project.id;

            option2.textContent =
                project.name;

            if (projectSelectTask) {

                projectSelectTask.appendChild(option2);
            }


            const option3 =
                document.createElement("option");

            option3.value = project.id;

            option3.textContent =
                project.name;

            if (projectSelectAI) {

                projectSelectAI.appendChild(option3);
            }

        });


        // Select first project automatically

        if (projects.length > 0) {

            const firstProject =
                projects[0].id;

            if (projectSelect) {
                projectSelect.value = firstProject;
            }

            if (projectSelectTask) {
                projectSelectTask.value = firstProject;
            }

            if (projectSelectAI) {
                projectSelectAI.value = firstProject;
            }
        }


        // Load tasks after projects

        loadTasks();

    } catch (error) {

        console.error(error);

        alert("Projects load nahi ho rahe.");
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
                    "✅ Project Created Successfully"
                );


                document
                    .getElementById("projectName")
                    .value = "";


                document
                    .getElementById("projectDescription")
                    .value = "";


                // Reload projects

                await loadProjects();


                // Select newly created project

                if (projectSelect) {

                    projectSelect.value =
                        project.id;
                }


                if (projectSelectTask) {

                    projectSelectTask.value =
                        project.id;
                }


                if (projectSelectAI) {

                    projectSelectAI.value =
                        project.id;
                }

            } catch (error) {

                console.error(error);

                alert(
                    "Project create nahi ho paya."
                );
            }

        }
    );
}


// =========================
// Sync Project Selection
// =========================

if (projectSelect) {

    projectSelect.addEventListener(
        "change",
        () => {

            const selected =
                projectSelect.value;

            if (projectSelectTask) {

                projectSelectTask.value =
                    selected;
            }

            if (projectSelectAI) {

                projectSelectAI.value =
                    selected;
            }

        }
    );
}


if (projectSelectTask) {

    projectSelectTask.addEventListener(
        "change",
        () => {

            const selected =
                projectSelectTask.value;

            if (projectSelect) {

                projectSelect.value =
                    selected;
            }

            if (projectSelectAI) {

                projectSelectAI.value =
                    selected;
            }

        }
    );
}


if (projectSelectAI) {

    projectSelectAI.addEventListener(
        "change",
        () => {

            const selected =
                projectSelectAI.value;

            if (projectSelect) {

                projectSelect.value =
                    selected;
            }

            if (projectSelectTask) {

                projectSelectTask.value =
                    selected;
            }

        }
    );
}


// =========================
// Load Tasks
// =========================

async function loadTasks() {

    if (!checkLogin()) return;


    try {

        const response =
            await fetch(
                `${API}/tasks/`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        const tasks =
            await handleResponse(response);


        if (!tasks) return;


        taskList.innerHTML = "";


        if (tasks.length === 0) {

            taskList.innerHTML = `
                <li>No Tasks Found</li>
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

                <span class="task-status">
                    Status :
                    ${task.status || "Pending"}
                </span>

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


            const title =
                document
                    .getElementById("taskTitle")
                    .value
                    .trim();


            const priority =
                document
                    .getElementById("taskPriority")
                    .value;


            const projectId =
                document
                    .getElementById(
                        "projectSelectTask"
                    )
                    .value;


            if (projectId === "") {

                alert(
                    "Please select a project first."
                );

                return;
            }


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

                                    due_date: null,

                                    status: "Pending",

                                    project_id:
                                        Number(projectId)

                                })
                        }
                    );


                const task =
                    await handleResponse(response);


                if (!task) return;


                document
                    .getElementById("taskTitle")
                    .value = "";


                alert(
                    "✅ Task Added Successfully"
                );


                loadTasks();

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
                                task.description,

                            priority:
                                task.priority,

                            due_date:
                                task.due_date,

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


        loadTasks();

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
    ) {
        return;
    }


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
            await handleResponse(response);


        if (!result) return;


        alert(
            "🗑 Task Deleted Successfully"
        );


        loadTasks();

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


                let total = 0;

                let completed = 0;

                let pending = 0;


                data.forEach(project => {

                    total +=
                        project.total_tasks || 0;

                    completed +=
                        project.completed_tasks || 0;

                    pending +=
                        project.pending_tasks || 0;

                });


                document
                    .getElementById("stats")
                    .innerHTML = `

                        📋 Total Tasks :
                        <b>${total}</b>

                        <br><br>

                        ✅ Completed :
                        <b>${completed}</b>

                        <br><br>

                        ⏳ Pending :
                        <b>${pending}</b>

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


            const text =
                document
                    .getElementById("aiText")
                    .value
                    .trim();


            const projectId =
                document
                    .getElementById(
                        "projectSelectAI"
                    )
                    .value;


            if (projectId === "") {

                alert(
                    "Please select a project first."
                );

                return;
            }


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
                                        Number(projectId)

                                })
                        }
                    );


                const data =
                    await handleResponse(
                        response
                    );


                if (!data) return;


                alert(
                    "🤖 AI Task Created: " +
                    data.title
                );


                document
                    .getElementById("aiText")
                    .value = "";


                loadTasks();

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


            const text =
                document
                    .getElementById("searchText")
                    .value
                    .trim();


            if (text === "") {

                loadTasks();

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


                const tasks =
                    await handleResponse(
                        response
                    );


                if (!tasks) return;


                taskList.innerHTML = "";


                if (tasks.length === 0) {

                    taskList.innerHTML =
                        `<li>No Task Found</li>`;

                    return;
                }


                tasks.forEach(task => {

                    const li =
                        document.createElement("li");


                    li.innerHTML = `

                        <b>
                            ${task.title}
                        </b>

                        <span class="task-status">

                            Status :
                            ${task.status || "Pending"}

                        </span>

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

                alert("Search failed.");
            }

        }
    );
}


// =========================
// Show All
// =========================

const showAllBtn =
    document.getElementById("showAllBtn");


if (showAllBtn) {

    showAllBtn.addEventListener(
        "click",
        () => {

            loadTasks();

        }
    );
}


// =========================
// Logout
// =========================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

        }
    );
}


// =========================
// Initial Load
// =========================

window.addEventListener(
    "load",
    () => {

        if (!checkLogin()) return;

        loadProjects();

    }
);