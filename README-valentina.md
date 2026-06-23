# 📚 Mi Biblioteca Personal

## Autora

**Valentina Abarzua**
Tecnicatura Universitaria en Programación
Universidad Tecnológica Nacional (UTN)

Trabajo Final de **Programación III**

---

# Descripción del proyecto

Mi Biblioteca Personal es una aplicación web Full Stack desarrollada como trabajo final de la materia Programacion III.

La aplicacion permite a cada usuario gestionar su propia biblioteca digital de manera privada e independiente, registrando libros, organizandolos por genero y realizando un seguimiento de lectura.

El sistema fue desarrollado utilizando React para el frontend, Node.js con Express para el backend, Sequelize como ORM y PostgreSQL como base de datos.

---

# Objetivos del proyecto

* Aplicar arquitectura cliente-servidor.
* Implementar una API REST.
* Utilizar una base de datos relacional.
* Implementar autenticación mediante JWT.
* Gestionar relaciones entre entidades.
* Consumir APIs desde React.
* Realizar despliegue completo de la aplicación.

---

# Tecnologias utilizadas

## Frontend

* React
* JavaScript
* Fetch API
* CSS
* Vercel

## Backend

* Node.js
* Express
* Sequelize ORM
* JWT (JSON Web Token)
* bcrypt
* cookie-parser

## Base de datos

* PostgreSQL

## Deploy

* Frontend: Vercel
* Backend: Render
* Base de datos: PostgreSQL en Render

---

# Arquitectura del proyecto

La aplicación se divide en dos partes:

## Frontend

Responsable de:

* Interfaz de usuario.
* Formularios.
* Gestión de estados.
* Consumo de la API.
* Manejo de autenticación.

## Backend

Responsable de:

* Logica de negocio.
* Validaciones.
* Seguridad.
* Gestion de usuarios.
* Gestion de libros.
* Gestion de géneros.
* Conexion con PostgreSQL.

---

# Gestión de usuarios

## Registro de usuario

Los usuarios pueden registrarse ingresando:

* Nombre
* Email
* Contraseña

Las contraseñas son almacenadas utilizando bcrypt para evitar guardar texto plano en la base de datos.

---

## Inicio de sesión

Los usuarios pueden autenticarse mediante email y contraseña.

Al iniciar sesión correctamente se generan:

* Access Token
* Refresh Token

Además se devuelve la información básica del usuario autenticado.

---

# Sistema de autenticación JWT

Se implementó autenticación basada en tokens.

## Access Token

Permite acceder a los endpoints protegidos.

Características:

* Generado al iniciar sesión.
* Incluye información del usuario.
* Posee tiempo de expiración.

---

## Refresh Token

Permite renovar automáticamente el Access Token cuando expira.

Características:

* Se almacena en una cookie HttpOnly.
* Tiene mayor duración que el Access Token.
* Evita que el usuario tenga que iniciar sesión constantemente.

---

## Renovación automática de sesión

Cuando una petición devuelve:

```http
401 Unauthorized
```

El frontend:

1. Solicita un nuevo token al endpoint `/usuarios/refresh`.
2. Recibe un nuevo Access Token.
3. Reintenta automáticamente la petición original.

De esta manera la sesión continúa funcionando sin intervención del usuario.

---

# Gestión de libros

Cada usuario administra únicamente sus propios libros.

## Crear libro

Permite registrar:

* Título
* Autor
* Año
* Estado de lectura
* Género
* Calificación (opcional)

---

## Editar libro

Permite modificar cualquier información previamente registrada.

---

## Eliminar libro

Permite eliminar libros existentes de la biblioteca.

---

## Estados de lectura

Los libros pueden clasificarse como:

* Por leer
* Leyendo
* Leido

---

# Validaciones implementadas

## Libros duplicados

Se implementó una validación personalizada para evitar que un mismo usuario cargue dos veces un libro con el mismo título.

## Validación de autenticación

Los endpoints protegidos requieren un token válido.

Si el token no existe o es inválido:

```http
401 Unauthorized
```

---

# Gestión de géneros

Cada usuario dispone de sus propios géneros.

Los géneros creados por un usuario no son visibles para otros usuarios.

---

## Crear género

Permite agregar nuevos géneros personalizados.

---

## Editar género

Permite modificar géneros existentes.

---

## Eliminar género

Permite eliminar géneros registrados.

---

# Relaciones entre entidades

## Usuario → Libros

Un usuario puede tener múltiples libros.

Relación:

* Usuario hasMany Libros
* Libro belongsTo Usuario

---

## Usuario → Géneros

Un usuario puede tener múltiples géneros.

Relación:

* Usuario hasMany Géneros
* Género belongsTo Usuario

---

## Género → Libros

Un género puede contener múltiples libros.

Relación:

* Género hasMany Libros
* Libro belongsTo Género

---

# Paginación

La API implementa paginación para optimizar el acceso a los datos.

El frontend permite navegar mediante:

* Página anterior
* Página siguiente

---

# Interfaz de usuario

La aplicación cuenta con una interfaz simple e intuitiva.

## Pantalla de Login

Permite:

* Iniciar sesión.
* Acceder al sistema mediante autenticación.
* Poder registrarse en el caso de no estar registrado.

---

## Biblioteca Personal

Luego de autenticarse, el usuario visualiza:

* Nombre del usuario.
* Menú principal.
* Gestión de sus libros.
* Gestión de sus géneros.

---

## Navegación por vistas

Se implementó un menú que permite alternar entre:

* Libros
* Géneros

---

# Seguridad implementada

* Contraseñas cifradas con bcrypt.
* Autenticación mediante JWT.
* Middleware de autorización.
* Access Tokens con expiración.
* Refresh Tokens mediante cookies HttpOnly.
* Protección CORS.
* Validación de usuarios autenticados.
* Restricción de acceso a recursos propios.

---

# Base de datos

## Tabla Usuarios

| Campo    | Tipo    |
| -------- | ------- |
| id       | INTEGER |
| nombre   | STRING  |
| email    | STRING  |
| password | STRING  |

---

## Tabla Géneros

| Campo     | Tipo    |
| --------- | ------- |
| id        | INTEGER |
| nombre    | STRING  |
| usuarioId | INTEGER |

---

## Tabla Libros

| Campo         | Tipo    |
| ------------- | ------- |
| id            | INTEGER |
| titulo        | STRING  |
| autor         | STRING  |
| anio          | STRING  |
| estadoLectura | ENUM    |
| calificacion  | INTEGER |
| generoId      | INTEGER |
| usuarioId     | INTEGER |

---

# Despliegue

## Frontend

Desplegado en Vercel.

## Backend

Desplegado en Render.

## Base de datos

PostgreSQL desplegado en Render.

---

# Aprendizajes obtenidos

Durante el desarrollo de este proyecto se trabajó con:

* React.
* Node.js.
* Express.
* PostgreSQL.
* Sequelize.
* Relaciones entre tablas.
* JWT.
* Refresh Tokens.
* Middleware.
* Autenticación.
* Consumo de APIs REST.
* Deploy de aplicaciones Full Stack.
* Seguridad básica en aplicaciones web.

---

# Estado actual

Proyecto funcional que permite:

* Registro de usuarios.
* Inicio de sesión.
* Renovación automática de tokens.
* Gestión de libros.
* Gestión de géneros.
* Asociación de datos por usuario.
* Persistencia en PostgreSQL.
* Despliegue completo en producción.

# Enlaces del proyecto

* Frontend:
https://trabajo-final-prog-iii.vercel.app

* Backend:
https://trabajo-final-prog-iii.onrender.com/api/health