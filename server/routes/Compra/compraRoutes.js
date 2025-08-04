import express from 'express';
import {
  createCompra,
  getCompras,
  getCompraById,
  deleteCompra,
  getResumenComprasDia
} from '../../controllers/Compras/compraController.js';
import { authMiddleware, requireRol } from '../../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
router.use(requireRol(['Administrador', 'Cajero']));

router.get('/resumen-dia', getResumenComprasDia);
router.get('/', getCompras);
router.get('/:id', getCompraById);
router.post('/', createCompra);
router.delete('/:id', deleteCompra);


export default router;
