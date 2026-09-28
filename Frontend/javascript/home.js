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
    const catalogGrid = document.querySelector(".catalog-grid");
    if (!catalogGrid) return;

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    let nextUrl = null;
    let prevUrl = null;

    const csrftoken = getCookie('csrftoken');
    const initialUrl = "http://127.0.0.1:8000/api/v1/GetBooks/";

    function showUnauthenticatedState() {
        const dashboardContainer = document.querySelector(".dashboard-container");
        if (!dashboardContainer) return;

        dashboardContainer.innerHTML = `
            <header class="navbar">
                <a href="home.html" class="nav-brand">
                    <svg class="nav-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                        <path d="M6 6h10"></path>
                        <path d="M6 10h10"></path>
                    </svg>
                    <span class="nav-brand-title">Library</span>
                </a>
                <div class="nav-actions">
                    <a href="login.html" class="logout-btn" style="background-color: var(--primary); color: #ffffff;">Sign In</a>
                </div>
            </header>

            <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem 1rem;">
                <div style="background-color: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 3rem 2.5rem; max-width: 540px; width: 100%; text-align: center; box-shadow: var(--shadow-card);">
                    <div style="width: 64px; height: 64px; margin: 0 auto 1.5rem; background-color: var(--primary-light); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h2 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem;">Authentication Required</h2>
                    <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem;">Please sign in to explore our comprehensive library archives, browse the catalog, manage your research checkouts, and view account activity.</p>
                    <a href="login.html" style="display: inline-block; background-color: var(--primary); color: #ffffff; padding: 0.75rem 2rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; transition: var(--transition-smooth);">Sign In to Library</a>
                </div>
            </div>

            <footer class="dashboard-footer" style="text-align: center; justify-content: center;">
                <p>&copy; 2026 Athenaeum Library Management System. All rights reserved.</p>
            </footer>
        `;
    }

    function fetchBooks(url) {
        catalogGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">Loading books...</p>`;

        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
            }
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                showUnauthenticatedState();
                throw new Error("Unauthenticated");
            }
            return response.json();
        })
        .then(data => {
            let books = [];
            if (Array.isArray(data)) {
                books = data;
                nextUrl = null;
                prevUrl = null;
            } else {
                if (data && Array.isArray(data.books)) {
                    books = data.books;
                } else if (data && Array.isArray(data.results)) {
                    books = data.results;
                } else if (data && typeof data === 'object') {
                    const foundKey = Object.keys(data).find(k => Array.isArray(data[k]));
                    if (foundKey) {
                        books = data[foundKey];
                    } else {
                        books = [data];
                    }
                }
                nextUrl = data.next_page || null;
                prevUrl = data.previous_page || null;
            }

            // Update pagination buttons state
            if (prevBtn) {
                prevBtn.disabled = !prevUrl;
            }
            if (nextBtn) {
                nextBtn.disabled = !nextUrl;
            }
            if (pageInfo) {
                try {
                    const urlObj = new URL(url);
                    const pageNum = urlObj.searchParams.get('page') || '1';
                    pageInfo.textContent = `Page ${pageNum}`;
                } catch (e) {
                    pageInfo.textContent = `Page 1`;
                }
            }

            catalogGrid.innerHTML = "";

            if (books.length === 0) {
                catalogGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">No books found in the catalog.</p>`;
                return;
            }

            for (let i = 0; i < books.length; i++) {
                const book = books[i];
                const bookId = book.id !== undefined ? book.id : (i + 1);
                const title = book.title || "Untitled Book";
                const author = book.author || "Unknown Author";
                const category = book.category || "General";
                const available = book.available !== false;

                const article = document.createElement("article");
                article.className = "book-card";
                article.setAttribute("data-book-id", bookId);

                article.innerHTML = `
                    <div class="book-info">
                        <span class="book-category">${escapeHtml(category)}</span>
                        <h3 class="book-title">${escapeHtml(title)}</h3>
                        <p class="book-author">By ${escapeHtml(author)} (ID: ${bookId})</p>
                    </div>
                    <div class="book-footer">
                        <span class="book-status" style="color: ${available ? 'var(--primary)' : '#9b1c1c'};">${available ? 'Available' : 'Unavailable'}</span>
                        <button class="borrow-btn" data-book-id="${bookId}">${available ? 'borrow' : 'borrowed'}</button>
                    </div>
                `;
                catalogGrid.appendChild(article);
            }
        })
        .catch(error => {
            if (error.message === "Unauthenticated") return;
            console.error('Error fetching books:', error);
            catalogGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #9b1c1c; padding: 2rem;">Failed to load catalog books from backend.</p>`;
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (prevUrl) {
                fetchBooks(prevUrl);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (nextUrl) {
                fetchBooks(nextUrl);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    fetchBooks(initialUrl);

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
