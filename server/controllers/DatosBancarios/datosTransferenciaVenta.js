import DatosTransferenciaVenta from '../../models/DatosBancarios/DatosTransferenciaVenta.js';

export const crearDatoTransferenciaVenta = (req, res) => {
  const {
    idventa,
    banco_origen,
    numero_cuenta,
    tipo_cuenta,
    titular_cuenta,
    observacion
  } = req.body;

  if (!idventa || !banco_origen || !numero_cuenta || !tipo_cuenta || !titular_cuenta) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const data = {
    idventa,
    banco_origen,
    numero_cuenta,
    tipo_cuenta,
    titular_cuenta,
    observacion: observacion || null
  };

  DatosTransferenciaVenta.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar datos de transferencia', detalle: err });
    }
    res.status(201).json({
      mensaje: 'Datos de transferencia registrados con éxito',
      id: result.insertId
    });
  });
};
