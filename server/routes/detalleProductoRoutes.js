import express from 'express';
import {
  getAllDetalles,
  getDetalleById,
  getDetallesByProducto,
  createDetalle,
  updateDetalle,
  deleteDetalle
} from '../controllers/Producto/detalleProductoController.js';

const router = express.Router();

router.get('/', getAllDetalles);
router.get('/:id', getDetalleById);
router.get('/producto/:idproducto', getDetallesByProducto);
router.post('/', createDetalle);
router.put('/:id', updateDetalle);
router.delete('/:id', deleteDetalle);

export default router;
