import express from 'express';
import {
  crearArqueo,
  obtenerArqueoPorMovimiento,
  listarArqueos,
  listarArqueosPaginado
} from '../../controllers/Movimiento/arqueoController.js';
import { authMiddleware, requireRol } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Aplica autenticación a todas las rutas
router.use(authMiddleware);

// 🔐 Registrar arqueo: solo Cajero o Administrador
router.post('/registrar', requireRol(['Cajero', 'Administrador']), crearArqueo);

// 🔐 Obtener arqueo por ID de movimiento: solo Auditor o Admin
router.get('/movimiento/:id', requireRol(['Administrador', 'Auditor']), obtenerArqueoPorMovimiento);

// 🔐 Listar todos los arqueos
router.get('/listar', requireRol(['Administrador', 'Auditor']), listarArqueos);

// 🔐 Listar con paginación
router.get('/listar/paginado', requireRol(['Administrador', 'Auditor']), listarArqueosPaginado);

export default router;
