import api from '../lib/axiosConfig';

export const getVentasPaginated = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return api.get('/ventas', { params });
};

export const crearVenta = (data: {
  venta: any;
  detalles: any[];
  sistema_venta_por_lote: boolean;
}) => {
  return api.post('/ventas', data);
};

export const deleteVenta = (id: number) => {
  return api.delete(`/ventas/${id}`);
};

export const obtenerConfiguracionVenta = async () => {
  const [resLote, resVencimiento] = await Promise.all([
    api.get('/configuracion/valor/sistema_venta_por_lote'),
    api.get('/configuracion/valor/venta_fecha_vencimiento'),
  ]);

  return {
    sistema_venta_por_lote: resLote.data.valor,
    venta_fecha_vencimiento: resVencimiento.data.valor,
  };
};

export const pagarDeudaVenta = (data: {
  iddeuda: number;
  observacion: string;
  monto: number;
  detalle_transferencia?: any;
  detalle_tarjeta_venta_credito?: any
  detalle_cheque_venta_cobro?: any
  idformapago?: number | null;
}) => {
  return api.post('/deuda-venta/pagar', data);
};

export const listarDetallePagosDeudaVenta = (
  iddeuda: number,
  params: { page: number; limit: number; search?: string; fecha_inicio?: string; fecha_fin?: string }
) => {
  return api.get(`/deuda-venta/listar-detalle-pagos/${iddeuda}`, { params });
};

export const anularPagoDeudaVenta = (idpago: number) => {
  return api.put(`/deuda-venta/anular-pago/${idpago}`);
};

export const anularVentaProgramada = (idVenta: number) => {
  return api.put(`/ventas-programadas/anular/${idVenta}`);
};

export const listarDeudasVenta = (params: {
  page: number;
  limit: number;
  search?: string;
  estado?: string; 
}) => {
  return api.get('/deuda-venta/listar', { params });
};

export const listarDeudasVentaAgrupadasPorCliente = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return api.get('/deuda-venta/listar-por-cliente', { params });
};

export const listarDeudasVentaAgrupadasPorClienteSinPaginar = () => {
  return api.get('/deuda-venta/listar-por-cliente-total')
};

export const comprobantePagoDeudaDetalleId = (idpago_deuda: number | string) => {
  return api.get(`/deuda-venta/comprobante/${idpago_deuda}`);
};

export const listarDeudasVentaCompletoPorCliente = (params: {
  numDocumento?: string;
  estado?: string;
}) => {
  return api.get('/deuda-venta/listar-completo', { params });
};

export const listarDetallePagosDeudaCompleto = (iddeuda: number | string) => {
  return api.get(`/deuda-venta/listar-detalle-pagos-completo/${iddeuda}`);
};

export const listarVentasProgramadas = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return api.get('/ventas-programadas', { params });
};

export const comprobanteVenta = (idVenta: number) => {
  return api.get(`/ventas/comprobante/${idVenta}`);
};

export const validarVencimientoPorLote = (detalles: any[]) => {
  return api.post('/ventas/verificar-fecha-vencimiento-lote', { detalles });
};

export const validarVencimientoSimulado = (productos: { idproducto: number, cantidad: number }[]) => {
  return api.post('/ventas/verificar-fecha-vencimiento-simulador', { productos });
};

export const verificarFechaVencimiento = (payload: {
  detalles: any[],
  sistema_venta_por_lote: boolean
}) => {
  return api.post('/ventas/verificar-fecha-vencimiento', payload);
};

export const prepararDetalles = (productos: { idproducto: number, cantidad: number }[]) => {
  return api.post('/ventas/preparar-detalles', { productos });
};

export const obtenerResumenVentasDia = () => {
  return api.get('/ventas/resumen-ventas-dia');
};

export const getVentasMensuales = (year: number) => {
  return api.get('/ventas/ventas-mensuales', {
    params: { year },
  });
};

// ✅ Obtener ventas programadas por cliente
export const getVentasProgramadasPorCliente = (idcliente: number) => {
  return api.get(`/ventas-programadas/cliente/${idcliente}`);
};

export const getProgresoMetaMensual = () => {
  return api.get('/ventas/progreso-meta-mensual');
};

export const getEstadisticasVentas = (year: number) => {
  return api.get('/ventas/estadisticas-anuales', { params: { year } });
};

export const getProductosMasVendidos = (limit = 5) => {
  return api.get('/ventas/productos-mas-vendidos', { params: { limit } });
};

// ✅ Listar ventas programadas (paginadas y filtradas)
export const getVentasProgramadasPaginated = (params: {
  limit: number;
  offset: number;
  search?: string;
}) => {
  return api.get('/ventas-programadas', { params });
};

// ✅ Crear venta programada
export const createVentaProgramada = (data: {
  idcliente: number;
  idproducto: number;
  cantidad: number;
  fecha_inicio: string;
  dia_programado: number;
  iddetalle?: number;
  estado?: string;
  observacion?: string;
}) => {
  return api.post('/ventas-programadas', data);
};
