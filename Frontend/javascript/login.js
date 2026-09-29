import { authService } from './api/auth.service.js';

document.getElementById("submit").addEventListener("click", async function () {
    const submitBtn = document.getElementById("submit");
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        showResponseMsg("Please enter both username and password.");
        return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Signing in... (Waking up server)";

    try {
        const data = await authService.login({ username, password });
        showResponseMsg(data);
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1200);
    } catch (error) {
        console.error('Login error:', error);
        const errorData = error.data || error;
        showResponseMsg(errorData);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

function showResponseMsg(data) {
    const msgBox = document.getElementById("responseMsg");
    if (!msgBox) return;

    let text = "";
    if (typeof data === 'object' && data !== null) {
        const values = [];
        for (const key in data) {
            if (Array.isArray(data[key])) {
                values.push(`${key}: ${data[key].join(', ')}`);
            } else if (typeof data[key] === 'object' && data[key] !== null) {
                values.push(`${key}: ${JSON.stringify(data[key])}`);
            } else {
                values.push(String(data[key]));
            }
        }
        text = values.join(' | ');
    } else {
        text = String(data);
    }

    msgBox.textContent = text;
    msgBox.style.display = "block";
}
