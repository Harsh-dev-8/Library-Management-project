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

document.getElementById("submit").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const csrftoken = getCookie('csrftoken');

    const url = "http://127.0.0.1:8000/api/v1/login/";

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 
            'Content-Type': 'application/json',
            ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(response => {
        return response.json().then(data => {
            showResponseMsg(data);
            if (!response.ok) {
                throw data;
            }
            return data;
        });
    })
    .then(function(response) {
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1200);
    })
    .catch(error => {
        console.error('Error:', error);
        if (error && typeof error === 'object') {
            showResponseMsg(error);
        }
    });
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
