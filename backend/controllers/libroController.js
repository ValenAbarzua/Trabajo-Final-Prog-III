const {Libro, Genero}= require('../models')
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
    },

    async ObtenerId(req, res){
        try {
            const libro = await Libro.findByPk(req.params.id, {include: ['genero']});
            if (!libro) return res.status(404).json({error: 'Libro no encontrado'});
            res.json(libro);
        }catch (error){
            res.status(500).json({ error: 'Error al buscar el libro' });
        }
    },

    async actualizar(req, res){
        try {
            const libro = await Libro.findByPk(req.params.id);
            if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
            await libro.update(req.body);
            res.json(libro);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Error al actualizar el libro' });
        }
    },

    async eliminar(req, res) {
        try {
            const libro = await Libro.findByPk(req.params.id);
            if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
            await libro.destroy();
            res.json({ mensaje: 'Libro eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar el libro' });
        }
    }
}
module.exports = libroController;