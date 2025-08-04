// routes/backupRoutes.js
import { Router } from 'express';
import { generarBackup } from '../controllers/backupController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import {requireRol} from '../middlewares/authMiddleware.js'
const router = Router();
router.use(verifyToken);
router.use(requireRol(['Administrador', 'Cajero']));

router.get('/backup',generarBackup);

export default router;
