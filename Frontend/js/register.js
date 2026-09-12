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

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        first_name: document.getElementById('regFirstName').value,
        last_name: document.getElementById('regLastName').value,
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
    };
    const msg = document.querySelector('.msg');
    const csrftoken = getCookie('csrftoken');

    const headers = { 'Content-Type': 'application/json' };
    if (csrftoken) {
        headers['X-CSRFToken'] = csrftoken;
    }

    fetch('http://127.0.0.1:8000/api/v1/register/', {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 201 || data.message) {
            msg.textContent = 'Account created successfully!';
            msg.className = 'msg success';
            setTimeout(() => { window.location.href = 'login.html'; }, 1000);
        } else {
            msg.textContent = 'Registration failed';
            msg.className = 'msg error';
        }
    })
    .catch(err => {
        msg.textContent = 'Request failed';
        msg.className = 'msg error';
        console.error(err);
    });
});