// controllers/backupController.js
import { Backup } from '../models/Backup.js';
import path from 'path';

export const generarBackup = async (req, res) => {
  try {
    const dumpFile = await Backup.createDump();
    
    res.download(
      dumpFile,
      path.basename(dumpFile),   // nombre que ve el usuario
      (err) => {
        if (err) console.error('Error al enviar el backup:', err);
        // opcional: borrar el dump después de enviarlo
        // fs.unlinkSync(dumpFile);
      }
    );
  } catch (err) {
    console.error('❌ Error al generar backup:', err);
    res.status(500).json({ error: 'No se pudo generar el respaldo' });
  }
};
