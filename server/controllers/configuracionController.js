import Configuracion from '../models/Configuracion.js';

// Obtener todas las configuraciones
export const getConfiguraciones = (req, res) => {
  Configuracion.getAll((err, results) => {
    if (err) return res.status(500).json({ error: '❌ Error al obtener configuraciones' });
    res.json(results);
  });
};

// Crear o actualizar una configuración
export const setConfiguracion = (req, res) => {
  const { clave, valor } = req.body;

  if (!clave || valor === undefined) {
    return res.status(400).json({ error: '⚠️ Clave y valor son requeridos' });
  }

  // Guardamos el valor como string directamente
  const valorStr = String(valor);

  Configuracion.crearOActualizar(clave, valorStr, (err) => {
    if (err) return res.status(500).json({ error: '❌ Error al guardar configuración' });
    res.json({ message: '✅ Configuración actualizada', clave, valor: valorStr });
  });
};

// Obtener una configuración específica
export const getConfiguracionByClave = (req, res) => {
  const { clave } = req.params;

  Configuracion.getValor(clave, (err, valor) => {
    if (err) return res.status(500).json({ error: '❌ Error al obtener configuración' });
    res.json({ clave, valor });
  });
};

export const getValorConDefault = (req, res) => {
    const { clave } = req.params;
  
    Configuracion.getValorConDefault(clave, false, (err, valor) => {
      if (err) return res.status(500).json({ error: '❌ Error al consultar configuración' });
      res.json({ clave, valor });
    });
  };
  
