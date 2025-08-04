import express from 'express';
import {
  listarDatosBancarios,
  obtenerDatoBancario,
  crearDatoBancario,
  eliminarDatoBancario,
  getAllDatosBancariosPaginated,
  editarDatosBancarios
} from '../../controllers/DatosBancarios/datosBancariosController.js';

const router = express.Router();

router.get('/paginated', getAllDatosBancariosPaginated);
router.get('/', listarDatosBancarios);
router.get('/:id', obtenerDatoBancario);
router.post('/', crearDatoBancario);
router.delete('/:id', eliminarDatoBancario);
router.put('/:id', editarDatosBancarios); 

export default router;
