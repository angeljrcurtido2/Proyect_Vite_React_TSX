import api from '../lib/axiosConfig';

export interface CompraPayload {
  compra: {
    idproveedor: string;
    nro_factura: string;
    fecha: string;
    tipo: 'contado' | 'credito';
    estado: string;
    descuento: number;
    observacion: string;
    fecha_vencimiento: string;
    total: number;
    idmovimiento?: number;   
    idusuarios?: number;    
  };
  detalles: Array<{
    idproducto: number | string;
    iddetalle: number | null;
    cantidad: string | number;
    precio: string | number;
    fecha_vencimiento: string;
    nombre_producto: string;
    unidad_medida: string;
    iva: string | number;
  }>;
  productosNuevos: Array<{
    idtemp: string;
    nombre_producto: string;
    precio_compra: string | number;
    precio_venta: string | number;
    unidad_medida: string;
    iva: string | number;
    idcategoria: number;
    idproveedor: string;
  }>;
}

export interface PagarDeudaCompraPayload {
  iddeuda: number;
  observacion: string;
  idformapago: number | null;
  monto: number;
  detalle_transferencia_pago?: any; //
  detalle_tarjeta_compra_pago?: any;
  detalle_cheque_compra_pago?: any;
}

export interface PagarDeudaCompraResponse {
  message: string;
  comprobante?: any;
}

export interface DeudaCompra {

  iddeuda: number;
  total: number;
  saldo: number;
  fecha_deuda: string;

}

export interface DetallePago {
  idpago: number;
  monto: number;
  fecha_pago: string;
 
}

export interface FetchDetallesPagoResponse {
  data: DetallePago[];
  totalPages: number;
}

export interface FetchDeudasCompraResponse {
  data: DeudaCompra[];
  totalPages: number;
}


export const getConfiguracion = () => {
  return api.get('/configuracion');
};

export const getLotesProducto = (idproducto: number | string) => {
  return api.get(`/detalle-compra/producto/${idproducto}`);
};

/** 3️⃣ Crear nueva compra (compra + detalles + productos nuevos) */
export const createCompra = (payload: any) => {
  return api.post('/compras', payload);
};

// ✅ Obtener compras paginadas
export const fetchComprasPaginate = (page: number, limit: number, search: string) => {
  return api.get('/compras', {
    params: { page, limit, search },
  });
};

// ✅ Eliminar compra por ID
export const deleteCompra = (id: number) => {
  return api.delete(`/compras/${id}`);
};

export const obtenerResumenComprasDia = () => {
  return api.get('/compras/resumen-dia');
}

export const pagarDeudaCompra = (payload: PagarDeudaCompraPayload) => {
  return api.post<PagarDeudaCompraResponse>('/deuda-compra/pagar', payload);
};

export const fetchDeudasCompra = (page: number, limit: number, search: string) => {
  return api.get<FetchDeudasCompraResponse>('/deuda-compra/listar', {
    params: { page, limit, search },
  });
};

export const fetchDetallesPago = (iddeuda: number, page: number, search: string) => {
  return api.get<FetchDetallesPagoResponse>(`/deuda-compra/listar-detalle-pagos/${iddeuda}`, {
    params: { page, limit: 5, search },
  });
};

export const anularPagoDeudaCompra = (idpago: number) => {
  return api.put(`/deuda-compra/anular-pago/${idpago}`);
};


