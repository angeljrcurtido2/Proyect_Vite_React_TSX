import express from 'express';
import {
  crearTipoEgreso,
  anularTipoEgreso,
  listarTiposEgresoPag
} from '../../controllers/Movimiento/tipoEgresoController.js';

const router = express.Router();

router.post('/crear', crearTipoEgreso);
router.get('/listar', listarTiposEgresoPag);
router.delete('/anular/:id', anularTipoEgreso);

export default router;
