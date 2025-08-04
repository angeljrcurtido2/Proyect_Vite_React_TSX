import express from 'express';
import { 
  createActividad,
  getAllActividades,
  getActividadById,
  updateActividad,
  deleteActividad
} from '../../controllers/actividadesEconomicasController.js';

const router = express.Router();

// ✅ Endpoints
router.post('/', createActividad);
router.get('/', getAllActividades);
router.get('/:id', getActividadById);
router.put('/:id', updateActividad);
router.delete('/:id', deleteActividad);

export default router;
