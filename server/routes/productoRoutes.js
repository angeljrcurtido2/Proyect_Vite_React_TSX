import express from 'express';
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/Producto/productoController.js';

import { registrarProductoInventarioInicial } from '../controllers/Producto/registrarProductoInventarioInicial.js';


const router = express.Router();

router.get('/', getAllProductos);
router.post('/inventario-inicial', registrarProductoInventarioInicial);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;
