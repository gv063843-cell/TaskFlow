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

    return {
        "Authorization": `Bearer ${getToken()}`
    };
}


function getJsonHeaders() {

    return {
        "Authorization": `Bearer ${getToken()}`,
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

        const errorText =
            await response.text();

        console.error(
            "API Error:",
            errorText
        );

        try {

            const errorData =
                JSON.parse(errorText);

            alert(
                "API Error: " +
                response.status +
                " - " +
                (errorData.detail ||
                    "Something went wrong")
            );

        } catch {

            alert(
                "API Error: " +
                response.status
            );
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
// LOAD PROJECTS
// =========================

async function loadProjects() {

    if (!checkLogin()) return;


    try {

        const response =
            await fetch(
                `${API}/projects/`,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        const projects =
            await handleResponse(
                response
            );


        if (!projects) return;


        projectSelect.innerHTML = `
            <option value="">
                Select Project
            </option>
        `;


        projectSelectTask.innerHTML = `
            <option value="">
                Select Project First
            </option>
        `;


        projectSelectAI.innerHTML = `
            <option value="">
                Select Project First
            </option>
        `;


        projects.forEach(project => {


            const option1 =
                document.createElement("option");

            option1.value =
                project.id;

            option1.textContent =
                project.name;

            projectSelect.appendChild(
                option1
            );


            const option2 =
                document.createElement("option");

            option2.value =
                project.id;

            option2.textContent =
                project.name;

            projectSelectTask.appendChild(
                option2
            );


            const option3 =
                document.createElement("option");

            option3.value =
                project.id;

            option3.textContent =
                project.name;

            projectSelectAI.appendChild(
                option3
            );

        });


        if (projects.length > 0) {

            const firstProject =
                projects[0].id;

            projectSelect.value =
                firstProject;

            projectSelectTask.value =
                firstProject;

            projectSelectAI.value =
                firstProject;
        }


        loadTasks();

    } catch (error) {

        console.error(error);

        alert(
            "Projects load nahi ho rahe."
        );
    }
}


// =========================
// CREATE PROJECT
// =========================

document
    .getElementById("createProjectBtn")
    .addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;


            const name =
                document
                    .getElementById(
                        "projectName"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "projectDescription"
                    )
                    .value
                    .trim();


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


                if (!project) return;


                alert(
                    "✅ Project Created Successfully"
                );


                document
                    .getElementById(
                        "projectName"
                    )
                    .value = "";


                document
                    .getElementById(
                        "projectDescription"
                    )
                    .value = "";


                await loadProjects();


                projectSelect.value =
                    project.id;

                projectSelectTask.value =
                    project.id;

                projectSelectAI.value =
                    project.id;

            } catch (error) {

                console.error(error);

                alert(
                    "Project create nahi ho paya."
                );
            }

        }
    );


// =========================
// PROJECT SYNC
// =========================

projectSelect.addEventListener(
    "change",
    () => {

        const value =
            projectSelect.value;

        projectSelectTask.value =
            value;

        projectSelectAI.value =
            value;
    }
);


projectSelectTask.addEventListener(
    "change",
    () => {

        const value =
            projectSelectTask.value;

        projectSelect.value =
            value;

        projectSelectAI.value =
            value;
    }
);


projectSelectAI.addEventListener(
    "change",
    () => {

        const value =
            projectSelectAI.value;

        projectSelect.value =
            value;

        projectSelectTask.value =
            value;
    }
);


// =========================
// LOAD TASKS
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
            await handleResponse(
                response
            );


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
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <b>
                    ${task.title || "No Title"}
                </b>

                <span class="task-status">

                    Status :
                    ${task.status || "Pending"}

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
// ADD TASK
// =========================

document
    .getElementById("addTaskBtn")
    .addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;


            const title =
                document
                    .getElementById(
                        "taskTitle"
                    )
                    .value
                    .trim();


            const priority =
                document
                    .getElementById(
                        "taskPriority"
                    )
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

                                    due_date: null,

                                    status: "Pending",

                                    project_id:
                                        Number(
                                            projectId
                                        )

                                })
                        }
                    );


                const task =
                    await handleResponse(
                        response
                    );


                if (!task) return;


                document
                    .getElementById(
                        "taskTitle"
                    )
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


// =========================
// EDIT TASK
// =========================

