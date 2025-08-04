import FormaPago from '../models/formas_pago.js';

export const getFormasPago = (req, res) => {
  FormaPago.findAll((err, results) => {
    if (err) {
      console.error('❌ Error al obtener las formas de pago:', err);
      return res.status(500).json({ error: 'Error al obtener formas de pago' });
    }

    res.status(200).json(results);
  });
};
