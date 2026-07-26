import { api } from './api';

export const processoService = {
  getByArea: async (idArea) => {
    const response = await api.get(`api/GetProcess?IdArea=${idArea}`);
    return response;
  },

  update: async (id, processoData) => {
    const response = await api.put(`api/UpdateProcess?id=${id}`, processoData);
    return response.data
  },

  create: async (areaData) => {
    const response = await api.post('api/CreateProcess', areaData);
    return response.data;
  },

  delete: async (id, areaData) => {
    const response = await api.delete(`api/ProcessoById?id=${id}`, areaData);
    return response.data;
  }
};