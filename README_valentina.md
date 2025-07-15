# Proyecto: Mi biblioteca personal 

Este proyecto es una aplicacion construida con **React**, **Express**, **Sequelize**, **PostgreSQL** y **Docker**.

## BACKEND:
### Rutas creadas: 
**Libros:**
-GET/api/libros: Obtiene todos los libros con su genero
-POST/api/libros: Crea un nuevo libro
-PUT/api/libros/:id :Edita un libro existente
-DELETE/api/libros:id :Elimina un libro existente
-GET/api/libros:id :Obtiene un libro por ID

**Generos:**
-GET/api/generos: Obtiene todos los generos
-POST/api/generos: Crea un nuevo genero

**Middleware:**
Se creo un middleware que valida el cuerpo de las peticiones al crear o editar un libro

---
## BASE DE DATOS:
### Modelos:
**Libros:**
-titulo
-autor
-anio
-estadoLectur
-calificacion (opcional) (entre 1 y 5)
-pertenece a un genero

**Genero:**
-nombre
-tiene muchos libros

---
## FRONTEND:
### Funcionalidades implementadas:
-Ver la lista completa de libros
-Agregar un nuevo libro
-Editar un libro existente (con el mismo formulario de agregar)
-Eliminar un libro

### Filtros y extras:
-Filtro por genero
-Filtro por estado de lectura
-Crear nuevos generos desde el frontend
-Estilo personalizado

---
## ORGANIZACION DEL PROYECTO
**BackEnd**
-controllers/ : Controladores de libros y generos
-models/ : Modelos sequelize (libro.js, genero.js, index.js)
-middleware : Archivo validarLibro.js
-routes/ : Rutas para libros, generos y archivo index.js

**FrontEnd**
-components/generos/: FormularioGenero.jsx
-components/libros/ : inclute ListaLibros.jsx y 'FormularioLibros.jsx
-pages/ : Home.jsx
-styles/ : Archivos CSS separados


---
## COMO CORRER EL PROYECTO
1) Clonar el repositorio
2) Tener Docker instalado
3) Ejecutar: docker compose up --build
4) Acceder a:
**FrontEnd** 'http://localhost:3000'
**BackEnd(API)** 'http://localhost:3001/api'
**pgAdmin** 'http://localhost:5050'

Creado por Valentina Abarzua