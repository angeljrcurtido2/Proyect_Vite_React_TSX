import db from '../../db.js';
import LibroDiario from '../../models/Movimiento/libroDiario.js';

const generarAsientosPorMovimiento = (req, res) => {
    const { idmovimiento } = req.params;

    const getIngresosQuery = `
    SELECT 
      i.*, 
      v.idcliente, 
      v.idformapago, 
      v.iddato_transferencia_venta, 
      v.iddetalle_cheque_venta
    FROM ingresos i
    LEFT JOIN ventas v ON i.idventa = v.idventa
    WHERE i.deleted_at IS NULL 
      AND i.idmovimiento = ?
      AND (i.exportado_diario IS NULL OR i.exportado_diario = 0)
  `;

    db.query(getIngresosQuery, [idmovimiento], (err, ingresos) => {
        if (err) {
            console.error('Error al obtener ingresos:', err);
            return res.status(500).json({ message: 'Error al obtener ingresos', error: err });
        }

        if (!ingresos.length) {
            return res.status(404).json({ message: 'No hay ingresos para este movimiento.' });
        }

        let processed = 0;
        ingresos.forEach((i) => {
            const concepto =
                i.idtipo_ingreso === 1 && i.idventa
                    ? `Cobro de venta ${i.idventa}`
                    : i.idtipo_ingreso === 2
                        ? `Cobro de deuda`
                        : `Ingreso: ${i.concepto}`;

            let cuentaDebe = 'Caja';
            if (i.idtipo_ingreso === 1) {
                if (i.iddato_transferencia_venta || i.iddetalle_cheque_venta) {
                    cuentaDebe = 'Banco';
                }
            } else if (i.idtipo_ingreso === 2) {
                if (
                    i.iddetalle_transferencia_cobro ||
                    i.iddetalle_cheque_venta_cobro ||
                    i.iddetalle_tarjeta_venta_cobro
                ) {
                    cuentaDebe = 'Banco';
                }
            } else if (i.idtipo_ingreso >= 3) {
                cuentaDebe = 'Caja';
            }

            const cuentaHaber =
                i.idtipo_ingreso === 1
                    ? 'Ventas'
                    : i.idtipo_ingreso === 2
                        ? 'Cuentas por Cobrar'
                        : 'Otros Ingresos';

            // Insertar asiento en libro_diario
            LibroDiario.insert(
                {
                    fecha: i.fecha,
                    hora: i.hora,
                    concepto,
                    cuenta_debe: cuentaDebe,
                    cuenta_haber: cuentaHaber,
                    monto: i.monto,
                    idingreso: i.idingreso,
                    idventa: i.idventa,
                    idcliente: i.idcliente,
                    idformapago: i.idformapago,
                    idmovimiento: i.idmovimiento,
                    creado_por: i.creado_por
                },
                (insertErr) => {
                    if (insertErr) {
                        console.error('Error al insertar en Libro Diario:', insertErr);
                        return res.status(500).json({
                            message: 'Error al insertar asiento en Libro Diario',
                            error: insertErr
                        });
                    }

                    // Marcar ingreso como exportado
                    const updateQuery = `
                        UPDATE ingresos
                        SET exportado_diario = 1
                        WHERE idingreso = ?
                    `;
                    db.query(updateQuery, [i.idingreso], (updateErr) => {
                        if (updateErr) {
                            console.error('Error al actualizar exportado_diario:', updateErr);
                            return res.status(500).json({
                                message: 'Error al actualizar exportado_diario',
                                error: updateErr
                            });
                        }

                        processed++;
                        if (processed === ingresos.length) {
                            return res.status(200).json({
                                message: 'Asientos generados correctamente.',
                                totalAsientos: processed
                            });
                        }
                    });
                }
            );
        });
    });
};

const getLibroDiarioPorMovimiento = (req, res) => {
    const { idmovimiento } = req.params;
    LibroDiario.getByMovimiento(idmovimiento, (err, results) => {
        if (err) {
            console.error('Error al obtener asientos:', err);
            return res.status(500).json({ message: 'Error al obtener asientos', error: err });
        }
        res.status(200).json(results);
    });
};

export default {
    generarAsientosPorMovimiento,
    getLibroDiarioPorMovimiento
};
