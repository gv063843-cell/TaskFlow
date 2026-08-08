const API = "https://taskflow-api-ax00.onrender.com";

// =========================
// Current Project ID
// =========================
let PROJECT_ID = null;


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
// Get Current User's Project
// =========================
async function loadProject() {

    if (!checkLogin()) return false;

    try {

        const response = await fetch(
            `${API}/projects/`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const projects = await handleResponse(response);

        if (!projects) return false;


        // No project found
        if (projects.length === 0) {

            alert("No project found for this account.");

            return false;
        }


        // Find default "My Tasks" project
        const defaultProject = projects.find(
            project => project.name === "My Tasks"
        );


        if (defaultProject) {

            PROJECT_ID = defaultProject.id;

        } else {

            // If My Tasks is not available,
            // use the first project
            PROJECT_ID = projects[0].id;
        }


        console.log(
            "Current Project ID:",
            PROJECT_ID
        );

        return true;

    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );

        alert("Project load nahi ho paya.");

        return false;
    }
}


// =========================
// Task List
// =========================
const taskList =
    document.getElementById("taskList");


// =========================
// Load Tasks
// =========================
async function loadTasks() {

    if (!checkLogin()) return;


    // Make sure project is loaded
    if (!PROJECT_ID) {

        const projectLoaded =
            await loadProject();

        if (!projectLoaded) return;
    }


    try {

        const response = await fetch(
            `${API}/tasks/`,
            {
                method: "GET",
                headers: getAuthHeaders()
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
                <b>${task.title || "No Title"}</b>

                <span class="task-status">
                    Status : ${task.status || "Pending"}
                </span>

                <button
                    class="complete-btn"
                    onclick="completeTask(${task.id})">
                    ✅ Complete
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
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
    .addEventListener("click", async () => {


        if (!checkLogin()) return;


        // Get project automatically
        if (!PROJECT_ID) {

            const projectLoaded =
                await loadProject();

            if (!projectLoaded) return;
        }


        const title =
            document
                .getElementById("taskTitle")
                .value
                .trim();


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

                        body: JSON.stringify({

                            title: title,

                            description: "",

                            priority: "medium",

                            due_date: null,

                            status: "Pending",

                            project_id: PROJECT_ID
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
                    headers: getAuthHeaders()
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

                    body: JSON.stringify({

                        title: task.title,

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


    if (!confirm("Delete this task?"))
        return;


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
    .addEventListener("click", async () => {


        if (!checkLogin()) return;


        try {

            const response =
                await fetch(
                    `${API}/projects/stats/summary`,
                    {
                        method: "GET",
                        headers: getAuthHeaders()
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

    });


// =========================
// AI Quick Add
// =========================
document
    .getElementById("aiBtn")
    .addEventListener("click", async () => {


        if (!checkLogin()) return;


        // Get project automatically
        if (!PROJECT_ID) {

            const projectLoaded =
                await loadProject();

            if (!projectLoaded) return;
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

                        body: JSON.stringify({

                            description: text,

                            project_id:
                                PROJECT_ID
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

    });


// =========================
// Search Task
// =========================
document
    .getElementById("searchBtn")
    .addEventListener("click", async () => {


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
                        headers: getAuthHeaders()
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

                    <b>${task.title}</b>

                    <span class="task-status">
                        Status :
                        ${task.status || "Pending"}
                    </span>

                    <button
                        class="complete-btn"
                        onclick="completeTask(${task.id})">
                        ✅ Complete
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})">
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
    async () => {

        if (!checkLogin()) return;

        // Load user's project first
        const projectLoaded =
            await loadProject();

        if (!projectLoaded) return;

        // Then load tasks
        loadTasks();
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