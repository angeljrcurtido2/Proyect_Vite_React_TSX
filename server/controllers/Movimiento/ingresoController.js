import Ingreso from "../../models/Movimiento/Ingreso.js";
import Egreso from "../../models/Movimiento/Egreso.js";
import MovimientoCaja from '../../models/MovimientoCaja.js';
import Facturador from '../../models/facturadorModel.js';
import { format } from "date-fns-tz";
import { generarReporteIngresos, generarReporteResumen } from "../../report/reportIngreso.js";

const TZ = "America/Asuncion";
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const registrarIngreso = (req, res) => {
  const { fecha, hora, monto, concepto, idtipo_ingreso, observacion, creado_por } = req.body;

  const idusuario = req.user?.idusuario;
  if (!idusuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (!monto || !idtipo_ingreso || !fecha) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  MovimientoCaja.getMovimientoAbierto((errMov, movimientoResult) => {
    if (errMov) return res.status(500).json({ error: '❌ Error al buscar movimiento de caja' });
    if (!movimientoResult.length) return res.status(400).json({ error: '⚠️ No hay movimiento abierto' });

    const idmovimiento = movimientoResult[0].idmovimiento;

    const ingresoData = {
      fecha,
      hora,
      monto,
      concepto,
      idtipo_ingreso,
      observacion,
      idmovimiento,
      creado_por: idusuario
    };

    Ingreso.create(ingresoData, (err, result) => {
      if (err) return res.status(500).json({ error: '❌ Error al registrar ingreso', err });
      res.status(200).json({ message: '✅ Ingreso registrado correctamente' });
    });
  });
};


export const listarIngresos = (req, res) => {
  Ingreso.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener ingresos' });
    res.json(results);
  });
};

export const listarIngresosPorMovimiento = (req, res) => {
  const { idmovimiento } = req.params;
  if (!idmovimiento) return res.status(400).json({ error: "Falta idmovimiento" });

  MovimientoCaja.getById(idmovimiento, (errMov, mov) => {
    if (errMov) return res.status(500).json({ error: errMov });
    if (!mov) return res.status(404).json({ error: "Movimiento no encontrado" });
    Ingreso.findByMovimiento(idmovimiento, (errIng, ingresos) => {
      if (errIng) return res.status(500).json({ error: errIng });

      const totalMovimiento = ingresos.reduce(
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
          ingresos
        };

        generarReporteIngresos(datosComprobante)
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

export const listarIngresoyEgresoPorMovimiento = (req, res) => {
  const { idmovimiento } = req.params;
  if (!idmovimiento) return res.status(400).json({ error: "Falta idmovimiento" });

  MovimientoCaja.getById(idmovimiento, (errMov, mov) => {
    if (errMov) return res.status(500).json({ error: errMov });
    if (!mov) return res.status(404).json({ error: "Movimiento no encontrado" });

    // 1️⃣  Traer ingresos
    Ingreso.findByMovimiento(idmovimiento, (errIng, ingresos) => {
      if (errIng) return res.status(500).json({ error: errIng });

      // 2️⃣  Traer egresos (nuevo)
      Egreso.findByMovimiento(idmovimiento, (errEgr, egresos) => {
        if (errEgr) return res.status(500).json({ error: errEgr });

        // 3️⃣  Calcular totales
        const totalIngresos = ingresos.reduce((a, r) => a + parseFloat(r.monto), 0);
        const totalEgresos = egresos.reduce((a, r) => a + parseFloat(r.monto), 0);
        const totalMovimiento = (totalIngresos - totalEgresos).toFixed(2);

        // 4️⃣  Empresa (igual que antes)
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

          // 5️⃣  Objeto que se pasa al generador de PDF
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
            totalIngresos,
            totalEgresos,
            ingresos,
            egresos          // 👈  nuevo array
          };

          generarReporteResumen(datosComprobante)
            .then(comprobanteBase64 => {
              res.status(200).json({
                message: '✅ Resumen de movimiento generado correctamente.',
                comprobanteBase64,
                ...datosComprobante
              });
            })
            .catch(error => {
              console.error('❌ Error al generar el comprobante:', error);
              res.status(500).json({
                error: '❌ Se registró el movimiento, pero falló la generación del comprobante.'
              });
            });
        });
      });
    });
  });
};

export const listarCobrosMensuales = (req, res) => {
  // Si no vienen params, tomamos mes/año actuales (zona Asunción)
  const now = new Date();                 // JS usa TZ del host (← tu servidor)
  const anio = parseInt(req.query.anio) || now.getFullYear();
  const mes = parseInt(req.query.mes) || (now.getMonth() + 1);

  Ingreso.findCobrosMensuales(anio, mes, (err, datos) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      anio,
      mes,
      totalMensual: datos.totalMensual,
      detalle: datos.detalle
    });
  });
};

export const listarCobrosDelDia = (req, res) => {
  const hoyLocal = format(new Date(), "yyyy-MM-dd", { timeZone: TZ });
  const fecha = req.query.fecha || hoyLocal;

  Ingreso.findCobrosDelDia(fecha, (err, data) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      fecha,
      totalDia: data.totalDia,
      detalle: data.detalle,
    });
  });
};

export const listarCobrosMensualesPorAnio = (req, res) => {
  const anio = parseInt(req.query.anio) || new Date().getFullYear();
  Ingreso.findCobrosMensualesPorAnio(anio, (err, meses) => {
    if (err) return res.status(500).json({ error: err });

    const totalAnual = meses.reduce((sum, m) => sum + Number(m.total_cobrado), 0);

    res.json({
      anio,
      totalAnual,
      meses
    });
  });
};

export const listarIngresosPag = (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  const filtros = {
    fechaDesde: req.query.fechaDesde,   // YYYY-MM-DD
    fechaHasta: req.query.fechaHasta,   // YYYY-MM-DD
  };

  Ingreso.countFiltered(search, filtros, (errCount, total) => {
    if (errCount) return res.status(500).json({ error: errCount });

    Ingreso.findAllPaginatedFiltered(limit, offset, search, filtros, (err, data) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        data,
        totalItems : total,
        totalPages : Math.ceil(total / limit),
        currentPage: page,
      });
    });
  });
};

export const anularIngreso = (req, res) => {
  const { id } = req.params;

  Ingreso.checkIfIngresoRelacionado(id, (errCheck, relacionado) => {
    if (errCheck) return res.status(500).json({ error: 'Error al verificar ingreso' });

    if (relacionado === null) {
      return res.status(404).json({ error: 'Ingreso no encontrado' });
    }

    if (relacionado) {
      return res.status(400).json({ error: 'No se puede anular: ingreso relacionado a una venta o cobro de crédito' });
    }

    // Si no está relacionado, se puede anular (soft delete)
    Ingreso.softDelete(id, (errDelete) => {
      if (errDelete) return res.status(500).json({ error: 'Error al anular ingreso' });
      res.json({ message: '✅ Ingreso anulado correctamente' });
    });
  });
};

