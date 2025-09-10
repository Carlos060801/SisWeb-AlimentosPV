-- ==============================
-- REINICIAR BASE DE DATOS
-- ==============================
DROP DATABASE IF EXISTS proyectodistribuidos;
CREATE DATABASE proyectodistribuidos;
USE proyectodistribuidos;

-- ==============================
-- TABLA DE USUARIOS
-- ==============================
DROP TABLE IF EXISTS Usuarios;
CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(300) NOT NULL,
  correo VARCHAR(250) UNIQUE NOT NULL,
  contrasena VARCHAR(250) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  estado_cuenta VARCHAR(20) DEFAULT 'activo'
);

-- ==============================
-- TABLA DE PRODUCTOS
-- ==============================
DROP TABLE IF EXISTS Productos;
CREATE TABLE Productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  cantidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- TABLA DE INVENTARIOS
-- ==============================
DROP TABLE IF EXISTS Inventarios;
CREATE TABLE Inventarios (
  id_inventario INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  stock INT NOT NULL,
  ubicacion VARCHAR(150),
  ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- ==============================
-- TABLA DE PEDIDOS
-- ==============================
DROP TABLE IF EXISTS Pedidos;
CREATE TABLE Pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'pendiente',
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- ==============================
-- TABLA DE DETALLE DE PEDIDOS
-- ==============================
DROP TABLE IF EXISTS Detalle_Pedidos;
CREATE TABLE Detalle_Pedidos (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
