import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const login = (req, res) => {
  const { login, password } = req.body;

  Usuario.findByLogin(login, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // 🔐 Crear el token JWT
    const token = jwt.sign(
      { idusuario: user.idusuarios, login: user.login, acceso: user.acceso },
      'clave_secreta_segura',
      { expiresIn: '8h' }
    );

    // ✅ Opción A: aún setea la cookie para entornos con navegador
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // solo con HTTPS
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 8,
    });

    // ✅ Opción B: también enviar el token en el body para Electron
    res.json({
      message: 'Login exitoso',
      acceso: user.acceso,
      token, // 👈 importante para Electron
    });
  });
};

export const logout = (req, res) => {
  // ✅ Borrar cookie al hacer logout
  res.clearCookie('token');
  res.json({ message: 'Logout exitoso' });
};
