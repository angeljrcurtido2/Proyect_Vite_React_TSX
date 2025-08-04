export const facturaTemplateHTMLPagosCliente = ` <style>
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

    ul {
      margin: 0;
      padding-left: 15px;
    }

    ul li {
      margin-bottom: 3px;
    }
  </style>
</head>

<body>

  <div class="header">
    <h2>{{empresas.nombre_fantasia}}</h2>
    <p><strong>RUC:</strong> {{empresas.ruc}}</p>
    <p><strong>Timbrado:</strong> {{empresas.timbrado_nro}}</p>
    <p><strong>Inicio Vigencia:</strong> {{empresas.fecha_inicio_vigente}}</p>
    <p><strong>Fin Vigencia:</strong> {{empresas.fecha_fin_vigente}}</p>
    <p><strong>Fecha de Emisión:</strong> {{empresas.fecha_emision}}</p>
  </div>

  <hr />

  <div class="info">
    <p><strong>Cliente:</strong> {{cliente.nombre}} {{cliente.apellido}}</p>
    <p><strong>Documento:</strong> {{cliente.numDocumento}}</p>
    <p><strong>Teléfono:</strong> {{cliente.telefono}}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Fecha de Pago</th>
        <th>Monto Pagado</th>
        <th>Observación</th>
        <th>Detalles</th>
      </tr>
    </thead>
    <tbody>
      {{#each detalle_pagos}}
        <tr>
          <td>{{fecha_pago}}</td>
          <td>{{formatPY monto_pagado}} Gs.</td>
          <td>{{observacion}}</td>
          <td>
            <ul>
              {{#each detalles}}
                <li><strong>{{label}}:</strong> {{value}}</li>
              {{/each}}
            </ul>
          </td>
        </tr>
      {{/each}}
    </tbody>
  </table>

  <div class="footer">
    <p>Generado el {{empresas.fecha_emision}}</p>
  </div>
`;
