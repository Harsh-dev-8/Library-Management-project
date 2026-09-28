import { authService } from './api/auth.service.js';

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn") || document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function (e) {
            e.preventDefault();
            try {
                await authService.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                window.location.href = "login.html";
            }
        });
    }
});
