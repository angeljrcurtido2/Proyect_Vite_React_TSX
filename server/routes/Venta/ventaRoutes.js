import express from 'express';
import {
  createVenta,
  getVentas,
  getVentaById,
  deleteVenta,
  comprobanteVenta,
  getResumenVentasDia,
  getVentasPorMes,
  getProgresoMetaMensual,
  getEstadisticasVentas,
  getProductosMasVendidos
} from '../../controllers/Ventas/ventaController.js';
import { verificarFechaVenciLote } from '../../controllers/Ventas/Validaciones/verificarFechaVenciLote.js';
import { verificarFechaSimulada } from '../../controllers/Ventas/Validaciones/verificarFechaSimulada.js';
import { verificarFechaVencimiento } from '../../controllers/Ventas/verificarFechaVencimiento.js';
import { simularDetallesVenta } from '../../controllers/Ventas/simularDetallesVenta.js';

import { verifyToken } from '../../middlewares/verifyToken.js';
import {requireRol} from '../../middlewares/authMiddleware.js'
const router = express.Router();

// ✅ Middleware de autenticación (verifica cookie o header)
router.use(verifyToken);

// ✅ 2. Verifica autorización (solo Administrador o Cajero)
router.use(requireRol(['Administrador', 'Cajero']));

// Todas estas rutas ya están protegidas por rol:
router.post('/', createVenta);
router.get('/estadisticas-anuales', getEstadisticasVentas);
router.get('/productos-mas-vendidos', getProductosMasVendidos);
router.get('/progreso-meta-mensual', getProgresoMetaMensual);
router.get('/resumen-ventas-dia', getResumenVentasDia);
router.get('/ventas-mensuales', getVentasPorMes);
router.get('/', getVentas);
router.get('/:id', getVentaById);
router.delete('/:id', deleteVenta);
router.post('/verificar-fecha-vencimiento-simulador', verificarFechaSimulada);
router.post('/verificar-fecha-vencimiento-lote', verificarFechaVenciLote);
router.post('/verificar-fecha-vencimiento', verificarFechaVencimiento);
router.get('/comprobante/:id', comprobanteVenta);
router.post('/preparar-detalles', simularDetallesVenta);


export default router;
