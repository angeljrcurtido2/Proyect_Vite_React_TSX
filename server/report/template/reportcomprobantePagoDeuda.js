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
</head>

<body>

    <div class="header">
      
        <h2>{{empresa.nombre_fantasia}}</h2>
        <p>
            <strong>RUC:</strong> {{empresa.ruc}}</p>
        <p>
            <strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
        <p>
            <strong>Inicio Vigencia:</strong> {{empresa.fecha_inicio_vigente}}</p>
        <p>
            <strong>Fin Vigencia:</strong> {{empresa.fecha_fin_vigente}}</p>
        <p>
            <strong>Fecha Emisión:</strong> {{empresa.fecha_emision}}</p>
    </div>

    <hr />

    <div>
        <p>
            <strong>Cliente:</strong> {{cliente.nombre}} {{cliente.apellido}} </p>
        <p>
            <strong>Documento:</strong> {{cliente.numDocumento}}</p>
        <p>
            <strong>Teléfono:</strong> {{cliente.telefono}}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Prod.</th>
                <th>Cant</th>
                <th>P.Unit</th>
                <th>SubT.</th>
            </tr>
        </thead>
        <tbody>
            {{#each productos}}
            <tr>
                <td>{{nombre_producto}}</td>
                <td>{{cantidad}}</td>
                <td>{{formatPY precio_venta}} Gs.</td>
                <td>{{formatPY sub_total}} Gs.</td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    <table class="totales">
        <tbody>
            <tr>
                <td>Monto Abonado:</td>
                <td style="text-align: right;">{{formatPY montoAplicado}} Gs.</td>
            </tr>
            <tr>
                <td>Total Deuda:</td>
                <td style="text-align: right;">{{formatPY total_deuda}} Gs.</td>
            </tr>
            <tr>
                <td>Total Pagado:</td>
                <td style="text-align: right;">{{formatPY total_pagado_actual}} Gs.</td>
            </tr>
            <tr>
                <td>Saldo Restante:</td>
                <td style="text-align: right;">{{formatPY saldo_restante}} Gs.</td>
            </tr>
        </tbody>
    </table>

    <p style="margin-top: 10px; text-align: center;">
        <strong>¡Gracias por su preferencia!</strong>
    </p>

    <div class="footer">
        Comprobante generado - {{empresa.fecha_emision}}
        <br />
        <strong>Este comprobante es solo un ticket y no posee validez fiscal.</strong>
    </div>
    `;

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

    .header,
    .footer {
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

    th,
    td {
      padding: 8px;
      text-align: left;
      border: 1px solid #ccc;
      font-size: 12px;
    }

    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .totales th,
    .totales td {
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
</head>

<body>

  <div class="header">
  
    <h2>{{empresa.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresa.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
    <p><strong>Inicio Vigencia:</strong> {{empresa.fecha_inicio_vigente}}</p>
    <p><strong>Fin Vigencia:</strong> {{empresa.fecha_fin_vigente}}</p>
    <p><strong>Fecha de Emisión:</strong> {{empresa.fecha_emision}}</p>
  </div>

  <hr />

  <div class="info">
    <p><strong>Comprobante N°:</strong> {{iddeuda_venta}}</p>
    <p><strong>Cliente:</strong> {{cliente.nombre}} {{cliente.apellido}} </p>
    <p><strong>Documento:</strong> {{cliente.numDocumento}}</p>
    <p><strong>Teléfono:</strong> {{cliente.telefono}}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Subtotal</th>
        <th>Unidad</th>
        <th>Cód. Barra</th>
      </tr>
    </thead>
    <tbody>
      {{#each productos}}
      <tr>
        <td>{{nombre_producto}}</td>
        <td>{{cantidad}}</td>
        <td>{{formatPY precio_venta}} Gs.</td>
        <td>{{formatPY sub_total}} Gs.</td>
        <td>{{unidad_medida}}</td>
        <td>{{cod_barra}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <table class="totales">
    <thead>
      <tr>
        <th>Monto Abonado</th>
        <th>Total Deuda</th>
        <th>Total Pagado</th>
        <th>Saldo Restante</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{formatPY montoAplicado}} Gs.</td>
        <td>{{formatPY total_deuda}} Gs.</td>
        <td>{{formatPY total_pagado_actual}} Gs.</td>
        <td>{{formatPY saldo_restante}} Gs.</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Este comprobante es solo un ticket y no posee validez fiscal.</strong></p>
    <p>Gracias por su preferencia.</p>
  </div>`;

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
</head>

<body>

  <div class="header">
 
    <h2>{{empresa.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresa.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
    <p><strong>Inicio Vigencia:</strong> {{empresa.fecha_inicio_vigente}}</p>
    <p><strong>Fin Vigencia:</strong> {{empresa.fecha_fin_vigente}}</p>
    <p><strong>Fecha de Emisión:</strong> {{empresa.fecha_emision}}</p>
  </div>

  <hr />

  <div class="info">
    <p><strong>Cliente:</strong> {{cliente.nombre}} {{cliente.apellido}} </p>
    <p><strong>Documento:</strong> {{cliente.numDocumento}}</p>
    <p><strong>Teléfono:</strong> {{cliente.telefono}}</p>
    <p><strong>Monto pagado:</strong> {{formatPY montoAplicado}} Gs.</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Subtotal</th>
        <th>Unidad</th>
        <th>Código Barra</th>
      </tr>
    </thead>
    <tbody>
      {{#each productos}}
      <tr>
        <td>{{nombre_producto}}</td>
        <td>{{cantidad}}</td>
        <td>{{formatPY precio_venta}} Gs.</td>
        <td>{{formatPY sub_total}} Gs.</td>
        <td>{{unidad_medida}}</td>
        <td>{{cod_barra}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <table class="totales">
    <tbody>
     <tr>
        <th>Monto Abonado:</th>
        <td>{{formatPY montoAplicado}} Gs.</td>
      </tr>
      <tr>
        <th>Total Deuda:</th>
        <td>{{formatPY total_deuda}} Gs.</td>
      </tr>
      <tr>
        <th>Total Pagado:</th>
        <td>{{formatPY total_pagado_actual}} Gs.</td>
      </tr>
      <tr>
        <th>Saldo Restante:</th>
        <td>{{formatPY saldo_restante}} Gs.</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Este comprobante no posee validez fiscal.</strong></p>
    <p>Gracias por su preferencia.</p>
    <p>Generado el {{empresa.fecha_emision}}</p>
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
</head>

<body>

  <div class="header">
 
    <h2>{{empresa.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresa.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
    <p><strong>Inicio Vigencia:</strong> {{empresa.fecha_inicio_vigente}}</p>
    <p><strong>Fin Vigencia:</strong> {{empresa.fecha_fin_vigente}}</p>
    <p><strong>Fecha de Emisión:</strong> {{empresa.fecha_emision}}</p>
  </div>

  <hr />

  <div class="info">
    <p><strong>Cliente:</strong> {{cliente.nombre}} {{cliente.apellido}} </p>
    <p><strong>Documento:</strong> {{cliente.numDocumento}}</p>
    <p><strong>Teléfono:</strong> {{cliente.telefono}}</p>
    <p><strong>Monto pagado:</strong> {{formatPY montoAplicado}} Gs.</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Subtotal</th>
        <th>Unidad</th>
        <th>Código Barra</th>
      </tr>
    </thead>
    <tbody>
      {{#each productos}}
      <tr>
        <td>{{nombre_producto}}</td>
        <td>{{cantidad}}</td>
        <td>{{formatPY precio_venta}} Gs.</td>
        <td>{{formatPY sub_total}} Gs.</td>
        <td>{{unidad_medida}}</td>
        <td>{{cod_barra}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <table class="totales">
    <tbody>
      <tr>
        <th>Monto Abonado:</th>
        <td>{{formatPY montoAplicado}} Gs.</td>
      </tr>
      <tr>
        <th>Total Deuda:</th>
        <td>{{formatPY total_deuda}} Gs.</td>
      </tr>
      <tr>
        <th>Total Pagado:</th>
        <td>{{formatPY total_pagado_actual}} Gs.</td>
      </tr>
      <tr>
        <th>Saldo Restante:</th>
        <td>{{formatPY saldo_restante}} Gs.</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Este comprobante no posee validez fiscal.</strong></p>
    <p>Gracias por su preferencia.</p>
    <p>Generado el {{empresa.fecha_emision}}</p>
  </div>

`