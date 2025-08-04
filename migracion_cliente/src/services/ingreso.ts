import api from '../lib/axiosConfig';

export const getTiposIngresoPaginated = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return api.get('/tipo-ingreso/listar', { params });
};

export const anularTipoIngreso = (id: number) => {
  return api.delete(`/tipo-ingreso/anular/${id}`);
};

export const getIngresosPaginated = (params: {
  page: number;
  limit: number;
  search?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}) => {
  return api.get('/ingresos', { params });
};

export const deleteIngreso = (id: number) => {
  return api.delete(`/ingresos/${id}`);
};

export const getCobrosMensuales = (params?: {
  anio?: number;
  mes?: number;
}) => api.get('/ingresos/cobros-mensuales', { params });

export const getCobrosMensualesPorAnio = (anio: number) =>
  api.get('/ingresos/cobros-mensuales-anio', { params: { anio } });

export const getIngresosPorMovimiento = (idmovimiento: number) => {
  return api.get(`/ingresos/${idmovimiento}/ingresos`);
};

export const getIngresosyEgresosPorMovimiento = (idmovimiento: number) => {
  return api.get(`/ingresos/${idmovimiento}/resumen`);
};

export const getCobrosDelDia = (params?: { fecha?: string }) =>
  api.get('/ingresos/cobros-dia', { params });

export const createTipoIngreso = (data: { descripcion: string }) => {
  return api.post('/tipo-ingreso/crear', data);
};

export const registrarIngreso = (data: {
  idtipo_ingreso: number;
  monto: number;
  concepto: string;
  observacion: string;
  fecha: string;
}) => {
  return api.post('/ingresos/registrar', data);
};

export const abrirMovimientoCaja = (data: {
  idusuarios: number;
  num_caja: string;
  fecha_apertura: string;
  monto_apertura: number;
  estado: 'abierto' | 'cerrado';
}) => {
  return api.post('/movimientos', data);
};