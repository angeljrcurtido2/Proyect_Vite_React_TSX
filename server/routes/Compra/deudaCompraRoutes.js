// routes/deudaCompraRoutes.js
import express from 'express';
import { listarDeudasCompra, pagarDeudaCompra, getPagosDeudaCompraDetalle, anularPagoDeudaCompra } from '../../controllers/Compras/deudaCompraController.js';
import { authMiddleware, requireRol } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRol(['Administrador', 'Cajero']));

// GET /api/deuda-compra/listar
router.get('/listar', listarDeudasCompra);
// Ruta para registrar un pago de deuda
router.post('/pagar', pagarDeudaCompra);
// Ruta para listar los pagos detallados de la deuda
router.get('/listar-detalle-pagos/:iddeuda', getPagosDeudaCompraDetalle);
// Ruta para eliminar con softDelete un pago de deuda venta
router.put('/anular-pago/:idpago_deuda', anularPagoDeudaCompra);
export default router;
