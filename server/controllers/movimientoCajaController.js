import MovimientoCaja from '../models/MovimientoCaja.js';
import libroDiarioController from './Movimiento/libroDiarioController.js';
import db from '../db.js';

export const getMovimientos = (req, res) => {
  MovimientoCaja.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getMovimientoById = (req, res) => {
  MovimientoCaja.findById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};
//getMovimientosPaginated

export const getMovimientosPaginated = (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  /* ➜ Filtros de fecha */
  const filtrosFecha = {
    aperturaDesde: req.query.aperturaDesde,
    aperturaHasta: req.query.aperturaHasta,
    cierreDesde:   req.query.cierreDesde,
    cierreHasta:   req.query.cierreHasta,
  };

  MovimientoCaja.countFiltered(search, filtrosFecha, (err, total) => {
    if (err) return res.status(500).json({ error: err });

    MovimientoCaja.findAllPaginatedFiltered(
      limit,
      offset,
      search,
      filtrosFecha,
      (err, data) => {
        if (err) return res.status(500).json({ error: err });

        const totalPages = Math.ceil(total / limit);
        res.json({
          data,
          totalItems: total,
          totalPages,
          currentPage: page,
        });
      }
    );
  });
};

export const hayCajaAbierta = (req, res) => {
  MovimientoCaja.getMovimientoAbierto((err, result) => {
    if (err) return res.status(500).json({ error: 'Error al consultar la base de datos' });

    if (result.length > 0) {
      // ✅ Hay al menos una caja abierta
      return res.json({ abierta: true, movimiento: result[0] });
    } else {
      // ❌ No hay caja abierta
      return res.json({ abierta: false });
    }
  });
};



export const crearMovimiento = (req, res) => {
  MovimientoCaja.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Movimiento de caja abierto', id: result.insertId });
  });
};

export const cerrarMovimiento = (req, res) => {
  MovimientoCaja.cerrarCaja(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Movimiento de caja cerrado correctamente' });
  });
};

