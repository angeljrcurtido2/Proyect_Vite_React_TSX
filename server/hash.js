// hash.js script para encriptar contraseña 
import bcrypt from 'bcryptjs';

const generateHash = async () => {
  const password = '123456';
  const hashed = await bcrypt.hash(password, 10);
  console.log('Hash generado:', hashed);
};

generateHash();
