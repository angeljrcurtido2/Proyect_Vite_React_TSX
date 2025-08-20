import dotenv from "dotenv";
import path from "path";
import express from 'express';
import db from './db.js';
import cors from 'cors';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import proveedorRoutes from './routes/proveedorRoutes.js';
import configuracion from './routes/Facturacion/configuracion.js'
import detalleProductoRoutes from './routes/detalleProductoRoutes.js';
import compraRoutes from './routes/Compra/compraRoutes.js';
import cobroDeudaVentaRoutes from './routes/Venta/cobroDeudaVentaRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import ventasProgramadasRoutes from './routes/Venta/ventasProgramadasRoutes.js';
import ventaRoutes from './routes/Venta/ventaRoutes.js';
import detalleCompraRoutes from './routes/Compra/detalleCompra.js';
import clienteRoutes from './routes/clienteRoutes.js';
import actividadesEconomicasRoutes from './routes/Facturacion/actividadesEconomicasRoutes.js';
import facturadorRoutes from './routes/Facturacion/facturadorRoutes.js'
import deudaCompraRoutes from './routes/Compra/deudaCompraRoutes.js'
import movimientoCajaRoutes from './routes/movimientoCajaRoutes.js';
import arqueoRoutes from './routes/Movimiento/arqueoRoutes.js';
import detalleActivEconRoutes from './routes/Facturacion/detalleActivEconRoutes.js';
import ingresoRoutes from './routes/Movimiento/ingresos.js';
import tipoIngresoRoutes from './routes/Movimiento/tipoIngresoRoutes.js';
import tipoEgresoRoutes from './routes/Movimiento/tipoEgresoRoutes.js';
import egresoRoutes from './routes/Movimiento/egresos.js';
import formasPagoRoutes from './routes/formasPagoRoutes.js';
import datosBancariosRoutes from './routes/DatosBancarios/datosBancariosRoutes.js';
import authRoutes from './routes/authRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import procesarVentasProgramadas from './controllers/Ventas/procesarVentasProgramadas.js';
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
console.log("ENV loaded?", process.env.MAIL_HOST, process.env.MAIL_USER);
const app = express();

app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
  "http://127.0.0.1:5173",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  'http://181.123.181.252:8081',
  "file://"
];

app.use(cors({
  origin(origin, callback) {
    // origin === undefined cuando es request del mismo servidor o Postman
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());

// Rutas

app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/detallesproductos', detalleProductoRoutes);

// Ventas
app.use('/api/ventas', ventaRoutes);
app.use('/api/deuda-venta', cobroDeudaVentaRoutes);
app.use('/api/actividades-economicas', actividadesEconomicasRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/movimientos', movimientoCajaRoutes);

// Ventas Programadas
app.use('/api/ventas-programadas', ventasProgramadasRoutes);

app.use('/api/configuracion', configuracion);

//Facturador
app.use('/api/facturador', facturadorRoutes);
app.use('/api/detalle-activ-econ', detalleActivEconRoutes);

// Compras
app.use('/api/deuda-compra', deudaCompraRoutes);
app.use('/api/detalle-compra', detalleCompraRoutes);
app.use('/api/compras', compraRoutes);

//Ingresos
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/tipo-ingreso', tipoIngresoRoutes);

// Egresos
app.use('/api/egresos', egresoRoutes);
app.use('/api/tipo-egreso', tipoEgresoRoutes);

// Arqueo
app.use('/api/arqueo', arqueoRoutes);
app.use('/api/auth', authRoutes);

// Formas de pago
app.use('/api', formasPagoRoutes);

// Datos Bancarios
app.use('/api/datos-bancarios', datosBancariosRoutes);

// Ruta para realizar respaldo de BD
app.use('/api/utils', backupRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST ?? 'localhost'; 
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
});

cron.schedule('*/30 * * * * *', async () => {
  try {
    // Consulta si ventas_programadas está habilitado
    const [rows] = await db.promise().query(`
      SELECT valor FROM configuracion
      WHERE clave = 'ventas_programadas'
      LIMIT 1
    `);

    if (rows.length > 0 && rows[0].valor === 'true') {
      console.log('🚀 Ejecutando proceso de ventas programadas...');
      await procesarVentasProgramadas();
      console.log('✅ Proceso de ventas programadas completado.');
    } else {
      console.log('⚠️  Sistema de ventas programadas deshabilitado.');
    }
  } catch (error) {
    console.error('❌ Error al verificar configuración de ventas programadas:', error);
  }
});