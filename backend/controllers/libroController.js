const {Libro, Genero}= require('../models')
const libroController = {
    async obtenerTodos(req,res){
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 5;
            const offset = (pagina - 1) * limite;
            const libros = await Libro.findAll({
              include: ['genero'],
              limit: limite,
              offset: offset
            });
            res.json(libros);
        } catch (error) {
            res.status(500).json({error: 'Error al obtener los libros!'});
            
        }
    },
    async crear(req,res){
        try {
            const nuevoLibro = await Libro.create(req.body)
            const libroCompleto = await Libro.findByPk(nuevoLibro.id, {
                include: ['genero'] 
            });
            res.status(201).json(libroCompleto);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Este libro ya existe!' });
            }
            res.status(400).json({error: 'Error al crear el libro!'});
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