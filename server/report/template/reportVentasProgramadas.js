export const reporteTemplateHTMLVentasProgramadas = `<style>
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

        .header .info {
            flex: 1;
            padding-left: 10px;
        }

        .header .logo {
            width: 80px;
            height: auto;
            margin-bottom: 10px;
        }

        .header h2 {
            margin: 5px 0;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #444;
        }

        .info-cliente {
            margin-bottom: 15px;
        }

        .info-cliente strong {
            display: inline-block;
            width: 130px;
        }

        table {
            font-size: 12px;
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
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

        .empresa-datos {
            display: flex;
            flex-direction: row;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
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

    <h1> Reporte de Ventas Programadas de Cliente Seleccionado</h1>

    <div class="info-cliente">
        <p>
            <strong>Cliente:</strong> {{venta_programada.cliente}}
        </p>
        <p>
            <strong>Número Documento:</strong> {{venta_programada.nro_documento}}
        </p>
    </div>
    <hr style="margin: 15px 0;" />
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Prod.</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Fecha Inicio</th>
                <th>Día Progr</th>
                <th>Últ. Venta</th>
            </tr>
        </thead>
        <tbody>
            {{#each venta_programada.detalles}}
            <tr>
                <td>{{@index}}</td>
                <td>{{nombre_producto}}</td>
                <td>{{cantidad}}</td>
                <td>{{formatPY precio_venta}} Gs.</td>
                <td>{{formatPY subtotal}} Gs.</td>
                <td>{{fecha_inicio}}</td>
                <td>{{dia_programado}}</td>
                <td>{{ultima_fecha_venta}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    <div class="footer">
        Generado por el sistema - {{now}}
    </div>

`