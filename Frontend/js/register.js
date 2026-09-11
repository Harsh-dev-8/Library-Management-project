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

    fetch('http://127.0.0.1:8000/api/v1/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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