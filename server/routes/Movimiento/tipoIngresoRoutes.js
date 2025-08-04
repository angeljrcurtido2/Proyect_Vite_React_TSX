import express from 'express';
import {
  crearTipoIngreso,
  anularTipoIngreso,
  listarTiposIngresoPag
} from '../../controllers/Movimiento/tipoIngresoController.js';

const router = express.Router();

router.post('/crear', crearTipoIngreso);
router.get('/listar', listarTiposIngresoPag);
router.delete('/anular/:id', anularTipoIngreso);

export default router;
