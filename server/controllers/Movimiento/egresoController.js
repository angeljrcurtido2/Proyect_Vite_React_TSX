import Egreso from '../../models/Movimiento/Egreso.js';
import MovimientoCaja from '../../models/MovimientoCaja.js';
import Facturador from '../../models/facturadorModel.js';
import { generarReporteEgresos, generarReporteIngresos } from '../../report/reportIngreso.js';

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const registrarEgreso = (req, res) => {
  const { fecha, hora, monto, concepto, idtipo_egreso, observacion, creado_por } = req.body;

  const idusuario = req.user?.idusuario;
  if (!idusuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (!monto || !idtipo_egreso || !fecha) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  MovimientoCaja.getMovimientoAbierto((errMov, movimientoResult) => {
    if (errMov) return res.status(500).json({ error: '❌ Error al buscar movimiento de caja' });
    if (!movimientoResult.length) return res.status(400).json({ error: '⚠️ No hay movimiento abierto' });

    const idmovimiento = movimientoResult[0].idmovimiento;

    const egresoData = {
      fecha,
      hora,
      monto,
      concepto,
      idtipo_egreso,
      observacion,
      idmovimiento,
      creado_por: idusuario
    };

    Egreso.create(egresoData, (err, result) => {
      if (err) return res.status(500).json({ error: '❌ Error al registrar egreso', err });
      res.status(200).json({ message: '✅ Egreso registrado correctamente' });
    });
  });
};

// Obtener todos los egresos
export const listarEgresos = (req, res) => {
  Egreso.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener egresos' });
    res.json(results);
  });
};

export const listarEgresosPorMovimiento = (req, res) => {
  const { idmovimiento } = req.params;
  if (!idmovimiento) return res.status(400).json({ error: "Falta idmovimiento" });

  MovimientoCaja.getById(idmovimiento, (errMov, mov) => {
    if (errMov) return res.status(500).json({ error: errMov });
    if (!mov) return res.status(404).json({ error: "Movimiento no encontrado" });
    Egreso.findByMovimiento(idmovimiento, (errIng, egresos) => {
      if (errIng) return res.status(500).json({ error: errIng });

      const totalMovimiento = egresos.reduce(
        (acc, r) => acc + parseFloat(r.monto), 0
      ).toFixed(2);

      Facturador.findActivo((errFact, factRows) => {
        if (errFact) return res.status(500).json({ error: 'Error obteniendo empresa' });

        const fact = factRows?.[0] || {};

        const empresa = factRows?.length ? {
          nombre_fantasia: fact.nombre_fantasia,
          ruc: fact.ruc,
          timbrado_nro: fact.timbrado_nro,
          fecha_inicio_vigente: formatDate(fact.fecha_inicio_vigente),
          fecha_fin_vigente: formatDate(fact.fecha_fin_vigente)
        } : null;

        const datosComprobante = {
          empresa,
          movimiento: {
            idmovimiento: mov.idmovimiento,
            num_caja: mov.num_caja,
            fecha_apertura: formatDate(mov.fecha_apertura),
            fecha_cierre: formatDate(mov.fecha_cierre),
            estado: mov.estado
          },
          totalMovimiento,
          egresos
        };

        generarReporteEgresos(datosComprobante)
          .then((comprobanteBase64) => {
            res.status(200).json({
              message: '✅ Pago de deuda registrado correctamente.',
              comprobanteBase64,
              ...datosComprobante
            });
          })
          .catch((error) => {
            console.error('❌ Error al generar el comprobante de pago:', error);
            res.status(500).json({
              error: '❌ Pago realizado, pero ocurrió un error al generar el comprobante.'
            });
          });

      });
    });
  });
};

// Obtener egresos con paginación y búsqueda
export const listarEgresosPag = (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  const filtros = {
    fechaDesde: req.query.fechaDesde,   // opcional
    fechaHasta: req.query.fechaHasta,   // opcional
  };

  Egreso.countFiltered(search, filtros, (errCnt, total) => {
    if (errCnt) return res.status(500).json({ error: errCnt });

    Egreso.findAllPaginatedFiltered(limit, offset, search, filtros, (err, data) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        data,
        totalItems : total,
        totalPages : Math.ceil(total / limit),
        currentPage: page
      });
    });
  });
};

// Anular egreso si no está relacionado a compra o deuda
export const anularEgreso = (req, res) => {
  const { id } = req.params;

  Egreso.checkIfEgresoRelacionado(id, (errCheck, relacionado) => {
    if (errCheck) {
      console.error('❌ Error en checkIfEgresoRelacionado:', errCheck);
      return res.status(500).json({ error: 'Error al verificar egreso' });
    }

    if (relacionado === null) {
      return res.status(404).json({ error: 'Egreso no encontrado' });
    }

    if (relacionado) {
      return res.status(400).json({ error: 'No se puede anular: Egreso relacionado a una compra o pago de crédito' });
    }

    // Si no está relacionado, se puede anular (soft delete)
    Egreso.softDelete(id, (errDelete) => {
      if (errDelete) return res.status(500).json({ error: 'Error al anular Egreso' });
      res.json({ message: '✅ Egreso anulado correctamente' });
    });
  });
};