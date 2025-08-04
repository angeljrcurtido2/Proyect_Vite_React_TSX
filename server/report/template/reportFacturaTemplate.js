export const facturaTemplateHTML = `<style>
    body {
        font-family: monospace;
        font-size: 9px;
        width: 58mm;
        margin: 0 auto;
        padding: 2px;
    }

    .header,
    .footer {
        text-align: center;
    }

    .logo {
        width: 40px;
        margin-bottom: 3px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 4px;
    }

    th,
    td {
        padding: 1px 2px;
        text-align: left;
        font-size: 8.5px;
        word-wrap: break-word;
    }

    th {
        font-weight: bold;
        border-bottom: 1px dotted #000;
    }

    td {
        border-bottom: 1px dotted #ccc;
    }

    .totales td {
        font-weight: bold;
        padding: 2px 2px;
    }

    .totales {
        margin-top: 4px;
    }

    p {
        margin: 1px 0;
    }
</style>

<div class="header">
    <h2>{{nombre_fantasia}}</h2>
    <p>
        <strong>RUC:</strong> {{ruc}}</p>
    <p>
        <strong>Timbrado:</strong> {{timbrado_nro}}</p>
    <p>
        <strong>Inicio Vigencia:</strong> {{fecha_inicio_vigente}}
        <p>
            <strong>Fin Vigencia:</strong> {{fecha_fin_vigente}}</p>
</div>

<div class="info">
    <p>
        <strong>Factura N°:</strong> {{nro_factura}}</p>
    <p>
        <p>
            <strong>N° Comprobante:</strong> {{nro_ticket}}</p>
        <p>
            <strong>Fecha:</strong> {{fecha}}</p>
        <p>
            <strong>Cliente:</strong> {{cliente}}</p>
        <p>
            <strong>N° Documento:</strong> {{nro_documento}}</p>
</div>

<table>
    <thead>
        <tr>
            <th>Prod.</th>
            <th>Cant.</th>
            <th>P.Unit</th>
            <th>Sub T.</th>
            <th>IVA 5%</th>
            <th>IVA 10%</th>
        </tr>
    </thead>
    <tbody>
        {{#each detalles}}
        <tr>
            <td>{{nombre_producto}}</td>
            <td>{{cantidad}}</td>
            <td>{{formatPY precio_venta}}</td>
            <td>{{formatPY sub_total}}</td>
            <td>{{iva5}}</td>
            <td>{{iva10}}</td>
        </tr>
        {{/each}}
    </tbody>
</table>

<table class="totales">
    <thead>
        <tr>
            <th style="text-align: right;">Exento</th>
            <th style="text-align: right;">IVA 5%</th>
            <th style="text-align: right;">IVA 10%</th>
            <th style="text-align: right;">Total IVA</th>
            <th style="text-align: right;">Total General</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: right;">{{subtotal_exento}}</td>
            <td style="text-align: right;">{{subtotal_iva5}}</td>
            <td style="text-align: right;">{{subtotal_iva10}}</td>
            <td style="text-align: right;">{{formatPY total_iva}}</td>
            <td style="text-align: right;">{{formatPY total}}</td>
        </tr>
    </tbody>
</table>

<p style="margin-top: 10px;">
    <strong>Total en letras:</strong> {{totalletras}}</p>
<p style="margin-top: 10px; text-align: center;">
    <strong>Gracias por su preferencia!!!</strong>
</p>`;

