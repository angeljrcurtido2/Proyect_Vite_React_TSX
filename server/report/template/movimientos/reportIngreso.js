

export const facturaTemplateIngreso = ` <head>
  <meta charset="UTF-8" />
  <title>Resumen de Ingresos por Movimiento</title>
  <style>
    @media print {
      @page { size: A4 portrait; margin: 20mm; }
      body  { margin: 0; padding: 0; }
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
    .header, .footer { text-align: center; }
    .logo { width: 80px; margin-bottom: 8px; }
    h2 { margin: 5px 0; font-size: 20px; color: #e07a1e; }
    .info p { margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 8px 6px; border: 1px solid #e0e0e0; font-size: 11px; }
    th { background-color: #f9c97b; font-weight: 600; }
    tr:nth-child(even) { background-color: #fff9f2; }
    .totales { margin-top: 15px; font-weight: bold; }
    hr { border: none; border-top: 2px solid #f9c97b; margin: 18px 0; }
    .footer { margin-top: 35px; font-style: italic; color: #666; }
  </style>
</head>

<body>

  <div class="header">
    {{#if logo_base64}}
      <img src="{{logo_base64}}" class="logo" />
    {{/if}}
    <h2>{{empresa.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresa.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
    <p><strong>Vigencia:</strong> {{empresa.fecha_inicio_vigente}} al {{empresa.fecha_fin_vigente}}</p>
  </div>

  <hr />

  <div class="info">
    <p><strong>Movimiento #:</strong> {{movimiento.idmovimiento}}</p>
    <p><strong>Caja:</strong> {{movimiento.num_caja}}</p>
    <p><strong>Fecha Apertura:</strong> {{movimiento.fecha_apertura}}</p>
    <p><strong>Fecha Cierre:</strong> {{movimiento.fecha_cierre}}</p>
    <p><strong>Estado:</strong> {{movimiento.estado}}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Monto</th>
        <th>Concepto</th>
        <th>Tipo Ingreso</th>
        <th>Forma Pago</th>
        <th>Observación</th>
        <th>Usuario</th>
      </tr>
    </thead>
    <tbody>
      {{#each ingresos}}
        <tr>
          <td>{{idingreso}}</td>
          <td>{{fecha}}</td>
          <td>{{formatPY monto}} Gs.</td>
          <td>{{concepto}}</td>
          <td>{{tipo_ingreso}}</td>
          <td>{{forma_pago}}</td>
          <td>{{observacion}}</td>
          <td>{{creador}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>

  <p class="totales">Total del Movimiento: {{formatPY totalMovimiento}} Gs.</p>

  <div class="footer">
    <p>Documento generado automáticamente</p>
  </div>

`;

export const facturaTemplateEgreso = `<head>
  <meta charset="UTF-8" />
  <title>Resumen de Ingresos por Movimiento</title>
  <style>
    @media print {
      @page { size: A4 portrait; margin: 20mm; }
      body  { margin: 0; padding: 0; }
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
    .header, .footer { text-align: center; }
    .logo { width: 80px; margin-bottom: 8px; }
    h2 { margin: 5px 0; font-size: 20px; color: #e07a1e; }
    .info p { margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 8px 6px; border: 1px solid #e0e0e0; font-size: 11px; }
    th { background-color: #f9c97b; font-weight: 600; }
    tr:nth-child(even) { background-color: #fff9f2; }
    .totales { margin-top: 15px; font-weight: bold; }
    hr { border: none; border-top: 2px solid #f9c97b; margin: 18px 0; }
    .footer { margin-top: 35px; font-style: italic; color: #666; }
  </style>
</head>

<body>

  <!-- ===== ENCABEZADO EMPRESA ===== -->
  <div class="header">
    {{#if logo_base64}}
      <img src="{{logo_base64}}" class="logo" />
    {{/if}}
    <h2>{{empresa.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresa.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
    <p><strong>Vigencia:</strong> {{empresa.fecha_inicio_vigente}} al {{empresa.fecha_fin_vigente}}</p>
  </div>

  <hr />

  <!-- ===== MOVIMIENTO ===== -->
  <div class="info">
    <p><strong>Movimiento #:</strong> {{movimiento.idmovimiento}}</p>
    <p><strong>Caja:</strong> {{movimiento.num_caja}}</p>
    <p><strong>Fecha Apertura:</strong> {{movimiento.fecha_apertura}}</p>
    <p><strong>Fecha Cierre:</strong> {{movimiento.fecha_cierre}}</p>
    <p><strong>Estado:</strong> {{movimiento.estado}}</p>
  </div>

  <!-- ===== TABLA DE INGRESOS ===== -->
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Monto</th>
        <th>Concepto</th>
        <th>Tipo Egreso</th>
        <th>Forma Pago</th>
        <th>Observación</th>
        <th>Usuario</th>
      </tr>
    </thead>
    <tbody>
      {{#each egresos}}
        <tr>
          <td>{{idegreso}}</td>
          <td>{{fecha}}</td>
          <td>{{formatPY monto}} Gs.</td>
          <td>{{concepto}}</td>
          <td>{{tipo_egreso}}</td>
          <td>{{forma_pago}}</td>
          <td>{{observacion}}</td>
          <td>{{creador}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>

  <!-- ===== TOTAL ===== -->
  <p class="totales">Total del Movimiento: {{formatPY totalMovimiento}} Gs.</p>

  <!-- ===== PIE ===== -->
  <div class="footer">
    <p>Documento generado automáticamente</p>
  </div>

`;

