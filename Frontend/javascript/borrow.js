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
    const csrftoken = getCookie('csrftoken');

    // Create Borrow Modal HTML
    const borrowModalHtml = `
        <div class="modal-overlay" id="borrowModal">
            <div class="modal-card">
                <div class="modal-header">
                    <h3 class="modal-title" id="borrowModalTitle">Borrow Book Confirmation</h3>
                    <button class="modal-close" id="closeBorrowModal">&times;</button>
                </div>
                <div class="modal-body">
                    <p id="borrowBookInfo" style="margin-bottom: 1rem; color: var(--text-main); font-weight: 500;"></p>
                    <label for="expectedReturnDate">Expected Return Date & Time</label>
                    <input type="datetime-local" id="expectedReturnDate" aria-label="Expected return date">
                    <div class="modal-msg" id="borrowModalMsg"></div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn-secondary" id="cancelBorrowBtn">Cancel</button>
                    <button class="modal-btn-primary" id="confirmBorrowBtn">Confirm Borrow</button>
                </div>
            </div>
        </div>
    `;

    // Create My Borrows Modal HTML
    const myBorrowsModalHtml = `
        <div class="modal-overlay" id="myBorrowsModal">
            <div class="modal-card" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">My Borrowed Books</h3>
                    <button class="modal-close" id="closeMyBorrowsModal">&times;</button>
                </div>
                <div class="modal-body" id="myBorrowsBody" style="max-height: 400px; overflow-y: auto;">
                    <p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Loading your borrowed books...</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn-secondary" id="closeMyBorrowsBtn">Close</button>
                </div>
            </div>
        </div>
    `;

    // Create Fines Modal HTML
    const finesModalHtml = `
        <div class="modal-overlay" id="finesModal">
            <div class="modal-card" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">My Unpaid Fines</h3>
                    <button class="modal-close" id="closeFinesModal">&times;</button>
                </div>
                <div class="modal-body" id="finesBody" style="max-height: 400px; overflow-y: auto;">
                    <p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Loading your fines...</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn-secondary" id="closeFinesBtn">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', borrowModalHtml);
    document.body.insertAdjacentHTML('beforeend', myBorrowsModalHtml);
    document.body.insertAdjacentHTML('beforeend', finesModalHtml);

    const borrowModal = document.getElementById("borrowModal");
    const closeBorrowModal = document.getElementById("closeBorrowModal");
    const cancelBorrowBtn = document.getElementById("cancelBorrowBtn");
    const confirmBorrowBtn = document.getElementById("confirmBorrowBtn");
    const borrowBookInfo = document.getElementById("borrowBookInfo");
    const expectedReturnDateInput = document.getElementById("expectedReturnDate");
    const borrowModalMsg = document.getElementById("borrowModalMsg");

    const myBorrowsModal = document.getElementById("myBorrowsModal");
    const closeMyBorrowsModal = document.getElementById("closeMyBorrowsModal");
    const closeMyBorrowsBtn = document.getElementById("closeMyBorrowsBtn");
    const myBorrowsBody = document.getElementById("myBorrowsBody");
    const myBorrowsLink = document.getElementById("myBorrowsLink") || Array.from(document.querySelectorAll(".logout-btn")).find(el => el.textContent.trim() === "My Borrows");

    const finesModal = document.getElementById("finesModal");
    const closeFinesModal = document.getElementById("closeFinesModal");
    const closeFinesBtn = document.getElementById("closeFinesBtn");
    const finesBody = document.getElementById("finesBody");
    const finesLink = document.getElementById("finesLink") || Array.from(document.querySelectorAll(".logout-btn")).find(el => el.textContent.trim() === "Fines");

    let selectedBookId = null;

    function getDefaultReturnDate() {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        const pad = (n) => String(n).padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Event delegation for borrow buttons in catalog grid
    document.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("borrow-btn")) {
            const btn = e.target;
            if (btn.disabled || btn.textContent.trim() === "borrowed") return;

            selectedBookId = btn.getAttribute("data-book-id");
            const bookTitle = btn.closest(".book-card")?.querySelector(".book-title")?.textContent || "this book";

            borrowBookInfo.textContent = `You are about to borrow: "${bookTitle}"`;
            expectedReturnDateInput.value = getDefaultReturnDate();
            borrowModalMsg.style.display = "none";
            borrowModal.classList.add("active");
        }
    });

    closeBorrowModal.addEventListener("click", () => {
        borrowModal.classList.remove("active");
    });
    cancelBorrowBtn.addEventListener("click", () => {
        borrowModal.classList.remove("active");
    });

    confirmBorrowBtn.addEventListener("click", () => {
        if (!selectedBookId) return;

        const expectedReturnDate = expectedReturnDateInput.value;
        if (!expectedReturnDate) {
            borrowModalMsg.textContent = "Please select an expected return date.";
            borrowModalMsg.className = "modal-msg error";
            borrowModalMsg.style.display = "block";
            return;
        }

        const formattedDate = new Date(expectedReturnDate).toISOString();

        confirmBorrowBtn.disabled = true;
        confirmBorrowBtn.textContent = "Borrowing...";

        fetch("http://127.0.0.1:8000/api/v1/BorrowBook/", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
            },
            body: JSON.stringify({
                "book": parseInt(selectedBookId, 10),
                "expected_return_date": formattedDate
            })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw data;
                }
                return data;
            });
        })
        .then(data => {
            borrowModalMsg.textContent = data.message || "Book borrowed successfully!";
            borrowModalMsg.className = "modal-msg success";
            borrowModalMsg.style.display = "block";

            setTimeout(() => {
                borrowModal.classList.remove("active");
                window.location.reload();
            }, 1000);
        })
        .catch(error => {
            console.error("Borrow error:", error);
            let errMsg = "Failed to borrow book.";
            if (typeof error === 'object' && error !== null) {
                const parts = [];
                for (const k in error) {
                    if (Array.isArray(error[k])) {
                        parts.push(`${k}: ${error[k].join(', ')}`);
                    } else {
                        parts.push(`${k}: ${error[k]}`);
                    }
                }
                errMsg = parts.join(' | ');
            } else if (typeof error === 'string') {
                errMsg = error;
            }
            borrowModalMsg.textContent = errMsg;
            borrowModalMsg.className = "modal-msg error";
            borrowModalMsg.style.display = "block";
        })
        .finally(() => {
            confirmBorrowBtn.disabled = false;
            confirmBorrowBtn.textContent = "Confirm Borrow";
        });
    });

    // My Borrows click handler
    if (myBorrowsLink) {
        myBorrowsLink.addEventListener("click", (e) => {
            e.preventDefault();
            myBorrowsModal.classList.add("active");
            fetchMyBorrows();
        });
    }

    closeMyBorrowsModal.addEventListener("click", () => {
        myBorrowsModal.classList.remove("active");
    });
    closeMyBorrowsBtn.addEventListener("click", () => {
        myBorrowsModal.classList.remove("active");
    });

    // Fines click handler
    if (finesLink) {
        finesLink.addEventListener("click", (e) => {
            e.preventDefault();
            finesModal.classList.add("active");
            fetchFines();
        });
    }

    closeFinesModal.addEventListener("click", () => {
        finesModal.classList.remove("active");
    });
    closeFinesBtn.addEventListener("click", () => {
        finesModal.classList.remove("active");
    });

    function fetchMyBorrows() {
        myBorrowsBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Loading your borrowed books...</p>`;

        fetch("http://127.0.0.1:8000/api/v1/MyBooks/", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
            }
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw data;
                }
                return data;
            });
        })
        .then(data => {
            let borrowRecords = [];
            if (Array.isArray(data)) {
                borrowRecords = data;
            } else if (data && Array.isArray(data.books)) {
                borrowRecords = data.books;
            } else if (typeof data === 'string') {
                myBorrowsBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">${escapeHtml(data)}</p>`;
                return;
            }

            if (!borrowRecords || borrowRecords.length === 0) {
                myBorrowsBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">You haven't borrowed any books.</p>`;
                return;
            }

            let html = `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
            for (const record of borrowRecords) {
                const borrowedDate = record.borrowed_date ? new Date(record.borrowed_date).toLocaleDateString() : "N/A";
                const returnDate = record.expected_return_date ? new Date(record.expected_return_date).toLocaleDateString() : "N/A";

                html += `
                    <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-light); padding: 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                        <div>
                            <h4 style="font-size: 1rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">Book ID: ${escapeHtml(String(record.book))}</h4>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Borrowed on: ${borrowedDate}</p>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Expected Return: ${returnDate}</p>
                        </div>
                        <button class="modal-btn-primary return-book-btn" data-book-id="${record.book}" style="padding: 0.5rem 1rem; font-size: 0.85rem; white-space: nowrap;">Return</button>
                    </div>
                `;
            }
            html += `</div>`;
            myBorrowsBody.innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching My Borrows:", error);
            let msg = "You haven't borrowed any book";
            if (typeof error === 'string') {
                msg = error;
            } else if (error && error.detail) {
                msg = error.detail;
            }
            myBorrowsBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">${escapeHtml(msg)}</p>`;
        });
    }

    // Event listener for Return Book buttons inside My Borrows modal
    myBorrowsBody.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("return-book-btn")) {
            const btn = e.target;
            const bookId = btn.getAttribute("data-book-id");
            if (!bookId) return;

            btn.disabled = true;
            btn.textContent = "Returning...";

            fetch("http://127.0.0.1:8000/api/v1/ReturnBook/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
                },
                body: JSON.stringify({
                    "book": parseInt(bookId, 10)
                })
            })
            .then(response => {
                return response.json().then(data => {
                    if (!response.ok) {
                        throw data;
                    }
                    return data;
                });
            })
            .then(data => {
                alert(data.message || "Book returned successfully!");
                fetchMyBorrows();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(error => {
                console.error("Return error:", error);
                let errMsg = "Failed to return book.";
                if (typeof error === 'object' && error !== null) {
                    const parts = [];
                    for (const k in error) {
                        if (Array.isArray(error[k])) {
                            parts.push(`${k}: ${error[k].join(', ')}`);
                        } else {
                            parts.push(`${k}: ${error[k]}`);
                        }
                    }
                    errMsg = parts.join(' | ');
                } else if (typeof error === 'string') {
                    errMsg = error;
                }
                alert(errMsg);
                btn.disabled = false;
                btn.textContent = "Return";
            });
        }
    });

    function fetchFines() {
        finesBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Loading your fines...</p>`;

        fetch("http://127.0.0.1:8000/api/v1/GetFine/", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
            }
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw data;
                }
                return data;
            });
        })
        .then(data => {
            let finesList = [];
            if (Array.isArray(data)) {
                finesList = data;
            } else if (data && Array.isArray(data.fine)) {
                finesList = data.fine;
            } else if (data && typeof data === 'object') {
                const foundKey = Object.keys(data).find(k => Array.isArray(data[k]));
                if (foundKey) {
                    finesList = data[foundKey];
                }
            }

            if (!finesList || finesList.length === 0) {
                finesBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">You have no unpaid fines.</p>`;
                return;
            }

            let html = `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
            for (const fine of finesList) {
                const fineId = fine.id;
                const amount = fine.amount !== undefined ? fine.amount : "0.00";
                const fineDays = fine.fine_days !== undefined ? fine.fine_days : 0;
                const status = fine.status || "unpaid";
                const bookId = fine.book || "N/A";

                html += `
                    <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-light); padding: 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                        <div>
                            <h4 style="font-size: 1rem; font-weight: 600; color: #9b1c1c; margin-bottom: 0.25rem;">Fine Amount: ₹${escapeHtml(String(amount))}</h4>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Fine ID: ${escapeHtml(String(fineId))} &bull; Book ID: ${escapeHtml(String(bookId))} &bull; Days: ${escapeHtml(String(fineDays))}</p>
                        </div>
                        <button class="modal-btn-primary pay-fine-btn" data-fine-id="${fineId}" style="padding: 0.5rem 1rem; font-size: 0.85rem; white-space: nowrap; background-color: #9b1c1c;">Pay Fine</button>
                    </div>
                `;
            }
            html += `</div>`;
            finesBody.innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching fines:", error);
            let msg = "You have no unpaid fines.";
            if (typeof error === 'string') {
                msg = error;
            } else if (error && error.detail) {
                msg = error.detail;
            }
            finesBody.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">${escapeHtml(msg)}</p>`;
        });
    }

    // Event listener for Pay Fine buttons inside Fines modal
    finesBody.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("pay-fine-btn")) {
            const btn = e.target;
            const fineId = btn.getAttribute("data-fine-id");
            if (!fineId) return;

            btn.disabled = true;
            btn.textContent = "Processing...";

            fetch("http://127.0.0.1:8000/api/v1/PayFine/", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {})
                },
                body: JSON.stringify({
                    "fine_id": parseInt(fineId, 10)
                })
            })
            .then(response => {
                return response.json().then(data => {
                    if (!response.ok) {
                        throw data;
                    }
                    return data;
                });
            })
            .then(data => {
                alert(data.message || "Fine paid successfully!");
                fetchFines();
            })
            .catch(error => {
                console.error("Pay fine error:", error);
                let errMsg = "Failed to pay fine.";
                if (typeof error === 'object' && error !== null) {
                    const parts = [];
                    for (const k in error) {
                        if (Array.isArray(error[k])) {
                            parts.push(`${k}: ${error[k].join(', ')}`);
                        } else {
                            parts.push(`${k}: ${error[k]}`);
                        }
                    }
                    errMsg = parts.join(' | ');
                } else if (typeof error === 'string') {
                    errMsg = error;
                }
                alert(errMsg);
                btn.disabled = false;
                btn.textContent = "Pay Fine";
            });
        }
    });

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