export const cerrarCaja = (req, res) => {
  const idmovimiento = req.params.id;

  MovimientoCaja.getEstadoById(idmovimiento, (errEstado, estadoResult) => {
    if (errEstado) return res.status(500).json({ error: 'Error al consultar el estado de la caja' });
    if (!estadoResult.length || estadoResult[0].estado !== 'abierto') {
      return res.status(400).json({ error: 'No hay una caja abierta con ese ID' });
    }

    // 🟡 Consultamos el movimiento para obtener monto_apertura
    MovimientoCaja.findById(idmovimiento, (errMov, movResult) => {
      if (errMov || !movResult.length) {
        return res.status(500).json({ error: 'No se pudo obtener el movimiento' });
      }

      const monto_apertura = parseFloat(movResult[0].monto_apertura || 0);

      // 🔄 Continuamos con las demás consultas
      const queryIngresos = `SELECT SUM(monto) AS total FROM ingresos WHERE idmovimiento = ? AND deleted_at IS NULL`;
      const queryEgresos = `SELECT SUM(monto) AS total FROM egresos WHERE idmovimiento = ? AND deleted_at IS NULL`;
      const queryContado = `SELECT SUM(monto) AS total FROM ingresos WHERE idmovimiento = ? AND concepto LIKE '%venta contado%' AND deleted_at IS NULL`;
      const queryCobrado = `SELECT SUM(monto) AS total FROM ingresos WHERE idmovimiento = ? AND concepto LIKE '%cobro de deuda%' AND deleted_at IS NULL`;
      const queryCompras = `SELECT SUM(monto) AS total FROM egresos WHERE idmovimiento = ? AND concepto LIKE '%compra%' AND deleted_at IS NULL`;
      const queryGastos = `SELECT SUM(monto) AS total FROM egresos WHERE idmovimiento = ? AND concepto LIKE '%ajuste%' AND deleted_at IS NULL`;
      const queryCredito = `SELECT SUM(total) AS total FROM ventas WHERE idmovimiento = ? AND tipo = 'credito' AND deleted_at IS NULL`;

      db.query(queryIngresos, [idmovimiento], (err1, res1) => {
        if (err1) return res.status(500).json({ error: 'Error al calcular ingresos' });
        db.query(queryEgresos, [idmovimiento], (err2, res2) => {
          if (err2) return res.status(500).json({ error: 'Error al calcular egresos' });
          db.query(queryContado, [idmovimiento], (err3, res3) => {
            if (err3) return res.status(500).json({ error: 'Error al calcular ventas contado' });
            db.query(queryCobrado, [idmovimiento], (err4, res4) => {
              if (err4) return res.status(500).json({ error: 'Error al calcular cobros de deuda' });
              db.query(queryCompras, [idmovimiento], (err5, res5) => {
                if (err5) return res.status(500).json({ error: 'Error al calcular compras' });
                db.query(queryGastos, [idmovimiento], (err6, res6) => {
                  if (err6) return res.status(500).json({ error: 'Error al calcular gastos' });
                  db.query(queryCredito, [idmovimiento], (err7, res7) => {
                    if (err7) return res.status(500).json({ error: 'Error al calcular créditos' });

                    const ingresos = parseFloat(res1[0].total || 0);
                    const egresos = parseFloat(res2[0].total || 0);
                    const contado = parseFloat(res3[0].total || 0);
                    const cobrado = parseFloat(res4[0].total || 0);
                    const compras = parseFloat(res5[0].total || 0);
                    const gastos = parseFloat(res6[0].total || 0);
                    const credito = parseFloat(res7[0].total || 0);

                    const monto_cierre = monto_apertura + ingresos + contado + cobrado - egresos;

                    const cierreData = {
                      fecha_cierre: new Date(),
                      monto_cierre,
                      credito,
                      gastos,
                      cobrado,
                      contado,
                      ingresos,
                      compras,
                      estado: 'cerrado'
                    };

                    MovimientoCaja.cerrarCaja(idmovimiento, cierreData, (errCierre) => {
                      if (errCierre) return res.status(500).json({ error: 'Error al cerrar la caja' });
                      res.status(200).json({
                        message: '✅ Caja cerrada correctamente',
                        resumen: {
                          ...cierreData,
                          monto_apertura
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

export const getResumenCaja = (req, res) => {
  const idmovimiento = req.params.id;

  MovimientoCaja.getEstadoById(idmovimiento, (errEstado, estadoResult) => {
    if (errEstado) return res.status(500).json({ error: 'Error al consultar estado de caja' });
    if (!estadoResult.length) return res.status(404).json({ error: 'Caja no encontrada' });

    // ⬇️ Consulta adicional para obtener monto_apertura
    MovimientoCaja.findById(idmovimiento, (errMov, movResult) => {
      if (errMov || !movResult.length) return res.status(500).json({ error: 'No se pudo obtener el movimiento de caja' });

      const monto_apertura = parseFloat(movResult[0].monto_apertura || 0);

      // Consultas para totales
      const queryIngresos = `SELECT SUM(monto) AS total FROM ingresos WHERE idmovimiento = ? AND deleted_at IS NULL`;
      const queryEgresos = `SELECT SUM(monto) AS total FROM egresos WHERE idmovimiento = ? AND deleted_at IS NULL`;
      const queryContado = `SELECT SUM(monto) AS total FROM ingresos WHERE idmovimiento = ? AND concepto LIKE '%venta contado%' AND deleted_at IS NULL`;
      const queryCobrado = `SELECT SUM(monto) AS total FROM ingresos WHERE idmovimiento = ? AND concepto LIKE '%cobro de deuda%' AND deleted_at IS NULL`;
      const queryCompras = `SELECT SUM(monto) AS total FROM egresos WHERE idmovimiento = ? AND concepto LIKE '%compra%' AND deleted_at IS NULL`;
      const queryGastos = `SELECT SUM(monto) AS total FROM egresos WHERE idmovimiento = ? AND concepto LIKE '%ajuste%' AND deleted_at IS NULL`;
      const queryCredito = `SELECT SUM(v.total) AS total FROM ventas v WHERE v.tipo = 'credito' AND v.idmovimiento = ? AND v.deleted_at IS NULL`;

      db.query(queryIngresos, [idmovimiento], (err1, res1) => {
        if (err1) return res.status(500).json({ error: 'Error al calcular ingresos' });
        db.query(queryEgresos, [idmovimiento], (err2, res2) => {
          if (err2) return res.status(500).json({ error: 'Error al calcular egresos' });
          db.query(queryContado, [idmovimiento], (err3, res3) => {
            if (err3) return res.status(500).json({ error: 'Error al calcular contado' });
            db.query(queryCobrado, [idmovimiento], (err4, res4) => {
              if (err4) return res.status(500).json({ error: 'Error al calcular cobrado' });
              db.query(queryCompras, [idmovimiento], (err5, res5) => {
                if (err5) return res.status(500).json({ error: 'Error al calcular compras' });
                db.query(queryGastos, [idmovimiento], (err6, res6) => {
                  if (err6) return res.status(500).json({ error: 'Error al calcular gastos' });
                  db.query(queryCredito, [idmovimiento], (err7, res7) => {
                    if (err7) return res.status(500).json({ error: 'Error al calcular ventas a crédito' });

                    const ingresos = parseFloat(res1[0].total || 0);
                    const egresos = parseFloat(res2[0].total || 0);
                    const contado = parseFloat(res3[0].total || 0);
                    const cobrado = parseFloat(res4[0].total || 0);
                    const compras = parseFloat(res5[0].total || 0);
                    const gastos = parseFloat(res6[0].total || 0);
                    const credito = parseFloat(res7[0].total || 0);

                    const monto_cierre = monto_apertura + (ingresos - egresos);

                    res.json({
                      ingresos,
                      egresos,
                      contado,
                      cobrado,
                      compras,
                      gastos,
                      credito,
                      monto_cierre,
                      monto_apertura,
                      estado: estadoResult[0].estado
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};