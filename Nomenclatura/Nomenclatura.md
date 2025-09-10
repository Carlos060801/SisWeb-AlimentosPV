Politica de Nomenclatura
----------------------------------------------
📐 Política de Nomenclatura para Bases de Datos
1. Generalidades

* Se usará minúsculas para todos los nombres.

* Las palabras se separarán con guion bajo (snake_case).
* Ejemplo: fecha_vencimiento, id_usuario.

* Los nombres deben ser descriptivos y claros, evitando abreviaturas innecesarias.

* El idioma oficial será español para coherencia con el proyecto.

2. Tablas

* Los nombres de tablas estarán en singular.
* Ejemplo: usuario, producto, donacion.

* Cuando se trate de tablas de relación (muchos a muchos), se concatenarán los nombres de las entidades relacionadas, separados por guion bajo.
* Ejemplo: producto_organizacion.

3. Columnas

* Las claves primarias tendrán el prefijo id_ seguido del nombre de la entidad.
* Ejemplo: id_usuario, id_producto.

* Las claves foráneas tendrán el mismo nombre que la clave primaria a la que hacen referencia.
* Ejemplo: en donacion, la FK hacia usuario será id_usuario.

* Los campos booleanos se nombrarán con prefijos es_, tiene_ o activo_.
* Ejemplo: es_activo, tiene_alerta.

* Los campos de fecha deberán comenzar con el prefijo fecha_.
* Ejemplo: fecha_registro, fecha_donacion.

4. Índices y restricciones

* Los índices tendrán el prefijo idx_ seguido del nombre de la tabla y columna(s).
* Ejemplo: idx_producto_fecha_vencimiento.

* Las claves foráneas tendrán el prefijo fk_ seguido de tabla_origen_tabla_destino.
* Ejemplo: fk_producto_usuario.

* Las claves únicas tendrán el prefijo uk_ seguido del nombre de la tabla y columna(s).
* Ejemplo: uk_usuario_correo.

5. Vistas

* Las vistas tendrán el prefijo vw_ seguido de un nombre descriptivo.
* Ejemplo: vw_productos_proximos_vencer.

6. Procedimientos y funciones

* Los procedimientos almacenados se nombrarán con el prefijo sp_.
* Ejemplo: sp_registrar_donacion.

* Las funciones se nombrarán con el prefijo fn_.
* Ejemplo: fn_calcular_dias_restantes.

7. Buenas prácticas adicionales

* Evitar usar palabras reservadas del motor de base de datos (ej. user, order).

* Limitar la longitud de los nombres a un máximo de 30 caracteres.

* Documentar cada tabla y columna con un comentario que explique su propósito.
--------------------------------------------------------------------------------
⚙️ Política de Nomenclatura – Backend (Spring Boot)
1. Generalidades

Todo el código debe estar en inglés (buena práctica internacional).

Se usará CamelCase (primera palabra en minúscula, las siguientes con inicial mayúscula) para variables y métodos.

Para clases e interfaces se usará PascalCase (cada palabra empieza en mayúscula).

Los nombres deben ser descriptivos y claros, evitar abreviaturas poco comunes.

2. Paquetes

Los paquetes se escribirán en minúsculas.


3. Clases

Nombres en PascalCase.

Sufijos recomendados según capa:

Entidad: Usuario, Producto, Donacion

DTO: UsuarioDTO, ProductoDTO

Repositorio: UsuarioRepository

Servicio: UsuarioService, ProductoService

Implementación de servicio: UsuarioServiceImpl

Controlador: UsuarioController

Ejemplo:

public class ProductoController { ... }
