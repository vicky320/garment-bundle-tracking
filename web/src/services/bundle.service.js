import api from './api';

export async function fetchBundles() {
    const response = await api.get('/bundles');
    return response.data;
}

export async function createBundle(payload) {
    const response = await api.post('/bundles', payload);
    return response.data;
}

export async function advanceBundleStage(bundleId) {
    const response = await api.patch(`/bundles/${bundleId}/advance`);
    return response.data;
}
