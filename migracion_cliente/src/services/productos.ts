import api from '../lib/axiosConfig';

export const getProductosPaginated = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return api.get('/productos', { params });
};

export const deleteProducto = (id: number) => {
  return api.delete(`/productos/${id}`);
};

export const getProductoById = (id: number | string) => {
  return api.get(`/productos/${id}`);
};

export const updateProducto = (id: number | string, data: any) => {
  return api.put(`/productos/${id}`, data);
};