export const facturaTemplateHTML2 = `<style>
  @media print {
    @page {
      size: A4 portrait;
      margin: 20mm;
    }

    body {
      margin: 0;
      padding: 0;
    }
  }

  body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
  }

  .header, .footer {
    text-align: center;
  }

  .logo {
    width: 80px;
    margin-bottom: 8px;
  }

  h2 {
    margin: 5px 0;
    font-size: 18px;
  }

  .info p {
    margin: 2px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ccc;
    font-size: 12px;
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
  }

  .totales th, .totales td {
    text-align: right;
  }

  .totales {
    margin-top: 20px;
  }

  .footer {
    margin-top: 30px;
    font-style: italic;
  }
</style>

<div class="header">
  <h2>{{nombre_fantasia}}</h2>
  <p><strong>RUC:</strong> {{ruc}}</p>
  <p><strong>Timbrado:</strong> {{timbrado_nro}}</p>
  <p><strong>Inicio Vigencia:</strong> {{fecha_inicio_vigente}}</p>
  <p><strong>Fin Vigencia:</strong> {{fecha_fin_vigente}}</p>
</div>

<hr />

<div class="info">
  <p><strong>Factura N°:</strong> {{nro_factura}}</p>
  <p><strong>N° Comprobante:</strong> {{nro_ticket}}</p>
  <p><strong>Fecha:</strong> {{fecha}}</p>
  <p><strong>Cliente:</strong> {{cliente}}</p>
  <p><strong>N° Documento:</strong> {{nro_documento}}</p>
</div>

<table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio Unitario</th>
      <th>Subtotal</th>
      <th>IVA 5%</th>
      <th>IVA 10%</th>
    </tr>
  </thead>
  <tbody>
    {{#each detalles}}
    <tr>
      <td>{{nombre_producto}}</td>
      <td>{{cantidad}}</td>
      <td>{{formatPY precio_venta}} Gs.</td>
      <td>{{formatPY sub_total}} Gs.</td>
      <td>{{formatPY iva5}} Gs.</td>
      <td>{{formatPY iva10}} Gs.</td>
    </tr>
    {{/each}}
  </tbody>
</table>

<table class="totales">
  <thead>
    <tr>
      <th>Exento</th>
      <th>IVA 5%</th>
      <th>IVA 10%</th>
      <th>Total IVA</th>
      <th>Total General</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{subtotal_exento}}</td>
      <td>{{formatPY subtotal_iva5}} Gs.</td>
      <td>{{formatPY subtotal_iva10}} Gs.</td>
      <td>{{formatPY total_iva}} Gs.</td>
      <td>{{formatPY total}} Gs.</td>
    </tr>
  </tbody>
</table>

<p style="margin-top: 20px;"><strong>Total en letras:</strong> {{totalletras}}</p>

<div class="footer">
  <p>Gracias por su preferencia.</p>
</div>
`;

export const facturaTemplateHTML3 = `<style>
  @media print {
    @page {
      size: A4 portrait;
      margin: 20mm;
    }

    body {
      margin: 0;
      padding: 0;
    }
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
    background-color: #fffef9;
  }

  .header, .footer {
    text-align: center;
  }

  .logo {
    width: 80px;
    margin-bottom: 8px;
  }

  h2 {
    margin: 5px 0;
    font-size: 20px;
    color: #e07a1e;
  }

  .info p, .header p {
    margin: 3px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    border-radius: 6px;
    overflow: hidden;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border: 1px solid #e0e0e0;
    font-size: 12px;
  }

  th {
    background-color: #f9c97b;
    color: #333;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #fff9f2;
  }

  .totales th, .totales td {
    text-align: right;
  }

  .totales {
    margin-top: 25px;
  }

  .footer {
    margin-top: 35px;
    font-style: italic;
    color: #666;
  }

  hr {
    border: none;
    border-top: 2px solid #f9c97b;
    margin: 20px 0;
  }

  p strong {
    color: #e07a1e;
  }
</style>

<div class="header">
  <h2>{{nombre_fantasia}}</h2>
  <p><strong>RUC:</strong> {{ruc}}</p>
  <p><strong>Timbrado:</strong> {{timbrado_nro}}</p>
  <p><strong>Inicio Vigencia:</strong> {{fecha_inicio_vigente}}</p>
  <p><strong>Fin Vigencia:</strong> {{fecha_fin_vigente}}</p>
</div>

<hr />

<div class="info">
  <p><strong>Factura N°:</strong> {{nro_factura}}</p>
  <p><strong>N° Comprobante:</strong> {{nro_ticket}}</p>
  <p><strong>Fecha:</strong> {{fecha}}</p>
  <p><strong>Cliente:</strong> {{cliente}}</p>
  <p><strong>N° Documento:</strong> {{nro_documento}}</p>
</div>

<table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio Unitario</th>
      <th>Subtotal</th>
      <th>IVA 5%</th>
      <th>IVA 10%</th>
    </tr>
  </thead>
  <tbody>
    {{#each detalles}}
    <tr>
      <td>{{nombre_producto}}</td>
      <td>{{cantidad}}</td>
      <td>{{formatPY precio_venta}} Gs.</td>
      <td>{{formatPY sub_total}} Gs.</td>
      <td>{{formatPY iva5}} Gs.</td>
      <td>{{formatPY iva10}} Gs.</td>
    </tr>
    {{/each}}
  </tbody>
</table>

<table class="totales">
  <thead>
    <tr>
      <th>Exento</th>
      <th>IVA 5%</th>
      <th>IVA 10%</th>
      <th>Total IVA</th>
      <th>Total General</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{subtotal_exento}}</td>
      <td>{{formatPY subtotal_iva5}} Gs.</td>
      <td>{{formatPY subtotal_iva10}} Gs.</td>
      <td>{{formatPY total_iva}} Gs.</td>
      <td>{{formatPY total}} Gs.</td>
    </tr>
  </tbody>
</table>

<p style="margin-top: 20px;"><strong>Total en letras:</strong> {{totalletras}}</p>

<div class="footer">
  <p>Gracias por su preferencia.</p>
</div>
`

