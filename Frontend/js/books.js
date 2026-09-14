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

let selectedBookId = null;

async function loadBooks() {
    const url = "http://127.0.0.1:8000/api/v1/GetBooks/";
    const grid = document.getElementById('bookGrid');
    const csrftoken = getCookie('csrftoken');
    console.log(csrftoken);
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if (!Array.isArray(data)) {
            throw new Error('Unexpected response format');
        }

        renderBooks(data);
    } catch (error) {
        grid.innerHTML = `<p style="color:red;">Error: ${error.message}. Check console for details.</p>`;
        console.error('Book load error:', error);
    }
}

function renderBooks(books) {
    const grid = document.getElementById('bookGrid');

    if (!books || books.length === 0) {
        grid.innerHTML = '<p>No books available in the library.</p>';
        return;
    }

    grid.innerHTML = books.map(book => {
        const title = book.title || 'Untitled';
        const author = book.author || 'Unknown';
        const category = book.category || 'N/A';
        const available = book.available === true;

        const borrowButton = available
            ? `<button class="borrow-btn" data-book-id="${book.id}">Borrow</button>`
            : '';

        return `
            <div class="book-card">
                <h3>${escapeHtml(title)}</h3>
                <div class="book-author">by ${escapeHtml(author)}</div>
                <div class="book-category">Category: ${escapeHtml(category)}</div>
                <span class="book-status ${available ? 'available' : 'unavailable'}">
                    ${available ? 'Available' : 'Unavailable'}
                </span>
                ${borrowButton}
            </div>
        `;
    }).join('');
}

function openBorrowModal(bookId) {
    selectedBookId = bookId;
    const modal = document.getElementById('borrowModal');
    document.getElementById('borrowDatetime').value = '';
    document.getElementById('borrowMsg').textContent = '';
    modal.classList.add('show');
}

function closeBorrowModal() {
    selectedBookId = null;
    document.getElementById('borrowModal').classList.remove('show');
}

async function confirmBorrow() {
    if (selectedBookId === null) return;

    const expectedReturnDate = document.getElementById('borrowDatetime').value;
    const msg = document.getElementById('borrowMsg');
    const csrftoken = getCookie('csrftoken');
    console.log(selectedBookId);
    if (!expectedReturnDate) {
        msg.textContent = 'Please select a return date and time.';
        msg.className = 'borrow-msg error';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/BorrowBook/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                book_id: selectedBookId,
                expected_return_date: expectedReturnDate
            })
        });

        console.log(response);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            msg.textContent = data.message || 'Book borrowed successfully!';
            msg.className = 'borrow-msg success';
            setTimeout(() => {
                closeBorrowModal();
                loadBooks();
            }, 1500);
        } else {
            msg.textContent = data.message || 'Failed to borrow book.';
            msg.className = 'borrow-msg error';
        }
    } catch (error) {
        msg.textContent = 'Request failed. Check console for details.';
        msg.className = 'borrow-msg error';
        console.error('Borrow error:', error.message);
    }
}

function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('bookGrid').addEventListener('click', function(e) {
    const btn = e.target.closest('.borrow-btn');
    if (btn) {
        openBorrowModal(btn.getAttribute('data-book-id'));
    }
});

document.getElementById('borrowModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBorrowModal();
    }
});

loadBooks();