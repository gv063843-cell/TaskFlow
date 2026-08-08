const API = "https://taskflow-api-ax00.onrender.com";


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


        // Load tasks of first project

        loadTasks();


    } catch (error) {

        console.error(error);

        alert("Projects load nahi ho paaye.");

    }

}


// =========================
// Project Change
// =========================

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


        // Load only selected project tasks

        loadTasks();

    }
);


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


        // IMPORTANT:
        // Only selected project's tasks

        const tasks =
            allTasks.filter(
                task =>
                    Number(task.project_id)
                    === Number(currentProjectId)
            );


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

document
    .getElementById("addTaskBtn")
    .addEventListener(
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

    });


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

document
    .getElementById("statsBtn")
    .addEventListener(
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


            // Only selected project

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

    });


// =========================
// AI Quick Add
// =========================

document
    .getElementById("aiBtn")
    .addEventListener(
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


            loadTasks();


        } catch (error) {

            console.error(error);

            alert(
                "AI Quick Add failed."
            );

        }

    });


// =========================
// Search Task
// =========================

document
    .getElementById("searchBtn")
    .addEventListener(
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


            const allTasks =
                await handleResponse(
                    response
                );


            if (!allTasks) return;


            // Only selected project's tasks

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

            alert(
                "Search failed."
            );

        }

    });


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