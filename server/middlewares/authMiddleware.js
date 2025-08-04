import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // 🔹 1. Token desde cookie
  let token = req.cookies?.token;

  // 🔹 2. O desde header Authorization: Bearer xxx
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 🔹 3. Si no hay token, denegamos acceso
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, 'clave_secreta_segura');
    req.user = decoded; // payload del JWT, como login, acceso, idusuario, etc.
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireRol = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.acceso)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
};
