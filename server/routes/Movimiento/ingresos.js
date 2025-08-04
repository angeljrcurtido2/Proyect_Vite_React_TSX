import express from 'express';
import {listarIngresoyEgresoPorMovimiento, listarIngresosPorMovimiento , registrarIngreso, listarIngresos, listarIngresosPag, anularIngreso, listarCobrosMensuales, listarCobrosDelDia, listarCobrosMensualesPorAnio } from '../../controllers/Movimiento/ingresoController.js';
import { authMiddleware, requireRol } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRol(['Administrador', 'Cajero']));
router.get('/:idmovimiento/ingresos', listarIngresosPorMovimiento);
router.get('/:idmovimiento/resumen', listarIngresoyEgresoPorMovimiento);
router.get('/cobros-mensuales', listarCobrosMensuales);
router.get('/cobros-mensuales-anio', listarCobrosMensualesPorAnio);
router.get('/cobros-dia', listarCobrosDelDia);
router.post('/registrar', registrarIngreso);
router.get('/listar', listarIngresos);
router.get('/', listarIngresosPag);
router.delete('/:id', anularIngreso);

export default router;
