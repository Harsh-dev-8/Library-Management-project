import { apiRequest } from './client.js';

export const libraryService = {
    async getBooks(url = '/GetBooks/') {
        return apiRequest(url, { method: 'GET' });
    },

    async borrowBook(payload) {
        return apiRequest('/BorrowBook/', {
            method: 'POST',
            body: payload
        });
    },

    async getMyBooks() {
        return apiRequest('/MyBooks/', { method: 'GET' });
    },

    async returnBook(payload) {
        return apiRequest('/ReturnBook/', {
            method: 'POST',
            body: payload
        });
    },

    async getFines() {
        return apiRequest('/GetFine/', { method: 'GET' });
    },

    async payFine(payload) {
        return apiRequest('/PayFine/', {
            method: 'POST',
            body: payload
        });
    }
};
