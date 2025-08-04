// controllers/ventasProgramadasController.js
import VentasProgramadas from '../../models/Venta/ventasProgramadasModel.js';
import { generarReporteVentasProgramadas } from '../../report/reportSoldProgram.js';
import Facturador from '../../models/facturadorModel.js';

export const createVentaProgramada = (req, res) => {
  const {
    idcliente,
    idproducto,
    cantidad,
    fecha_inicio,
    dia_programado,
    estado,
    observacion
  } = req.body;

  if (!idcliente || !idproducto || !cantidad || !fecha_inicio || !dia_programado) {
    return res.status(400).json({ error: '❌ Campos obligatorios faltantes.' });
  }

  const nuevaVentaProgramada = {
    idcliente,
    idproducto,
    cantidad,
    fecha_inicio,
    dia_programado,
    estado: estado || 'activa',
    observacion
  };

  VentasProgramadas.create(nuevaVentaProgramada, (err, result) => {
    if (err) {
      console.error('❌ Error al crear venta programada:', err);
      return res.status(500).json({ error: '❌ Error al crear venta programada.' });
    }
    res.status(201).json({ message: '✅ Venta programada creada exitosamente.', idprogramacion: result.insertId });
  });
};

// ✅ Listar ventas programadas con paginación y búsqueda
export const getVentasProgramadasPaginated = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  VentasProgramadas.countFiltered(search, (err, total) => {
    if (err) {
      console.error('❌ Error al contar ventas programadas:', err);
      return res.status(500).json({ error: '❌ Error al contar ventas programadas.' });
    }

    VentasProgramadas.findAllPaginatedFiltered(limit, offset, search, (err, rows) => {
      if (err) {
        console.error('❌ Error al obtener ventas programadas:', err);
        return res.status(500).json({ error: '❌ Error al obtener ventas programadas.' });
      }

      const totalPages = Math.ceil(total / limit);
      res.json({
        data: rows,
        totalItems: total,
        totalPages,
        currentPage: page,
      });
    });
  });
};

export const getVentasProgramadasPorCliente = (req, res) => {
  const { idcliente } = req.params;

  if (!idcliente) {
    return res.status(400).json({ error: 'Falta el ID del cliente' });
  }

  VentasProgramadas.getByCliente(idcliente, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener ventas programadas del cliente:', err);
      return res.status(500).json({ error: 'Error interno al obtener ventas programadas' });
    }

    if (!results.length) {
      return res.status(404).json({ error: '⚠️ No se encontraron ventas programadas para este cliente' });
    }

    Facturador.findActivo((errFact, factResult) => {
      if (errFact || !factResult.length) {
        return res.status(400).json({ error: '⚠️ No se encontró facturador activo' });
      }

      const facturador = factResult[0];

      let total_subtotal = 0;
      let total_subtotaliva5 = 0;
      let total_subtotaliva10 = 0;

      results.forEach((venta) => {
        total_subtotal += parseFloat(venta.subtotal || 0);
        total_subtotaliva5 += parseFloat(venta.subtotal_iva5 || 0);
        total_subtotaliva10 += parseFloat(venta.subtotal_iva10 || 0);
      });

      const total_iva = total_subtotaliva5 + total_subtotaliva10;

      const clienteNombre = results[0]?.cliente_nombre || '';
      const clienteApellido = results[0]?.cliente_apellido || '';
      const nro_documento = results[0]?.numDocumento || 'SIN-DATO';

      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const fecha_emision = formatDate(new Date());

      const detallesFormateados = results.map((detalle) => ({
        ...detalle,
        
        fecha_inicio: formatDate(detalle.fecha_inicio),
        ultima_fecha_venta: formatDate(detalle.ultima_fecha_venta),
      }));

      const datosReporte = {
        empresa: {
          nombre_fantasia: facturador.nombre_fantasia,
          ruc: facturador.ruc,
          timbrado_nro: facturador.timbrado_nro,
          fecha_inicio_vigente: formatDate(facturador.fecha_inicio_vigente),
          fecha_fin_vigente: formatDate(facturador.fecha_fin_vigente),
          fecha_emision
        },
        venta_programada: {
          cliente: `${clienteNombre} ${clienteApellido}`.trim(),
          nro_documento,
          total_subtotal: Number(total_subtotal.toFixed(2)),
          total_subtotaliva5: Number(total_subtotaliva5.toFixed(2)),
          total_subtotaliva10: Number(total_subtotaliva10.toFixed(2)),
          total_iva: Number(total_iva.toFixed(2)),
          detalles: detallesFormateados
        }
      };

      console.log('Datos del reporte:', datosReporte);

      generarReporteVentasProgramadas(datosReporte)
        .then((reportePDFBase64) => {
          res.status(200).json({
            message: '✅ Reporte generado correctamente',
            reportePDFBase64,
            datosReporte
          });
        })
        .catch((error) => {
          console.error('❌ Error al generar el reporte:', error);
          res.status(500).json({ error: '❌ Error al generar el reporte PDF' });
        });
    });
  });
};

export const anularVentaProgramada = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID de la venta programada' });
  }

  VentasProgramadas.softDelete(id, (err, result) => {
    if (err) {
      console.error('❌ Error al anular la venta programada:', err);
      return res.status(500).json({ error: 'Error interno al anular la venta programada' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Venta programada no encontrada' });
    }

    res.json({ message: '✅ Venta programada anulada correctamente' });
  });
};

