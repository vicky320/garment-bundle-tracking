import api from './api';

export async function fetchStock() {
    const response = await api.get('/stock');
    return response.data;
}
