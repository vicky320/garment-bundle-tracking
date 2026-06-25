import axios from 'axios';

export const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: `${apiUrl}/api`,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('auth');
    if (stored) {
        try {
            const { token } = JSON.parse(stored);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Failed to parse auth token', error);
        }
    }
    return config;
});

export default api;
