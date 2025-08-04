export const reporteTemplateHTMLPagosCliente = `    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 30px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header .empresa-datos {
            display: flex;
            flex-direction: row;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .header h2 {
            margin: 5px 0;
        }

        table {
            font-size: 12px;
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f0f0f0;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #888;
        }
    </style>
</head>

<body>

    <div class="header">
        <h2>{{empresa.nombre_fantasia}}</h2>
        <div class="empresa-datos">
            <p>
                <strong>RUC:</strong> {{empresa.ruc}}</p>
            <p>
                <strong>Timbrado:</strong> {{empresa.timbrado_nro}}</p>
            <p>
                <strong>Inicio Vigencia:</strong> {{empresa.fecha_inicio_vigente}}</p>
            <p>
                <strong>Fin Vigencia:</strong> {{empresa.fecha_fin_vigente}}</p>
        </div>
    </div>

    <hr style="margin: 15px 0;" />

    <h1 style="text-align:center">Reporte Listado de Deudas por Cliente</h1>
    <h2 style="text-align:center">Generado en Fecha: {{fecha_generada}}</h2>
    <div class="header">
        <div class="empresa-datos">
            <p>
                <strong>Cliente:</strong> {{cliente.nombre_cliente}}</p>
            <p>
                <strong>RUC:</strong> {{cliente.numDocumento}}</p>
        </div>
    </div>

    <hr style="margin: 15px 0;" />


    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Total Deuda</th>
                <th>Total Pagado</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Fecha Deuda</th>
                <th>Ult. Fecha Pago</th>
            </tr>
        </thead>
        <tbody>
            {{#each deudas}}
            <tr>
                <td>{{@index}}</td>
                <td>{{formatPY total_deuda}} Gs.</td>
                <td>{{formatPY total_pagado}} Gs.</td>
                <td>{{formatPY saldo}} Gs.</td>
                <td>{{estado}}</td>
                <td>{{fecha_deuda}}</td>
                <td>{{ult_fecha_pago}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>
    <div style="margin-top: 20px;">
        <strong>Debe Total:</strong> {{formatPY debe_total}} Gs.
        <br />
        <strong>Pago Total:</strong> {{formatPY pagado_total}} Gs.
        <br />
        <strong>Saldo Total:</strong> {{formatPY saldo_total}} Gs.
    </div>

    <div class="footer">
        Generado por el sistema - {{fecha_generada}}
    </div>

</body>

`