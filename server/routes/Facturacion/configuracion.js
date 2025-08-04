import express from 'express';

import {
  getConfiguraciones,
  setConfiguracion,
  getConfiguracionByClave,
  getValorConDefault
} from '../../controllers/configuracionController.js';

const router = express.Router();
router.get('/', getConfiguraciones);
router.post('/', setConfiguracion);

// ⚠️ ESTA PRIMERO
router.get('/string/:clave', getConfiguracionByClave);

// ⚠️ ESTA SEGUNDO, devuelve boolean
router.get('/valor/:clave', getValorConDefault);

// General (puede ser redundante si usás string/:clave)
router.get('/:clave', getConfiguracionByClave);

export default router;
