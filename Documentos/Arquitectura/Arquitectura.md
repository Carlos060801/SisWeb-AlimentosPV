<img width="217" height="232" alt="Logo corhuila" src="https://github.com/user-attachments/assets/3dbf0b72-4c10-4f27-8004-7fa5954f41bb" />

# Arquitectura Aplicación del SisWeb-AlimentosPV 
## Stack Tecnológico 

**MYSQL** 
- Fiabilidad en la Construcción de la base de Datos y robustez
- Escalabilidad
- Características avanzadas.

**Java Spring Boot**
- Rapido y desarrollo
- Seguridad
- Soporte de la comunidad

**Angular:**
- Experiencia de usuario dinámico 
- Rendimiento 
- Ecosistema vibrante.

## Backend

## Descripción 
en Java. En este diseño, las entidades representa los modelos de datos de la aplicación, mientras que los datos se van manejando la transferencia de datos entre  el backend y el frontend.
## Patrones 
Un patron es una solución aprobada y generalizable para un problema recurrente en el diseño del software.
- Patron MVC (Modelo - Vista - Controlador): Este patron se refleja en la organización de los paquetes Controller, Servicios y Entity 
## Entidades y sus Datos
1. Usuarios.
id_usuario (PK)
nombre
rol (administrador, supermercado,frutería,organización social)
correo
contraseña
Se hace una relación de usuarios puede registrar productos, generar donaciones o administrar el sistema.
2. Productos
id_producto (PK)
nombre 
proveedor
fecha_registro
fecha_vencimiento
cantidad
estado (activo, vendido, donado, vencido)
-----------------------------------------------------------
👉 Relación: cada producto pertenece a un supermercado/frutería (usuario).
