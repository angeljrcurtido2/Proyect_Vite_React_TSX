// routes/VentasProgramadas/ventasProgramadasRoutes.js

import express from 'express';
import {
  createVentaProgramada,
  getVentasProgramadasPaginated,
  anularVentaProgramada,
  getVentasProgramadasPorCliente
} from '../../controllers/Ventas/ventasProgramadasController.js';

import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

// ✅ Middleware de autenticación
router.use(verifyToken);

// ✅ Middleware de roles para todas las rutas de ventas programadas
//router.use(requireRol(['Administrador', 'Cajero']));

// ✅ Crear venta programada
router.post('/', createVentaProgramada);

// ✅ Listar ventas programadas con paginación y búsqueda
router.get('/', getVentasProgramadasPaginated);

router.put('/anular/:id', anularVentaProgramada);

router.get('/cliente/:idcliente', getVentasProgramadasPorCliente);

export default router;
