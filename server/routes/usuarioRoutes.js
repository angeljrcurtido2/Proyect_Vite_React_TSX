import express from 'express';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosPaginated,
  getMiCargo
} from '../controllers/usuarioController.js';

import { authMiddleware, requireRol } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Solo usuarios autenticados pueden acceder
router.use(authMiddleware);

// Rutas accesibles solo para Administrador
router.get('/', requireRol(['Administrador']), getUsuarios);
router.get('/paginar', requireRol(['Administrador']), getUsuariosPaginated);
router.post('/', requireRol(['Administrador']), createUsuario);
router.get('/mi-cargo', requireRol (['Administrador', 'Cajero']), getMiCargo);

// Rutas accesibles para Administrador y Auditor
router.get('/:id', requireRol(['Administrador', 'Auditor']), getUsuarioById);

// Modificar solo Administrador
router.put('/:id', requireRol(['Administrador']), updateUsuario);
router.delete('/:id', requireRol(['Administrador']), deleteUsuario);


export default router;