async function editTask(taskId) {

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
            await handleResponse(
                response
            );


        if (!task) return;


        document
            .getElementById(
                "editTaskId"
            )
            .value =
                task.id;


        document
            .getElementById(
                "editTaskTitle"
            )
            .value =
                task.title || "";


        document
            .getElementById(
                "editTaskDescription"
            )
            .value =
                task.description || "";


        document
            .getElementById(
                "editTaskPriority"
            )
            .value =
                task.priority || "medium";


        document
            .getElementById(
                "editTaskStatus"
            )
            .value =
                task.status || "Pending";


        const dueDate =
            document.getElementById(
                "editTaskDueDate"
            );


        if (task.due_date) {

            dueDate.value =
                task.due_date.substring(
                    0,
                    10
                );

        } else {

            dueDate.value = "";
        }


        document
            .getElementById(
                "editModal"
            )
            .style.display =
                "flex";


    } catch (error) {

        console.error(error);

        alert(
            "Task details load nahi ho payi."
        );
    }
}


// =========================
// SAVE EDITED TASK
// =========================

document
    .getElementById("saveEditBtn")
    .addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;


            const taskId =
                document
                    .getElementById(
                        "editTaskId"
                    )
                    .value;


            const title =
                document
                    .getElementById(
                        "editTaskTitle"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "editTaskDescription"
                    )
                    .value
                    .trim();


            const priority =
                document
                    .getElementById(
                        "editTaskPriority"
                    )
                    .value;


            const status =
                document
                    .getElementById(
                        "editTaskStatus"
                    )
                    .value;


            const dueDate =
                document
                    .getElementById(
                        "editTaskDueDate"
                    )
                    .value;


            if (title === "") {

                alert(
                    "Task title cannot be empty."
                );

                return;
            }


            try {

                // Get original task
                // to keep project_id

                const getResponse =
                    await fetch(
                        `${API}/tasks/${taskId}`,
                        {
                            method: "GET",

                            headers:
                                getAuthHeaders()
                        }
                    );


                const originalTask =
                    await handleResponse(
                        getResponse
                    );


                if (!originalTask) return;


                const response =
                    await fetch(
                        `${API}/tasks/${taskId}`,
                        {
                            method: "PUT",

                            headers:
                                getJsonHeaders(),

                            body:
                                JSON.stringify({

                                    title:
                                        title,

                                    description:
                                        description,

                                    priority:
                                        priority,

                                    due_date:
                                        dueDate ||
                                        null,

                                    status:
                                        status,

                                    project_id:
                                        originalTask.project_id

                                })
                        }
                    );


                const updatedTask =
                    await handleResponse(
                        response
                    );


                if (!updatedTask) return;


                alert(
                    "✅ Task Updated Successfully"
                );


                document
                    .getElementById(
                        "editModal"
                    )
                    .style.display =
                        "none";


                loadTasks();

            } catch (error) {

                console.error(error);

                alert(
                    "Task update nahi ho paya."
                );
            }

        }
    );


// =========================
// CANCEL EDIT
// =========================

document
    .getElementById("cancelEditBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "editModal"
                )
                .style.display =
                    "none";

        }
    );


// =========================
// COMPLETE TASK
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
            await handleResponse(
                response
            );


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
// DELETE TASK
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
// STATISTICS
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
                    .getElementById(
                        "stats"
                    )
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


// =========================
// AI QUICK ADD
// =========================

document
    .getElementById("aiBtn")
    .addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;


            const text =
                document
                    .getElementById(
                        "aiText"
                    )
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
                                        Number(
                                            projectId
                                        )

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
                    .getElementById(
                        "aiText"
                    )
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


// =========================
// SEARCH TASK
// =========================

document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        async () => {

            if (!checkLogin()) return;


            const text =
                document
                    .getElementById(
                        "searchText"
                    )
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
                        document.createElement(
                            "li"
                        );


                    li.innerHTML = `

                        <b>
                            ${task.title}
                        </b>

                        <span class="task-status">

                            Status :
                            ${task.status ||
                                "Pending"}

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


                    taskList.appendChild(
                        li
                    );

                });

            } catch (error) {

                console.error(error);

                alert(
                    "Search failed."
                );
            }

        }
    );


// =========================
// SHOW ALL
// =========================

document
    .getElementById("showAllBtn")
    .addEventListener(
        "click",
        () => {

            loadTasks();

        }
    );


// =========================
// LOGOUT
// =========================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";

        }
    );


// =========================
// INITIAL LOAD
// =========================

window.addEventListener(
    "load",
    () => {

        if (!checkLogin()) return;

        loadProjects();

    }
);