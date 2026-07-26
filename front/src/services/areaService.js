import { api } from './api';

export const areaService = {
    getAll: async () => {
        const response = await api.get('api/AllArea');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`api/AreaById?id=${id}`);
        return response.data
    },
    update: async (id, processData) => {
        const response = await api.put(`api/UpdateArea?id=${id}`, processData);
        return response.data;
    },
    create: async (processData) => {
        const response = await api.post('api/CreateArea', processData);
        return response.data;
    },

    delete: async (id, processData) => {
        const response = await api.delete(`api/AreaById?id=${id}`, processData);
        return response.data;
    }
};