const {Libro}= require('../models')
const libroController = {
    async obtenerTodos(req,res){
        try {
            const libros = await Libro.findAll()
            res.json(libros);
        } catch (error) {
            res.status(500).json({error: 'Error al obtener los libros'});
            
        }
    },

    async crear(req,res){
        try {
            console.log("BODY RECIBIDO:", req.body); // PARA VER EL ERROR
            const nuevoLibro = await Libro.create(req.body)
            const libroCompleto = await Libro.findByPk(nuevoLibro.id, {
                include: ['genero'] // alias definido en libro.js
            });
            res.status(201).json(libroCompleto);
        } catch (error) {
            console.error("Error en crear el libro",error);
            res.status(400).json({error: error.message});
            
        }
    }
}
module.exports = libroController;