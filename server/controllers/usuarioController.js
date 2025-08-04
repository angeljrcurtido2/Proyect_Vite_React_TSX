import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

export const getUsuarios = (req, res) => {
  Usuario.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getUsuarioById = (req, res) => {
  Usuario.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

export const getUsuariosPaginated = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  console.log("📥 Parámetros recibidos:");
  console.log("🔎 search:", `"${search}"`);
  console.log("📄 page:", page);
  console.log("📏 limit:", limit);
  console.log("↪ offset:", offset);

  Usuario.countFiltered(search, (err, total) => {
    if (err) {
      console.error("❌ Error al contar resultados:", err);
      return res.status(500).json({ error: err });
    }

    console.log("📊 Total resultados encontrados:", total);

    Usuario.findAllPaginatedFiltered(limit, offset, search, (err, data) => {
      if (err) {
        console.error("❌ Error al obtener datos:", err);
        return res.status(500).json({ error: err });
      }

      console.log("📦 Datos devueltos:", data);

      const totalPages = Math.ceil(total / limit);
      res.json({
        data,
        totalItems: total,
        totalPages,
        currentPage: page,
      });
    });
  });
};

export const createUsuario = async (req, res) => {
  try {
    const {
      login,
      password,
      acceso,
      estado,
      nombre,
      apellido,
      telefono,
    } = req.body;

    // Validar campos obligatorios
    if (!login || !password || !acceso || !nombre || !apellido) {
      return res
        .status(400)
        .json({ error: 'Faltan campos obligatorios: login, password, acceso, nombre o apellido' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construir objeto para crear
    const nuevoUsuario = {
      login,
      password: hashedPassword,
      acceso,
      estado: estado || 'activo',
      nombre,
      apellido,
      telefono: telefono || null,
    };

    Usuario.create(nuevoUsuario, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { login, acceso, estado, nombre, apellido, telefono, password } = req.body;
    const id = req.params.id;

    // Validar campos obligatorios (ajusta según tus reglas)
    if (!login || !acceso || !nombre || !apellido) {
      return res
        .status(400)
        .json({ error: 'Faltan campos obligatorios: login, acceso, nombre o apellido' });
    }

    // Construir objeto con los campos a actualizar
    const datosActualizar = {
      login,
      acceso,
      estado: estado || 'activo',
      nombre,
      apellido,
      telefono: telefono || null,
    };

    // Si viene contraseña nueva, la encriptamos
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      datosActualizar.password = hashedPassword;
    }

    Usuario.update(id, datosActualizar, (err) => {
      if (err) {
        console.error('❌ Error en Usuario.update:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Usuario actualizado' });
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getMiCargo = (req, res) => {
  const idusuario = req.user?.idusuario;

  if (!idusuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  Usuario.findById(idusuario, (err, rows) => {
    if (err)       return res.status(500).json({ error: err });
    if (!rows?.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const u = rows[0];
    res.json({
      acceso        : u.acceso,                    
      nombreUsuario : `${u.nombre} ${u.apellido}`  
    });
  });
};

export const deleteUsuario = (req, res) => {
  Usuario.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Usuario eliminado' });
  });
};
