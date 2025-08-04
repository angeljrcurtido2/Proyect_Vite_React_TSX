import express from 'express';
import {
  registrarEgreso,
  listarEgresos,
  listarEgresosPag,
  listarEgresosPorMovimiento,
  anularEgreso
} from '../../controllers/Movimiento/egresoController.js';
import { authMiddleware, requireRol } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRol(['Administrador', 'Cajero']));

router.get('/:idmovimiento/egresos', listarEgresosPorMovimiento);
router.post('/registrar', registrarEgreso);
router.get('/listar', listarEgresos);
router.get('/', listarEgresosPag);
router.delete('/:id', anularEgreso);

export default router;
