import { apiRequest } from './client.js';

export const authService = {
    async login(credentials) {
        return apiRequest('/login/', {
            method: 'POST',
            body: credentials
        });
    },

    async register(userData) {
        return apiRequest('/register/', {
            method: 'POST',
            body: userData
        });
    },

    async logout() {
        return apiRequest('/logout/', {
            method: 'GET'
        });
    }
};
