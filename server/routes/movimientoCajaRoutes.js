import express from 'express';
import {
  getMovimientos,
  getMovimientoById,
  crearMovimiento,
  cerrarMovimiento,
  cerrarCaja,
  getResumenCaja,
  getMovimientosPaginated,
  hayCajaAbierta 
} from '../controllers/movimientoCajaController.js';

const router = express.Router();
router.get('/abierta', hayCajaAbierta);
router.get('/paginado', getMovimientosPaginated);
router.get('/resumen/:id', getResumenCaja); 
router.get('/', getMovimientos);
router.get('/:id', getMovimientoById);
router.post('/', crearMovimiento);
router.put('/cerrar/:id', cerrarMovimiento);
router.put('/cerrarCaja/:id', cerrarCaja);


export default router;
