// src/models/Venta/Venta.js
import db from '../../db.js';

const Venta = {
  create: (data, callback) => {
    const query = `
      INSERT INTO ventas (
        idusuarios, idcliente, idformapago, total, fecha, hora, nro_factura, nro_ticket,
        tipo, estado, idmovimiento, descuento, saldo, tipo_comprobante,
        iva5, iva10, totaliva, totalletras, estado_pago,
        idfacturador, nombre_fantasia_facturador, ruc_facturador,
        timbrado_nro_facturador, fecha_inicio_vigente_facturador,
        fecha_fin_vigente_facturador,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const values = [
      data.idusuarios || null, // <- ponelo si usás login
      data.idcliente,
      data.idformapago,
      data.total,
      data.fecha,
      data.hora || null,
      data.nro_factura,
      data.nro_ticket || null,
      data.tipo,
      data.estado,
      data.idmovimiento,
      data.descuento,
      data.saldo || 0,
      data.tipo_comprobante,
      data.iva5 || 0,
      data.iva10 || 0,
      data.totaliva || 0,
      data.totalletras || '',
      data.estado_pago || null,

      // Facturador
      data.idfacturador,
      data.nombre_fantasia_facturador,
      data.ruc_facturador,
      data.timbrado_nro_facturador,
      data.fecha_inicio_vigente_facturador,
      data.fecha_fin_vigente_facturador,
    ];

    db.query(query, values, callback);
  },

  updateDatoTransferencia: (idventa, iddato_transferencia_venta, callback) => {
    const sql = `UPDATE ventas SET iddato_transferencia_venta = ? WHERE idventa = ?`;
    db.query(sql, [iddato_transferencia_venta, idventa], callback);
  },

  updateDetalleCheque: (idventa, iddetalle_cheque_venta, callback) => {
    const sql = `UPDATE ventas SET iddetalle_cheque_venta = ? WHERE idventa = ?`;
    db.query(sql, [iddetalle_cheque_venta, idventa], callback);
  },

  updateDetalleTarjeta: (idventa, iddetalle_tarjeta_venta, callback) => {
    const sql = `UPDATE ventas SET iddetalle_tarjeta_venta = ? WHERE idventa = ?`;
    db.query(sql, [iddetalle_tarjeta_venta, idventa], callback);
  },

  findAll: (callback) => {
    db.query('SELECT * FROM ventas WHERE deleted_at IS NULL ORDER BY idventa DESC', callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM ventas WHERE idventa = ? AND deleted_at IS NULL', [id], callback);
  },

  softDelete: (id, callback) => {
    const query = `
      UPDATE ventas 
      SET deleted_at = NOW(), estado = 'anulado', updated_at = NOW() 
      WHERE idventa = ?
    `;
    db.query(query, [id], callback);
  },

  ejecutarAnulacionCompleta: (idventa, callback) => {
    const query = `CALL anularVentaCredito(?)`;
    db.query(query, [idventa], callback);
  },

  getLastTicket: (callback) => {
    const query = 'SELECT MAX(nro_ticket) AS ultimo_ticket FROM ventas WHERE deleted_at IS NULL';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      const ultimoTicket = results[0].ultimo_ticket || 0;
      callback(null, ultimoTicket);
    });
  },

  findUltimaVenta: (callback) => {
    const query = `SELECT * FROM ventas ORDER BY idventa DESC LIMIT 1`;
    db.query(query, callback);
  },

  findAllPaginatedFiltered: (limit, offset, search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT 
      v.*, 
      c.nombre AS nombre_cliente,
      c.numDocumento AS documento_cliente
    FROM ventas v
    LEFT JOIN clientes c ON v.idcliente = c.idcliente
    WHERE v.deleted_at IS NULL
      AND (
        c.nombre LIKE ? OR
        c.numDocumento LIKE ? OR
        v.nro_factura LIKE ? OR
        v.fecha LIKE ?
      )
    ORDER BY v.idventa DESC
    LIMIT ? OFFSET ?
  `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset], callback);
  },

  getTotalesIVA: (idventa, callback) => {
    const sql = `SELECT iva5, iva10, totaliva FROM ventas WHERE idventa = ?`;
    db.query(sql, [idventa], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  getResumenVentasDelDia: (callback) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const format = (d) => d.toISOString().slice(0, 10);

    const hoy = format(today);
    const ayer = format(yesterday);

    const query = `
    SELECT
      SUM(CASE WHEN DATE(fecha) = ? THEN total ELSE 0 END) AS totalHoy,
      SUM(CASE WHEN DATE(fecha) = ? THEN total ELSE 0 END) AS totalAyer
    FROM ventas
    WHERE deleted_at IS NULL
  `;

    db.query(query, [hoy, ayer], callback);
  },

  getVentasPorMes: (year, callback) => {
    const query = `
    SELECT 
      MONTH(fecha) AS mes,
      SUM(total) AS total
    FROM ventas
    WHERE YEAR(fecha) = ? AND deleted_at IS NULL
    GROUP BY mes
    ORDER BY mes
  `;
    db.query(query, [year], callback);
  },

  getProgresoMetaMensual: (year, month, callback) => {
    const query = `
    SELECT
      SUM(CASE WHEN DATE(fecha) = CURDATE() THEN total ELSE 0 END) AS hoy,
      SUM(CASE WHEN YEAR(fecha) = ? AND MONTH(fecha) = ? THEN total ELSE 0 END) AS acumulado
    FROM ventas
    WHERE deleted_at IS NULL
  `;
    db.query(query, [year, month], callback);
  },

  getEstadisticasAnuales: (year, callback) => {
    const query = `
    SELECT 
      MONTH(v.fecha) AS mes,
      SUM(v.total) AS total_ventas,
      SUM(dv.ganancia) AS total_ganancias
    FROM ventas v
    JOIN detalle_venta dv ON dv.idventa = v.idventa
    WHERE YEAR(v.fecha) = ? AND v.deleted_at IS NULL AND dv.deleted_at IS NULL
    GROUP BY mes
    ORDER BY mes
  `;
    db.query(query, [year], callback);
  },


  countFiltered: (search, callback) => {
    const searchTerm = `%${search}%`;
    const query = `
    SELECT COUNT(*) AS total
    FROM ventas v
    LEFT JOIN clientes c ON v.idcliente = c.idcliente
    WHERE v.deleted_at IS NULL
      AND (
        c.nombre LIKE ? OR
        c.numDocumento LIKE ? OR
        v.nro_factura LIKE ? OR
        v.fecha LIKE ?
      )
  `;
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total);
    });
  }

};

export default Venta;
