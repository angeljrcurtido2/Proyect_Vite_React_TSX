import express from 'express';
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clienteController.js';

const router = express.Router();

// GET listado de clientes con paginado y búsqueda
router.get('/', getClientes);

// GET un cliente específico
router.get('/:id', getClienteById);

// POST crear cliente
router.post('/', createCliente);

// PUT actualizar cliente
router.put('/:id', updateCliente);

// DELETE eliminar cliente (soft delete)
router.delete('/:id', deleteCliente);

export default router;
