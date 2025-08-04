/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: actividades_economicas
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `actividades_economicas` (
  `idactividad` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`idactividad`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: arqueo
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `arqueo` (
  `idarqueo` int(11) NOT NULL AUTO_INCREMENT,
  `a50` int(11) DEFAULT 0,
  `a100` int(11) DEFAULT 0,
  `a500` int(11) DEFAULT 0,
  `a1000` int(11) DEFAULT 0,
  `a2000` int(11) DEFAULT 0,
  `a5000` int(11) DEFAULT 0,
  `a10000` int(11) DEFAULT 0,
  `a20000` int(11) DEFAULT 0,
  `a50000` int(11) DEFAULT 0,
  `a100000` int(11) DEFAULT 0,
  `total` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `detalle1` varchar(100) DEFAULT NULL,
  `monto1` decimal(15, 2) DEFAULT NULL,
  `detalle2` varchar(100) DEFAULT NULL,
  `monto2` decimal(15, 2) DEFAULT NULL,
  `detalle3` varchar(100) DEFAULT NULL,
  `monto3` decimal(15, 2) DEFAULT NULL,
  `detalle4` varchar(100) DEFAULT NULL,
  `monto4` decimal(15, 2) DEFAULT NULL,
  `detalle5` varchar(100) DEFAULT NULL,
  `monto5` decimal(15, 2) DEFAULT NULL,
  `idmovimiento` int(11) NOT NULL,
  PRIMARY KEY (`idarqueo`),
  KEY `idmovimiento` (`idmovimiento`),
  CONSTRAINT `arqueo_ibfk_1` FOREIGN KEY (`idmovimiento`) REFERENCES `movimiento_caja` (`idmovimiento`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: asientos_contables
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `asientos_contables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `concepto` text DEFAULT NULL,
  `cuenta_debe` varchar(100) DEFAULT NULL,
  `cuenta_haber` varchar(100) DEFAULT NULL,
  `monto` decimal(15, 2) DEFAULT NULL,
  `referencia_origen` varchar(50) DEFAULT NULL,
  `tipo_origen` enum('ingreso', 'egreso', 'otro') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: categorias
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categorias` (
  `idcategorias` int(11) NOT NULL AUTO_INCREMENT,
  `categoria` varchar(100) NOT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idcategorias`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: clientes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `clientes` (
  `idcliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `numDocumento` varchar(50) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `tipo_cliente` varchar(50) NOT NULL DEFAULT 'minorista',
  PRIMARY KEY (`idcliente`),
  UNIQUE KEY `numDocumento` (`numDocumento`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: compras
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `compras` (
  `idcompra` int(11) NOT NULL AUTO_INCREMENT,
  `idusuarios` int(11) DEFAULT NULL,
  `idproveedor` int(11) DEFAULT NULL,
  `idmovimiento` int(11) DEFAULT NULL,
  `iddetalle_transferencia_compra` int(11) DEFAULT NULL,
  `iddetalle_tarjeta_compra` int(11) DEFAULT NULL,
  `total` decimal(10, 2) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `nro_factura` varchar(50) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `descuento` decimal(10, 2) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idcompra`),
  KEY `idusuarios` (`idusuarios`),
  KEY `idproveedor` (`idproveedor`),
  KEY `idmovimiento` (`idmovimiento`),
  KEY `fk_compras_detalle_transferencia` (`iddetalle_transferencia_compra`),
  KEY `iddetalle_tarjeta_compra` (`iddetalle_tarjeta_compra`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: configuracion
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `configuracion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clave` varchar(50) NOT NULL,
  `valor` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave` (`clave`)
) ENGINE = InnoDB AUTO_INCREMENT = 169 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: datos_bancarios
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `datos_bancarios` (
  `iddatos_bancarios` int(11) NOT NULL AUTO_INCREMENT,
  `banco_origen` varchar(100) NOT NULL,
  `numero_cuenta` varchar(50) NOT NULL,
  `tipo_cuenta` varchar(50) NOT NULL,
  `titular_cuenta` varchar(100) NOT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`iddatos_bancarios`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: datos_transferencia_venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `datos_transferencia_venta` (
  `idtransferencia` int(11) NOT NULL AUTO_INCREMENT,
  `idventa` int(11) NOT NULL,
  `banco_origen` varchar(100) NOT NULL,
  `numero_cuenta` varchar(30) NOT NULL,
  `tipo_cuenta` varchar(100) DEFAULT NULL,
  `titular_cuenta` varchar(100) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idtransferencia`),
  KEY `idventa` (`idventa`),
  CONSTRAINT `datos_transferencia_venta_ibfk_1` FOREIGN KEY (`idventa`) REFERENCES `ventas` (`idventa`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_actividades_economicas
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_actividades_economicas` (
  `iddetalle` int(11) NOT NULL AUTO_INCREMENT,
  `idfacturador` int(11) NOT NULL,
  `idactividad` int(11) NOT NULL,
  PRIMARY KEY (`iddetalle`),
  KEY `idx_fact_actividad` (`idfacturador`, `idactividad`),
  KEY `fk_detalle_actividad` (`idactividad`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_cheque_venta_cobro
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_cheque_venta_cobro` (
  `iddetalle_cheque_venta_cobro` int(11) NOT NULL AUTO_INCREMENT,
  `idingreso` int(11) NOT NULL,
  `banco` varchar(100) NOT NULL,
  `nro_cheque` varchar(50) NOT NULL,
  `monto` decimal(15, 2) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `titular` varchar(100) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`iddetalle_cheque_venta_cobro`),
  KEY `idingreso` (`idingreso`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_compra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_compra` (
  `iddetalle` int(11) NOT NULL AUTO_INCREMENT,
  `idproducto` int(11) DEFAULT NULL,
  `idcompra` int(11) DEFAULT NULL,
  `idproveedor` int(11) DEFAULT NULL,
  `cantidad` decimal(10, 2) DEFAULT NULL,
  `precio` decimal(10, 2) DEFAULT NULL,
  `sub_total` decimal(10, 2) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `nombre_producto` varchar(255) DEFAULT NULL,
  `unidad_medida` varchar(50) DEFAULT NULL,
  `iva` decimal(5, 2) DEFAULT NULL,
  `stock_restante` decimal(10, 2) DEFAULT NULL,
  PRIMARY KEY (`iddetalle`),
  KEY `idcompra` (`idcompra`),
  KEY `idproveedor` (`idproveedor`),
  KEY `fk_idproducto` (`idproducto`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_pago_deuda_compra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_pago_deuda_compra` (
  `idpago_deuda_compra` int(11) NOT NULL AUTO_INCREMENT,
  `iddeuda_compra` int(11) NOT NULL,
  `monto_pagado` decimal(15, 2) NOT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `observacion` text DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `creado_por` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idpago_deuda_compra`),
  KEY `iddeuda_compra` (`iddeuda_compra`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_pago_deuda_venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_pago_deuda_venta` (
  `idpago_deuda` int(11) NOT NULL AUTO_INCREMENT,
  `iddeuda` int(11) NOT NULL,
  `total_deuda` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `total_pagado` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `saldo` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `monto_pagado` decimal(15, 2) NOT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `observacion` text DEFAULT NULL,
  `idformapago` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `iddetalle_transferencia_cobro` int(11) DEFAULT NULL,
  `iddetalle_tarjeta_venta_cobro` int(11) DEFAULT NULL,
  `iddetalle_cheque_venta_cobro` int(11) DEFAULT NULL,
  PRIMARY KEY (`idpago_deuda`),
  KEY `fk_pago_deuda` (`iddeuda`),
  KEY `fk_transferencia_pago_deuda` (`iddetalle_transferencia_cobro`),
  KEY `fk_tarjeta_pago_deuda` (`iddetalle_tarjeta_venta_cobro`),
  KEY `fk_cheque_pago_deuda` (`iddetalle_cheque_venta_cobro`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_producto
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_producto` (
  `iddetalle` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_detalle` varchar(100) NOT NULL,
  `idproducto` int(11) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  PRIMARY KEY (`iddetalle`),
  KEY `idproducto` (`idproducto`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_tarjeta_venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_tarjeta_venta` (
  `idtarjeta_venta` int(11) NOT NULL AUTO_INCREMENT,
  `idventa` int(11) NOT NULL,
  `tipo_tarjeta` varchar(10) NOT NULL,
  `entidad` varchar(50) DEFAULT NULL,
  `monto` decimal(15, 2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idtarjeta_venta`),
  KEY `idventa` (`idventa`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_tarjeta_venta_cobro
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_tarjeta_venta_cobro` (
  `idtarjeta_venta_cobro` int(11) NOT NULL AUTO_INCREMENT,
  `idingreso` int(11) NOT NULL,
  `tipo_tarjeta` varchar(50) NOT NULL,
  `entidad` varchar(100) NOT NULL,
  `monto` decimal(15, 2) NOT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idtarjeta_venta_cobro`),
  KEY `idingreso` (`idingreso`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_transferencia_cobro
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_transferencia_cobro` (
  `idtransferencia_cobro` int(11) NOT NULL AUTO_INCREMENT,
  `idingreso` int(11) NOT NULL,
  `banco_origen` varchar(100) NOT NULL,
  `numero_cuenta` varchar(50) NOT NULL,
  `tipo_cuenta` varchar(50) NOT NULL,
  `titular_cuenta` varchar(100) NOT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idtransferencia_cobro`),
  KEY `idingreso` (`idingreso`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_transferencia_compra_pago
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_transferencia_compra_pago` (
  `idtransferencia_compra_pago` int(11) NOT NULL AUTO_INCREMENT,
  `idegreso` int(11) NOT NULL,
  `banco_origen` varchar(100) NOT NULL,
  `numero_cuenta` varchar(100) NOT NULL,
  `tipo_cuenta` varchar(50) NOT NULL,
  `titular_cuenta` varchar(100) NOT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idtransferencia_compra_pago`),
  KEY `idegreso` (`idegreso`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalle_venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalle_venta` (
  `iddetalle` int(11) NOT NULL AUTO_INCREMENT,
  `idventa` int(11) NOT NULL,
  `idproducto` int(11) DEFAULT NULL,
  `nombre_producto` varchar(255) DEFAULT NULL,
  `cantidad` decimal(10, 2) DEFAULT NULL,
  `precio_venta` decimal(15, 2) DEFAULT NULL,
  `precio_compra` decimal(15, 2) DEFAULT NULL,
  `ganancia` decimal(15, 2) DEFAULT 0.00,
  `sub_total` decimal(15, 2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `iva5` decimal(15, 2) DEFAULT 0.00,
  `iva10` decimal(15, 2) DEFAULT 0.00,
  `iddetalle_compra` int(11) DEFAULT NULL,
  PRIMARY KEY (`iddetalle`),
  KEY `idx_detalle_venta_idventa` (`idventa`),
  KEY `fk_detalle_compra` (`iddetalle_compra`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: detalles_cheques_compra_pago
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `detalles_cheques_compra_pago` (
  `iddetalle_cheque_compra_pago` int(11) NOT NULL AUTO_INCREMENT,
  `idegreso` int(11) NOT NULL,
  `banco` varchar(100) NOT NULL,
  `nro_cheque` varchar(50) NOT NULL,
  `monto` decimal(15, 2) NOT NULL,
  `fecha_emision` date NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `titular` varchar(100) NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`iddetalle_cheque_compra_pago`),
  KEY `idegreso` (`idegreso`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: deuda_compra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `deuda_compra` (
  `iddeuda_compra` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idcompra` int(11) NOT NULL,
  `idproveedor` int(11) NOT NULL,
  `total_deuda` decimal(14, 2) NOT NULL DEFAULT 0.00,
  `total_pagado` decimal(14, 2) NOT NULL DEFAULT 0.00,
  `saldo` decimal(14, 2) GENERATED ALWAYS AS (`total_deuda` - `total_pagado`) STORED,
  `estado` enum('pendiente', 'pagado') NOT NULL DEFAULT 'pendiente',
  `fecha_deuda` date NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`iddeuda_compra`),
  KEY `idx_compra` (`idcompra`),
  KEY `idx_proveedor` (`idproveedor`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha_deuda` (`fecha_deuda`),
  CONSTRAINT `fk_dc_compra` FOREIGN KEY (`idcompra`) REFERENCES `compras` (`idcompra`),
  CONSTRAINT `fk_dc_proveedor` FOREIGN KEY (`idproveedor`) REFERENCES `proveedor` (`idproveedor`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: deuda_venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `deuda_venta` (
  `iddeuda` int(11) NOT NULL AUTO_INCREMENT,
  `idventa` int(11) NOT NULL,
  `idcliente` int(11) NOT NULL,
  `total_deuda` decimal(15, 2) NOT NULL,
  `total_pagado` decimal(15, 2) DEFAULT 0.00,
  `saldo` decimal(15, 2) DEFAULT 0.00,
  `estado` varchar(20) DEFAULT 'PENDIENTE',
  `fecha_deuda` date NOT NULL,
  `ult_fecha_pago` datetime DEFAULT NULL,
  `costo_empresa` decimal(15, 2) NOT NULL,
  `ganancia_credito` decimal(15, 2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`iddeuda`),
  KEY `fk_deuda_venta_venta` (`idventa`),
  KEY `fk_deuda_venta_cliente` (`idcliente`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: egresos
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `egresos` (
  `idegreso` int(11) NOT NULL AUTO_INCREMENT,
  `idtipo_egreso` int(11) NOT NULL,
  `idformapago` int(11) DEFAULT NULL,
  `idcompra` int(11) DEFAULT NULL,
  `idpago_deuda_compra` int(11) DEFAULT NULL,
  `iddetalle_transferencia_pago` int(11) DEFAULT NULL,
  `iddetalle_cheque_compra_pago` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time DEFAULT NULL,
  `monto` decimal(15, 2) NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `observacion` text DEFAULT NULL,
  `idmovimiento` int(11) NOT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `iddetalle_tarjeta_compra_pago` int(11) DEFAULT NULL,
  PRIMARY KEY (`idegreso`),
  KEY `idtipo_egreso` (`idtipo_egreso`),
  KEY `idcompra` (`idcompra`),
  KEY `idpago_deuda_compra` (`idpago_deuda_compra`),
  KEY `fk_egresos_transferencia_pago` (`iddetalle_transferencia_pago`),
  KEY `fk_iddetalle_tarjeta_compra_pago` (`iddetalle_tarjeta_compra_pago`),
  KEY `fk_egresos_detalle_cheque_compra_pago` (`iddetalle_cheque_compra_pago`),
  KEY `fk_egresos_creado_por` (`creado_por`),
  KEY `idx_egresos_idformapago` (`idformapago`),
  CONSTRAINT `fk_egresos_forma_pago` FOREIGN KEY (`idformapago`) REFERENCES `formas_pago` (`idformapago`) ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: facturadores
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `facturadores` (
  `idfacturador` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_fantasia` varchar(255) NOT NULL,
  `titular` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `ruc` varchar(20) NOT NULL,
  `timbrado_nro` varchar(20) NOT NULL,
  `fecha_inicio_vigente` date NOT NULL,
  `fecha_fin_vigente` date NOT NULL,
  `nro_factura_inicial_habilitada` varchar(20) DEFAULT NULL,
  `nro_factura_final_habilitada` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `culminado` tinyint(1) DEFAULT 0,
  `facturas_utilizadas` int(11) DEFAULT 0,
  `nro_factura_disponible` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idfacturador`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: formas_pago
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `formas_pago` (
  `idformapago` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idformapago`),
  UNIQUE KEY `descripcion` (`descripcion`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ingresos
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ingresos` (
  `idingreso` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time DEFAULT curtime(),
  `monto` decimal(15, 2) NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `idtipo_ingreso` int(11) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `idmovimiento` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `idventa` int(11) DEFAULT NULL,
  `idpago_deuda` int(11) DEFAULT NULL,
  `idformapago` int(11) DEFAULT NULL,
  `iddetalle_transferencia_cobro` int(11) DEFAULT NULL,
  `iddetalle_tarjeta_venta_cobro` int(11) DEFAULT NULL,
  `iddetalle_cheque_venta_cobro` int(11) DEFAULT NULL,
  PRIMARY KEY (`idingreso`),
  KEY `idtipo_ingreso` (`idtipo_ingreso`),
  KEY `fk_ingreso_venta` (`idventa`),
  KEY `fk_ingreso_pago_deuda` (`idpago_deuda`),
  KEY `fk_ingresos_formapago` (`idformapago`),
  KEY `fk_ingresos_transferencia` (`iddetalle_transferencia_cobro`),
  KEY `fk_ingresos_creado_por` (`creado_por`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: libro_diario
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `libro_diario` (
  `id_diario` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time DEFAULT NULL,
  `concepto` varchar(255) NOT NULL,
  `cuenta_debe` varchar(50) NOT NULL,
  `cuenta_haber` varchar(50) NOT NULL,
  `monto` decimal(14, 2) NOT NULL,
  `idingreso` int(11) DEFAULT NULL,
  `idegreso` int(11) DEFAULT NULL,
  `idventa` int(11) DEFAULT NULL,
  `idcompra` int(11) DEFAULT NULL,
  `idcliente` int(11) DEFAULT NULL,
  `idproveedor` int(11) DEFAULT NULL,
  `idformapago` int(11) DEFAULT NULL,
  `idmovimiento` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_diario`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: movimiento_caja
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `movimiento_caja` (
  `idmovimiento` int(11) NOT NULL AUTO_INCREMENT,
  `idusuarios` int(11) DEFAULT NULL,
  `num_caja` int(11) DEFAULT NULL,
  `fecha_apertura` datetime DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `monto_apertura` decimal(10, 2) DEFAULT NULL,
  `monto_cierre` decimal(10, 2) DEFAULT NULL,
  `credito` decimal(10, 2) DEFAULT NULL,
  `gastos` decimal(10, 2) DEFAULT NULL,
  `cobrado` decimal(10, 2) DEFAULT NULL,
  `contado` decimal(10, 2) DEFAULT NULL,
  `ingresos` decimal(10, 2) DEFAULT NULL,
  `compras` decimal(10, 2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idmovimiento`),
  KEY `idusuarios` (`idusuarios`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: producto_proveedor
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `producto_proveedor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idproducto` int(11) NOT NULL,
  `idproveedor` int(11) NOT NULL,
  `precio_compra` decimal(10, 2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idproducto` (`idproducto`, `idproveedor`),
  UNIQUE KEY `unique_producto_proveedor` (`idproducto`, `idproveedor`),
  KEY `fk_proveedor` (`idproveedor`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: productos
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `productos` (
  `idproducto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(100) NOT NULL,
  `cod_barra` varchar(100) DEFAULT NULL,
  `precio_compra` decimal(10, 2) DEFAULT NULL,
  `stock` decimal(10, 2) DEFAULT NULL,
  `idcategoria` int(11) DEFAULT NULL,
  `idproveedor` int(11) DEFAULT NULL,
  `precio_venta` decimal(10, 2) DEFAULT 0.00,
  `ubicacion` varchar(100) DEFAULT NULL,
  `iva` decimal(5, 2) DEFAULT 0.00,
  `estado` varchar(20) DEFAULT 'activo',
  `unidad_medida` varchar(10) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idproducto`),
  UNIQUE KEY `nombre_producto` (`nombre_producto`),
  UNIQUE KEY `cod_barra` (`cod_barra`),
  KEY `idcategoria` (`idcategoria`),
  KEY `idproveedor` (`idproveedor`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: proveedor
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `proveedor` (
  `idproveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `razon` varchar(100) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idproveedor`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tipo_egreso
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tipo_egreso` (
  `idtipo_egreso` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idtipo_egreso`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tipo_ingreso
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tipo_ingreso` (
  `idtipo_ingreso` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idtipo_ingreso`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuarios
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuarios` (
  `idusuarios` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `acceso` varchar(50) DEFAULT NULL,
  `login` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idusuarios`),
  UNIQUE KEY `login` (`login`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ventas
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ventas` (
  `idventa` int(11) NOT NULL AUTO_INCREMENT,
  `idusuarios` int(11) DEFAULT NULL,
  `idcliente` int(11) DEFAULT NULL,
  `total` decimal(15, 2) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `nro_factura` varchar(50) DEFAULT NULL,
  `nro_ticket` int(11) DEFAULT NULL,
  `tipo` enum('contado', 'credito') DEFAULT NULL,
  `estado` enum('activo', 'anulado') DEFAULT NULL,
  `idformapago` int(11) DEFAULT NULL,
  `iddato_transferencia_venta` int(11) DEFAULT NULL,
  `idmovimiento` int(11) DEFAULT NULL,
  `descuento` decimal(15, 2) DEFAULT 0.00,
  `saldo` decimal(15, 2) DEFAULT 0.00,
  `tipo_comprobante` enum('factura', 'ticket') DEFAULT NULL,
  `iva5` decimal(15, 2) DEFAULT 0.00,
  `iva10` decimal(15, 2) DEFAULT 0.00,
  `totaliva` decimal(15, 2) DEFAULT 0.00,
  `totalletras` text DEFAULT NULL,
  `estado_pago` enum('pagado', 'pendiente') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `idfacturador` int(11) DEFAULT NULL,
  `nombre_fantasia_facturador` varchar(255) DEFAULT NULL,
  `ruc_facturador` varchar(20) DEFAULT NULL,
  `timbrado_nro_facturador` varchar(20) DEFAULT NULL,
  `fecha_inicio_vigente_facturador` date DEFAULT NULL,
  `fecha_fin_vigente_facturador` date DEFAULT NULL,
  `iddetalle_cheque_venta` int(11) DEFAULT NULL,
  PRIMARY KEY (`idventa`),
  KEY `fk_venta_cliente` (`idcliente`),
  KEY `fk_ventas_usuarios` (`idusuarios`),
  KEY `fk_venta_formapago` (`idformapago`),
  KEY `fk_venta_transferencia` (`iddato_transferencia_venta`),
  KEY `fk_venta_cheque` (`iddetalle_cheque_venta`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ventas_programadas
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ventas_programadas` (
  `idprogramacion` int(11) NOT NULL AUTO_INCREMENT,
  `idcliente` int(11) NOT NULL,
  `idproducto` int(11) NOT NULL,
  `cantidad` decimal(10, 2) NOT NULL DEFAULT 1.00,
  `fecha_inicio` date NOT NULL,
  `dia_programado` int(11) NOT NULL,
  `ultima_fecha_venta` date DEFAULT NULL,
  `estado` enum('activa', 'inactiva', 'cancelada') DEFAULT 'activa',
  `idusuario` int(11) NOT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`idprogramacion`),
  KEY `idcliente` (`idcliente`),
  KEY `idproducto` (`idproducto`),
  KEY `idusuario` (`idusuario`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: actividades_economicas
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: arqueo
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: asientos_contables
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: categorias
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: clientes
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: compras
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: configuracion
# ------------------------------------------------------------

INSERT INTO
  `configuracion` (`id`, `clave`, `valor`)
VALUES
  (1, 'sistema_venta_por_lote', 'false');
INSERT INTO
  `configuracion` (`id`, `clave`, `valor`)
VALUES
  (12, 'venta_fecha_vencimiento', 'false');
INSERT INTO
  `configuracion` (`id`, `clave`, `valor`)
VALUES
  (89, 'selectedTemplate', 't2');
INSERT INTO
  `configuracion` (`id`, `clave`, `valor`)
VALUES
  (156, 'ventas_programadas', 'true');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: datos_bancarios
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: datos_transferencia_venta
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_actividades_economicas
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_cheque_venta_cobro
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_compra
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_pago_deuda_compra
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_pago_deuda_venta
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_producto
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_tarjeta_venta
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_tarjeta_venta_cobro
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_transferencia_cobro
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_transferencia_compra_pago
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalle_venta
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: detalles_cheques_compra_pago
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: deuda_compra
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: deuda_venta
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: egresos
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: facturadores
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: formas_pago
# ------------------------------------------------------------

INSERT INTO
  `formas_pago` (`idformapago`, `descripcion`, `deleted_at`)
VALUES
  (1, 'Efectivo', NULL);
INSERT INTO
  `formas_pago` (`idformapago`, `descripcion`, `deleted_at`)
VALUES
  (2, 'Transferencia Bancaria', NULL);
INSERT INTO
  `formas_pago` (`idformapago`, `descripcion`, `deleted_at`)
VALUES
  (3, 'Cheque', NULL);
INSERT INTO
  `formas_pago` (`idformapago`, `descripcion`, `deleted_at`)
VALUES
  (4, 'Tarjeta C/D', NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ingresos
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: libro_diario
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: movimiento_caja
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: producto_proveedor
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: productos
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: proveedor
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tipo_egreso
# ------------------------------------------------------------

INSERT INTO
  `tipo_egreso` (
    `idtipo_egreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    1,
    'Egresos Varios',
    '2025-07-29 21:12:13',
    '2025-07-29 23:43:01',
    NULL
  );
INSERT INTO
  `tipo_egreso` (
    `idtipo_egreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    2,
    'Pago de compras',
    '2025-07-29 23:46:22',
    '2025-07-29 23:46:22',
    NULL
  );
INSERT INTO
  `tipo_egreso` (
    `idtipo_egreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    3,
    'Egreso por ajuste',
    '2025-07-29 23:46:22',
    '2025-07-29 23:46:22',
    NULL
  );
INSERT INTO
  `tipo_egreso` (
    `idtipo_egreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    4,
    'Egreso extra',
    '2025-07-29 23:46:22',
    '2025-07-29 23:46:22',
    NULL
  );
INSERT INTO
  `tipo_egreso` (
    `idtipo_egreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    5,
    'Donación',
    '2025-07-29 23:46:22',
    '2025-07-29 23:46:22',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tipo_ingreso
# ------------------------------------------------------------

INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    1,
    'Ingresos Varios',
    '2025-07-13 00:13:16',
    '2025-07-13 00:13:16',
    NULL
  );
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    2,
    'Pago de deuda',
    '2025-07-26 16:18:01',
    NULL,
    NULL
  );
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    3,
    'Ingreso por ajuste',
    '2025-07-26 16:18:01',
    NULL,
    NULL
  );
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    4,
    'Ingreso extra',
    '2025-07-26 16:18:01',
    NULL,
    NULL
  );
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (5, 'Donación', '2025-07-26 16:18:01', NULL, NULL);
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (6, 'TestType', '2025-07-26 16:18:01', NULL, NULL);
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (7, 'TestType2', '2025-07-26 16:18:01', NULL, NULL);
INSERT INTO
  `tipo_ingreso` (
    `idtipo_ingreso`,
    `descripcion`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (8, 'test1', '2025-07-26 16:18:01', NULL, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuarios
# ------------------------------------------------------------

INSERT INTO
  `usuarios` (
    `idusuarios`,
    `nombre`,
    `apellido`,
    `telefono`,
    `acceso`,
    `login`,
    `password`,
    `estado`,
    `created_at`,
    `updated_at`,
    `deleted_at`
  )
VALUES
  (
    1,
    'Admin',
    'Admin',
    '9822222',
    'Administrador',
    'usuarioAdmin',
    '$2b$10$umv9ZWHw79d1SS21AhhJ0OqTKGPsWiUZ.ka5hqiCVJHtJHeAp99r6',
    'activo',
    '2025-07-31 17:49:10',
    '2025-07-31 17:49:10',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ventas
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ventas_programadas
# ------------------------------------------------------------


# ------------------------------------------------------------
# TRIGGER DUMP FOR: before_insert_clientes
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS before_insert_clientes;
DELIMITER ;;
CREATE TRIGGER `before_insert_clientes` BEFORE INSERT ON `clientes` FOR EACH ROW BEGIN
  SET NEW.nombre = UPPER(NEW.nombre);
  SET NEW.apellido = UPPER(NEW.apellido);
  SET NEW.direccion = UPPER(NEW.direccion);
  SET NEW.descripcion = UPPER(NEW.descripcion);
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: before_update_clientes
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS before_update_clientes;
DELIMITER ;;
CREATE TRIGGER `before_update_clientes` BEFORE UPDATE ON `clientes` FOR EACH ROW BEGIN
  SET NEW.nombre = UPPER(NEW.nombre);
  SET NEW.apellido = UPPER(NEW.apellido);
  SET NEW.direccion = UPPER(NEW.direccion);
  SET NEW.descripcion = UPPER(NEW.descripcion);
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: trg_anular_deuda_compra_despues_update
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_anular_deuda_compra_despues_update;
DELIMITER ;;
CREATE TRIGGER `trg_anular_deuda_compra_despues_update` AFTER UPDATE ON `compras` FOR EACH ROW BEGIN
  DECLARE v_iddeuda_compra INT;

  -- Solo si la compra fue marcada como eliminada y era de tipo crédito
  IF NEW.deleted_at IS NOT NULL AND OLD.tipo = 'credito' THEN

    -- Buscar la deuda relacionada
    SELECT iddeuda_compra INTO v_iddeuda_compra
    FROM deuda_compra
    WHERE idcompra = NEW.idcompra AND deleted_at IS NULL
    LIMIT 1;

    -- Si se encontró deuda, marcarla como eliminada y actualizar estado
    IF v_iddeuda_compra IS NOT NULL THEN
      UPDATE deuda_compra
      SET deleted_at = NOW(), estado = 'anulada'
      WHERE iddeuda_compra = v_iddeuda_compra;

      UPDATE detalle_pago_deuda_compra
      SET deleted_at = NOW()
      WHERE iddeuda_compra = v_iddeuda_compra AND deleted_at IS NULL;
    END IF;

  END IF;
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: detalle_compra_nombre_mayuscula
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS detalle_compra_nombre_mayuscula;
DELIMITER ;;
CREATE TRIGGER `detalle_compra_nombre_mayuscula` BEFORE INSERT ON `detalle_compra` FOR EACH ROW BEGIN
  SET NEW.nombre_producto = UPPER(NEW.nombre_producto);
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: detalle_compra_nombre_mayuscula_update
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS detalle_compra_nombre_mayuscula_update;
DELIMITER ;;
CREATE TRIGGER `detalle_compra_nombre_mayuscula_update` BEFORE UPDATE ON `detalle_compra` FOR EACH ROW BEGIN
  SET NEW.nombre_producto = UPPER(NEW.nombre_producto);
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: calcular_iva_detalle
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS calcular_iva_detalle;
DELIMITER ;;
CREATE TRIGGER `calcular_iva_detalle` BEFORE INSERT ON `detalle_venta` FOR EACH ROW BEGIN
  DECLARE tipo_iva INT;

  SELECT iva INTO tipo_iva
  FROM productos
  WHERE idproducto = NEW.idproducto;

  IF tipo_iva = 10 THEN
    SET NEW.iva10 = NEW.sub_total / 11;
    SET NEW.iva5 = 0;
  ELSEIF tipo_iva = 5 THEN
    SET NEW.iva5 = NEW.sub_total / 21;
    SET NEW.iva10 = 0;
  ELSE
    SET NEW.iva5 = 0;
    SET NEW.iva10 = 0;
  END IF;
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: actualizar_totaliva_ventas
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS actualizar_totaliva_ventas;
DELIMITER ;;
CREATE TRIGGER `actualizar_totaliva_ventas` AFTER INSERT ON `detalle_venta` FOR EACH ROW BEGIN
  UPDATE ventas
  SET iva5 = (SELECT IFNULL(SUM(iva5), 0)  FROM detalle_venta WHERE idventa = NEW.idventa),
      iva10 = (SELECT IFNULL(SUM(iva10), 0) FROM detalle_venta WHERE idventa = NEW.idventa),
      totaliva = (SELECT IFNULL(SUM(iva5 + iva10), 0) FROM detalle_venta WHERE idventa = NEW.idventa)
  WHERE idventa = NEW.idventa;
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: productos_before_insert
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS productos_before_insert;
DELIMITER ;;
CREATE TRIGGER `productos_before_insert` BEFORE INSERT ON `productos` FOR EACH ROW BEGIN
  SET NEW.nombre_producto = UPPER(NEW.nombre_producto);
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: productos_before_update
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS productos_before_update;
DELIMITER ;;
CREATE TRIGGER `productos_before_update` BEFORE UPDATE ON `productos` FOR EACH ROW BEGIN
  SET NEW.nombre_producto = UPPER(NEW.nombre_producto);
END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: set_hora_before_insert
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS set_hora_before_insert;
DELIMITER ;;
CREATE TRIGGER `set_hora_before_insert` BEFORE INSERT ON `ventas` FOR EACH ROW BEGIN
  SET NEW.hora = TIME(NOW());
END;;
DELIMITER ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
