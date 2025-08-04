import db from '../../db.js'; // Ajusta según tu estructura
import { createVenta } from './CrearVenta.js'; // Importa tu controlador
import { sendVentaProgramadaEmail } from "../Ventas/helpers/email.js";
import { getClienteData } from "./helpers/clienteRepo.js";
import { obtenerPrecioVenta, obtenerPrecioCompra, obtenerNombreProducto, obtenerUnidadMedida, obtenerIVA } from '../Ventas/helpers/productHelpers.js'; // Crea estos helpers si no los tenés

const procesarVentasProgramadas = async () => {

  const fechaLocalISO = (tz = "America/Asuncion") => {
  const f = new Intl.DateTimeFormat("sv-SE", { // sv-SE => yyyy-mm-dd
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return f; // "2025-07-27"
};

  const today = new Date();
  const todayDay = today.getDate();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  try {
    const [ventas] = await db.promise().query(`
      SELECT *
      FROM ventas_programadas
      WHERE estado = 'activa'
    `);

    for (const vp of ventas) {
      const lastDayOfMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
      const diaProgramadoAjustado = Math.min(vp.dia_programado, lastDayOfMonth);
      const ultimaVenta = vp.ultima_fecha_venta ? new Date(vp.ultima_fecha_venta) : null;
      const yaGeneradaEsteMes =
        ultimaVenta &&
        ultimaVenta.getMonth() === thisMonth &&
        ultimaVenta.getFullYear() === thisYear;

      if (todayDay >= diaProgramadoAjustado && !yaGeneradaEsteMes) {

        const precioVenta = parseFloat(await obtenerPrecioVenta(vp.idproducto));
        const total = parseFloat(vp.cantidad) * precioVenta;
        const cli = await getClienteData(vp.idcliente);

        const clienteInfo = {
          id: vp.idcliente,
          nombre: cli ? `${cli.nombre} ${cli.apellido}` : "(desconocido)",
          documento: cli?.numDocumento ?? "-",
        };

        const detalles = [
          {
            idproducto: vp.idproducto,
            cantidad: vp.cantidad,
            precio_venta: await obtenerPrecioVenta(vp.idproducto),
            precio_compra: await obtenerPrecioCompra(vp.idproducto),
            nombre_producto: await obtenerNombreProducto(vp.idproducto),
            unidad_medida: await obtenerUnidadMedida(vp.idproducto),
            iva: await obtenerIVA(vp.idproducto),
          },
        ];

        const ventaPayload = {
          venta: {
            idcliente: vp.idcliente,
            fecha: fechaLocalISO(),
            tipo: "credito",
            tipo_comprobante: "T",
            nro_factura: "",
            estado: "pendiente",
            descuento: 0,
            observacion: vp.observacion || "",
            idformapago: null,
            total,
          },
          detalles,
          sistema_venta_por_lote: false,
        };

        let ventaResp = null;
        const fakeReq = {
          body: ventaPayload,
          user: { idusuario: vp.idusuario || 1 },
        };
        const fakeRes = {
          status: (code) => ({
            json: (data) => {
              ventaResp = data;
            },
          }),
        };

        await createVenta(fakeReq, fakeRes);

        await db
          .promise()
          .query(
            `UPDATE ventas_programadas
             SET ultima_fecha_venta = CURDATE()
             WHERE idprogramacion = ?`,
            [vp.idprogramacion]
          );

        // ⚡ Enviar email
        try {
          await sendVentaProgramadaEmail({
            idprogramacion: vp.idprogramacion,
            ventaId: ventaResp?.idventa ?? "(desconocido)",
            total,
            cliente: clienteInfo,
            fecha: ventaPayload.venta.fecha,
            detalles,
          });
        } catch (e) {
          console.error("❌ Error enviando email:", e);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error al procesar ventas programadas:", error);
  }
};

export default procesarVentasProgramadas;
