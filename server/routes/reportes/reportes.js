import express from 'express';
import {getResumenVentasDia} from '../../controllers/Reportes/reportes.js';

const router = express.Router();

router.get('/', getResumenVentasDia);

export default router;