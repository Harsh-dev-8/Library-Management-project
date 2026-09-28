function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn") || document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const csrftoken = getCookie('csrftoken');
            const url = "http://127.0.0.1:8000/api/v1/logout/";

            fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
                }
            })
            .then(response => response.json().catch(() => ({})))
            .then(data => {
                console.log("Logged out successfully", data);
                window.location.href = "login.html";
            })
            .catch(error => {
                console.error('Logout error:', error);
                window.location.href = "login.html";
            });
        });
    }
});
