// utils/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "angeljrcurtido@gmail.com",
        pass: "jzns krhz imjw egnn",
    },
});

export async function sendVentaProgramadaEmail({
    idprogramacion,
    ventaId,
    total,
    cliente,
    fecha,
    detalles,
}) {
    const to = process.env.NOTIFY_TO;
    const subject = `Venta programada generada (#${ventaId})`;

    const filas = detalles.map(d => `
    <tr>
      <td>${d.nombre_producto}</td>
      <td style="text-align:center">${Number(d.cantidad).toFixed(2)}</td>
      <td style="text-align:right">${Number(d.precio_venta).toLocaleString("es-PY")}</td>
    </tr>`).join("");

    const html = `
    <div style="font-family:Arial, sans-serif; font-size:14px; color:#333;">
        <h2 style="margin:0 0 12px 0;">Venta programada generada</h2>

        <p><b>ID Programación:</b> ${idprogramacion}</p>

        <p>
        <b>Cliente:</b> ${cliente?.nombre} |
        <b>Doc:</b> ${cliente?.documento} |
        <b>ID:</b> ${cliente?.id}
        </p>

        <p><b>Fecha:</b> ${fecha}</p>
        <p><b>Total:</b> ${Number(total).toLocaleString("es-PY")}</p>

        <h3 style="margin:16px 0 8px 0;">Detalles</h3>
        <table width="100%" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <thead>
            <tr style="background:#f5f5f5;">
            <th align="left">Producto</th>
            <th>Cant.</th>
            <th align="right">Precio</th>
            </tr>
        </thead>
        <tbody>${filas}</tbody>
        </table>
    </div>`;

    let mailOptions = {
        from: "angeljrcurtido@gmail.com",
        to: to,
        subject: subject,
        html,
        text: html.replace(/<[^>]+>/g, "")
    };

    // Send the email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }

}
