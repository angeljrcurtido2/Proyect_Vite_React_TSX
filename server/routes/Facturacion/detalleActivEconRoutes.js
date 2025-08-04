import express from 'express';
import { 
  createDetalleActivEcon, 
  getActividadesByFacturador, 
  deleteDetalleActivEcon 
} from '../../controllers/detalleActivEconController.js';

const router = express.Router();

// ✅ Endpoints
router.post('/', createDetalleActivEcon); // Crear nueva relación facturador-actividad
router.get('/:idfacturador', getActividadesByFacturador); // Traer actividades de un facturador
router.delete('/:iddetalle', deleteDetalleActivEcon); // Eliminar relación actividad

export default router;
