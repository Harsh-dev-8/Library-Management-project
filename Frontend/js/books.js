async function loadBooks() {
    const url = "http://127.0.0.1:8000/api/v1/home/";
    const grid = document.getElementById('bookGrid');

    try {
        const response = await fetch(url, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

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

        return `
            <div class="book-card">
                <h3>${escapeHtml(title)}</h3>
                <div class="book-author">by ${escapeHtml(author)}</div>
                <div class="book-category">Category: ${escapeHtml(category)}</div>
                <span class="book-status ${available ? 'available' : 'unavailable'}">
                    ${available ? 'Available' : 'Unavailable'}
                </span>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

loadBooks();