import express from 'express';
import { pagarDeuda, listarDeudas, getPagosDeudaDetalle, anularPagoDeuda, listarDeudasAgrupadasPorCliente, listarDeudasCompleto, getComprobantePagoDeuda ,getAllPagosDeudaDetalle, listarDeudasAgrupadasPorClienteSinPaginar } from '../../controllers/Ventas/deudaVentaController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// ✅ Middleware de autenticación
router.use(verifyToken);
// Comprobante de un pago específico
router.get('/comprobante/:idpago_deuda', getComprobantePagoDeuda);
// Ruta para registrar un pago de deuda
router.post('/pagar', pagarDeuda);
// Ruta para listar todas las deudas con paginación y búsqueda
router.get('/listar', listarDeudas);
// Ruta para listar todas las deudas con paginación y búsqueda (completo)
router.get('/listar-completo', listarDeudasCompleto);
// Ruta para listar las deudas agrupadas por cliente con paginado
router.get('/listar-por-cliente', listarDeudasAgrupadasPorCliente);
// Ruta para listar las deudas agrupadas por cliente sin paginar 
router.get("/listar-por-cliente-total", listarDeudasAgrupadasPorClienteSinPaginar)
// Ruta para listar los pagos detallados de la deuda
router.get('/listar-detalle-pagos/:iddeuda', getPagosDeudaDetalle);
// Ruta para listar los pagos detallados de la deuda (completo)
router.get('/listar-detalle-pagos-completo/:iddeuda', getAllPagosDeudaDetalle);
// Ruta para eliminar con softDelete un pago de deuda venta
router.put('/anular-pago/:idpago_deuda', anularPagoDeuda);
export default router;
