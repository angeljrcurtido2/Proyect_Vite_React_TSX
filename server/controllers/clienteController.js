import Cliente from '../models/Cliente.js';

// ✅ Obtener clientes con paginación y búsqueda
export const getClientes = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  Cliente.findAllPaginatedFiltered(limit, offset, search, (err, clientes) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al obtener clientes' });
    }

    Cliente.countFiltered(search, (err, total) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error al contar clientes' });
      }

      res.json({
        success: true,
        data: clientes,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    });
  });
};

// ✅ Obtener cliente por ID
export const getClienteById = (req, res) => {
  const { id } = req.params;

  Cliente.findById(id, (err, cliente) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al obtener cliente' });
    }
    if (!cliente.length) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }
    res.json({ success: true, data: cliente[0] });
  });
};

// ✅ Crear nuevo cliente
export const createCliente = (req, res) => {
    const data = req.body;
  
    Cliente.create(data, (err, result) => {
      if (err) {
        console.error(err);
  
        // ✅ Detectar error de entrada duplicada
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, error: 'El número de documento ya existe. Por favor ingrese uno diferente.' });
        }
  
        // ✅ Para otros errores desconocidos
        return res.status(500).json({ success: false, error: 'Error al crear cliente' });
      }
  
      res.json({ success: true, message: 'Cliente creado exitosamente', id: result.insertId });
    });
  };

// ✅ Actualizar cliente
export const updateCliente = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  Cliente.update(id, data, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al actualizar cliente' });
    }
    res.json({ success: true, message: 'Cliente actualizado exitosamente' });
  });
};

// ✅ Eliminar (soft delete) cliente
export const deleteCliente = (req, res) => {
  const { id } = req.params;

  Cliente.delete(id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al eliminar cliente' });
    }
    res.json({ success: true, message: 'Cliente eliminado exitosamente (soft delete)' });
  });
};
