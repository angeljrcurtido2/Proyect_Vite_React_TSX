import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const status   = err.response?.status;
    const endpoint = err.config?.url || '';

    if (status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('usuario');
      window.location.href = '/login';  
    }

    return Promise.reject(err);
  }
);

export default api;
