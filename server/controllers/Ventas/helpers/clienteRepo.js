// controllers/Ventas/helpers/clienteRepo.js
import db from "../../../db.js";

export async function getClienteData(idcliente) {
  const [rows] = await db.promise().query(
    `SELECT nombre, apellido, numDocumento FROM clientes 
     WHERE idcliente = ? AND deleted_at IS NULL`,
    [idcliente]
  );
  return rows[0] ?? null;
}