export const facturaTemprateResumen = `   <style>
    @media print {
      @page { size: A4 portrait; margin: 20mm; }
      body  { margin: 0; padding: 0; }
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
    .header, .footer { text-align: center; }
    .logo { width: 80px; margin-bottom: 8px; }
    h2 { margin: 5px 0; font-size: 20px; color: #e07a1e; }
    .info p { margin: 3px 0; }

    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 8px 6px; border: 1px solid #e0e0e0; font-size: 11px; }
    th { background-color: #f9c97b; font-weight: 600; }
    tr:nth-child(even) { background-color: #fff9f2; }

    .section-title { margin-top: 25px; font-weight: 700; color: #e07a1e; }

    .totales { margin-top: 18px; font-weight: bold; }
    hr { border: none; border-top: 2px solid #f9c97b; margin: 18px 0; }
    .footer { margin-top: 35px; font-style: italic; color: #666; }
  </style>
</head>

<body>

  <!-- ===== ENCABEZADO EMPRESA ===== -->
  <div class="header">
    {{#if logo_base64}}
      <img src="{{logo_base64}}" class="logo" />
    {{/if}}
    <h2>{{empresa.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresa.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
    <p><strong>Vigencia:</strong> {{empresa.fecha_inicio_vigente}} al {{empresa.fecha_fin_vigente}}</p>
  </div>

  <hr />

  <!-- ===== MOVIMIENTO ===== -->
  <div class="info">
    <p><strong>Movimiento #:</strong> {{movimiento.idmovimiento}}</p>
    <p><strong>Caja:</strong> {{movimiento.num_caja}}</p>
    <p><strong>Fecha Apertura:</strong> {{movimiento.fecha_apertura}}</p>
    <p><strong>Fecha Cierre:</strong> {{movimiento.fecha_cierre}}</p>
    <p><strong>Estado:</strong> {{movimiento.estado}}</p>
  </div>

  <!-- ===== TABLA DE INGRESOS ===== -->
  <p class="section-title">Ingresos</p>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Monto</th>
        <th>Concepto</th>
        <th>Tipo Ingreso</th>
        <th>Forma Pago</th>
        <th>Observación</th>
        <th>Usuario</th>
      </tr>
    </thead>
    <tbody>
      {{#each ingresos}}
        <tr>
          <td>{{idingreso}}</td>
          <td>{{fecha}}</td>
          <td>{{formatPY monto}} Gs.</td>
          <td>{{concepto}}</td>
          <td>{{tipo_ingreso}}</td>
          <td>{{forma_pago}}</td>
          <td>{{observacion}}</td>
          <td>{{creador}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>

  <!-- ===== TABLA DE EGRESOS ===== -->
  <p class="section-title">Egresos</p>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Monto</th>
        <th>Concepto</th>
        <th>Tipo Egreso</th>
        <th>Forma Pago</th>
        <th>Observación</th>
        <th>Usuario</th>
      </tr>
    </thead>
    <tbody>
      {{#each egresos}}
        <tr>
          <td>{{idegreso}}</td>
          <td>{{fecha}}</td>
          <td>{{formatPY monto}}</td>
          <td>{{concepto}}</td>
          <td>{{tipo_egreso}}</td>
          <td>{{forma_pago}}</td>
          <td>{{observacion}}</td>
          <td>{{creador}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>

  <!-- ===== TOTALES ===== -->
  <p class="totales">Total del Movimiento: {{formatPY totalMovimiento}} Gs.</p>
  <p class="totales">Total de Ingresos: {{formatPY totalIngresos}} Gs.</p>
  <p class="totales">Total de Egresos: {{formatPY totalEgresos}} Gs.</p>

  <!-- ===== PIE ===== -->
  <div class="footer">
    <p>Documento generado automáticamente</p>
  </div>
`