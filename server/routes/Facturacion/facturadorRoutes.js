import express from 'express';
import { 
  createFacturador,
  getAllFacturadores,
  getFacturadorById,
  updateFacturador,
  culminarFacturador,
  deleteFacturador
} from '../../controllers/facturadorController.js';

const router = express.Router();

// ✅ Endpoints
router.post('/', createFacturador);
router.get('/', getAllFacturadores);
router.get('/:id', getFacturadorById);
router.put('/:id', updateFacturador);
router.put('/culminar/:id', culminarFacturador);
router.delete('/:id', deleteFacturador);

export default router;
