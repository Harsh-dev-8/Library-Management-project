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

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const msg = document.querySelector('.msg');
    const csrftoken = getCookie('csrftoken');

    const headers = { 'Content-Type': 'application/json' };
    if (csrftoken) {
        headers['X-CSRFToken'] = csrftoken;
    }

    fetch('http://127.0.0.1:8000/api/v1/login/', {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'successfully logged in') {
            localStorage.setItem('libraryUsername', username);
            msg.textContent = 'Login successful!';
            msg.className = 'msg success';
            setTimeout(() => { window.location.href = 'home.html'; }, 1000);
        } else {
            msg.textContent = data.message || 'Invalid credentials';
            msg.className = 'msg error';
        }
    })
    .catch(err => {
        msg.textContent = 'Request failed';
        msg.className = 'msg error';
        console.error(err);
    });
});