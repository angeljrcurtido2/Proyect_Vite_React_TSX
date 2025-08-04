import api from '../lib/axiosConfig';

export const getProveedoresPaginated = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return api.get('/proveedores', { params });
};

export const deleteProveedor = (id: number) => {
  return api.delete(`/proveedores/${id}`);
};

export const getProveedorById = (id: number | string) => {
  return api.get(`/proveedores/${id}`);
};

export const updateProveedor = (id: number | string, data: any) => {
  return api.put(`/proveedores/${id}`, data);
};

export const createProveedor = (data: any) => {
  return api.post('/proveedores', data);
};