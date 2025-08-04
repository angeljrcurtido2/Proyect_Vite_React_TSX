import express from 'express';
import { getLotesPorProducto } from '../../controllers/detalleCompraController.js';

const router = express.Router();

router.get('/producto/:id', getLotesPorProducto);

export default router;
