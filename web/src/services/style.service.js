import api from './api';

export async function fetchStyles() {
    const response = await api.get('/styles');
    return response.data;
}

export async function createStyle(payload) {
    const response = await api.post('/styles', payload);
    return response.data;
}
