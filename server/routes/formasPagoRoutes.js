// routes/formasPagoRoutes.js
import express from 'express';
import { getFormasPago } from '../controllers/formasPagoController.js';

const router = express.Router();

router.get('/formas-pago', getFormasPago);

export default router;
