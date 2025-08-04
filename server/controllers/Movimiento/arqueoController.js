import Arqueo from '../../models/Movimiento/arqueoModel.js';

export const crearArqueo = (req, res) => {
  Arqueo.create(req.body, (err, result) => {
    if (err) {
      console.error('❌ Error al registrar arqueo:', err);
      return res.status(500).json({ error: 'Error al registrar arqueo' });
    }
    res.status(201).json({ message: '✅ Arqueo registrado correctamente', id: result.insertId });
  });
};

export const obtenerArqueoPorMovimiento = (req, res) => {
  const idmovimiento = req.params.id;
  Arqueo.findByMovimiento(idmovimiento, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al buscar arqueo' });
    if (!result.length) return res.status(404).json({ error: 'No se encontró arqueo para esta caja' });
    res.json(result[0]);
  });
};

export const listarArqueosPaginado = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  Arqueo.countFiltered(search, (errCount, total) => {
    if (errCount) return res.status(500).json({ error: 'Error al contar arqueos' });

    Arqueo.findAllPaginatedFiltered(limit, offset, search, (errData, arqueos) => {
      if (errData) return res.status(500).json({ error: 'Error al obtener arqueos paginados' });

      const totalPages = Math.ceil(total / limit);

      res.json({
        data: arqueos,
        totalItems: total,
        totalPages,
        currentPage: page
      });
    });
  });
};

export const listarArqueos = (req, res) => {
  Arqueo.findAll((err, result) => {
    if (err) return res.status(500).json({ error: 'Error al listar arqueos' });
    res.json(result);
  });
};