export const facturaTemplateHTML4 = `<style>
  @media print {
    @page {
      size: A4 portrait;
      margin: 20mm;
    }
    body {
      margin: 0;
      padding: 0;
    }
  }

  body {
    font-family: 'Arial', sans-serif;
    font-size: 12px;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    color: #2c3e50;
  }

  .header, .footer {
    text-align: center;
  }

  .logo {
    width: 90px;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 22px;
    margin: 0;
    color: #c0392b;
    text-transform: uppercase;
  }

  .header-info p {
    margin: 2px 0;
    font-size: 12px;
  }

  hr {
    border: none;
    border-top: 3px double #c0392b;
    margin: 20px 0;
  }

  .info p {
    margin: 4px 0;
    font-size: 12px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  th, td {
    padding: 10px 8px;
    text-align: left;
    border: 1px solid #ccc;
  }

  th {
    background-color: #f2f2f2;
    color: #c0392b;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
  }

  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  .totales {
    margin-top: 20px;
  }

  .totales th,
  .totales td {
    text-align: right;
    background-color: #fdfdfd;
    border-top: 2px solid #c0392b;
  }

  .total-letras {
    margin-top: 20px;
    font-weight: bold;
    font-size: 13px;
    color: #000;
  }

  .footer {
    margin-top: 35px;
    font-style: italic;
    font-size: 12px;
    color: #7f8c8d;
  }

  strong {
    color: #c0392b;
  }

  .info-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin: 6px 0;
  font-size: 12px;
}

.info-row div {
  flex: 1;
}
</style>

<div class="header">
  <h2>{{nombre_fantasia}}</h2>
  <div class="header-info">
    <p><strong>RUC:</strong> {{ruc}}</p>
    <p><strong>Timbrado:</strong> {{timbrado_nro}}</p>
    <p><strong>Inicio Vigencia:</strong> {{fecha_inicio_vigente}}</p>
    <p><strong>Fin Vigencia:</strong> {{fecha_fin_vigente}}</p>
  </div>
</div>

<hr />

<div class="info-row">
  <div><strong>Factura N°:</strong> {{nro_factura}}</div>
  <div><strong>Comprobante:</strong> {{nro_ticket}}</div>
  <div><strong>Fecha:</strong> {{fecha}}</div>
</div>
<div class="info-row">
  <div><strong>Cliente:</strong> {{cliente}}</div>
  <div><strong>Documento:</strong> {{nro_documento}}</div>
</div>

<table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio Unitario</th>
      <th>Subtotal</th>
      <th>IVA 5%</th>
      <th>IVA 10%</th>
    </tr>
  </thead>
  <tbody>
    {{#each detalles}}
    <tr>
      <td>{{nombre_producto}}</td>
      <td>{{cantidad}}</td>
      <td>{{formatPY precio_venta}} Gs.</td>
      <td>{{formatPY sub_total}} Gs.</td>
      <td>{{formatPY iva5}} Gs.</td>
      <td>{{formatPY iva10}} Gs.</td>
    </tr>
    {{/each}}
  </tbody>
</table>

<table class="totales">
  <thead>
    <tr>
      <th>Exento</th>
      <th>IVA 5%</th>
      <th>IVA 10%</th>
      <th>Total IVA</th>
      <th>Total General</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{formatPY subtotal_exento}} Gs.</td>
      <td>{{formatPY subtotal_iva5}} Gs.</td>
      <td>{{formatPY subtotal_iva10}} Gs.</td>
      <td>{{formatPY total_iva}} Gs.</td>
      <td>{{formatPY total}} Gs.</td>
    </tr>
  </tbody>
</table>

<p class="total-letras">Total en letras: {{totalletras}}</p>

<div class="footer">
  <p>Gracias por su preferencia. ¡Vuelva pronto!</p>
</div>
`