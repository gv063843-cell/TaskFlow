const API =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://taskflow-api-ax00.onrender.com";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent = "";

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {

        const formData = new URLSearchParams();

        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch(
            `${API}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Invalid email or password"
            );
        }

        // Save JWT token
        localStorage.setItem(
            "token",
            data.access_token
        );

        // Open dashboard
        window.location.href = "index.html";

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        loginMessage.textContent =
            "❌ " + error.message;

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }

});