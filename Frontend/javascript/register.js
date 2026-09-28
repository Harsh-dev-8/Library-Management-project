import { authService } from './api/auth.service.js';

document.getElementById("submit").addEventListener("click", async function () {
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const data = await authService.register({
            "first_name": fname,
            "last_name": lname,
            "username": username,
            "email": email,
            "password": password
        });
        showResponseMsg(data);
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    } catch (error) {
        console.error('Registration error:', error);
        const errorData = error.data || error;
        showResponseMsg(errorData);
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
