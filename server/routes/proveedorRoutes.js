import express from 'express';
import {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from '../controllers/proveedorController.js';
import { authMiddleware, requireRol } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRol(['Administrador', 'Cajero']));

router.get('/', getAllProveedores);
router.get('/:id', getProveedorById);
router.post('/', createProveedor);
router.put('/:id', updateProveedor);
router.delete('/:id', deleteProveedor);

export default router;
