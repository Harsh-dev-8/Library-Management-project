function updateNavbar() {
    const navLinks = document.querySelector('.nav-links');
    const username = localStorage.getItem('libraryUsername');

    if (username) {
        navLinks.innerHTML = `<span class="user-name">${username}</span> | <a href="#" class="logout-btn">Logout</a>`;
        document.querySelector('.logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            fetch('http://127.0.0.1:8000/api/v1/logout/', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                localStorage.removeItem('libraryUsername');
                window.location.href = 'home.html';
            })
            .catch(err => {
                console.error(err);
                localStorage.removeItem('libraryUsername');
                window.location.href = 'home.html';
            });
        });
    } else {
        navLinks.innerHTML = `<a href="login.html" class="login-btn">Login</a>`;
    }
}

updateNavbar();