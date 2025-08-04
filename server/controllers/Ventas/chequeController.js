import DetalleChequeVenta from '../../models/DetalleChequeVenta.js';

export const crearChequeVenta = (req, res) => {
  const chequeData = req.body;

  if (!chequeData.idventa || !chequeData.banco || !chequeData.nro_cheque || !chequeData.monto) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del cheque' });
  }

  DetalleChequeVenta.create(chequeData, (err, result) => {
    if (err) {
      console.error('❌ Error al registrar cheque:', err);
      return res.status(500).json({ error: 'Error al registrar el cheque' });
    }

    res.status(201).json({ message: '✅ Cheque registrado correctamente', id: result.insertId });
  });
};
