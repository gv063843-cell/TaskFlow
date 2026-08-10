const API =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://taskflow-api-ax00.onrender.com";

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const registerBtn = document.getElementById("registerBtn");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    registerMessage.textContent = "";

    registerBtn.disabled = true;
    registerBtn.textContent = "Creating Account...";

    try {

        const response = await fetch(`${API}/users/`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to create account"
            );
        }

        registerMessage.style.color = "#4ade80";

        registerMessage.textContent =
            "✅ Account created successfully!";

        registerForm.reset();

        setTimeout(function () {
            window.location.href = "./login.html";
        }, 1500);

    } catch (error) {

        console.error("Registration Error:", error);

        registerMessage.style.color = "#f87171";

        registerMessage.textContent =
            "❌ " + error.message;

        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";
    }

});