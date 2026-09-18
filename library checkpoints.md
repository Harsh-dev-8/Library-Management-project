Phase 3 — Fines System

# Fine model (user, amount, borrow_record, status — paid/unpaid)
# Auto calculate fine on late return in services.py
GET /api/v1/GetFines/ — user sees their own unpaid fines
PATCH /Fines/ — user pays the fine and update fine reciept
Block borrowing if unpaid fine exists — add check to borrow serializer

Phase 4 — Search and Pagination

 Search books by title and author
 Pagination on book list endpoint

Phase 5 — Tests

 Auth tests (register, login, logout)
 Borrow/return flow tests
 Permission tests (member can't add books etc)
 Fine calculation tests

Phase 6 — Deployment + Docs

 Deploy backend
 Deploy frontend
 Proper README with setup instructions and API endpoint docs