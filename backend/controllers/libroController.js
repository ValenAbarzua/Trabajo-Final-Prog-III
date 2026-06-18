const { ResultWithContextImpl } = require('express-validator/lib/chain');
const {Libro, Genero}= require('../models')
const libroController = {
    async obtenerTodos(req,res){
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 5;
            const offset = (pagina - 1) * limite;
            const { count, rows } = await Libro.findAndCountAll({
                where: { usuarioId: req.usuario.id},
              include: ['genero'],
              limit: limite,
              offset: offset
            });
            res.json({
                total: count,
                pagina,
                totalPaginas: Math.ceil(count / limite),
                libros: rows
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener los libros!'});
            
        }
    },
    async crear(req,res){
        try {
            console.log("Usuario:", req.usuario.id);
            console.log("Titulo:", req.body.titulo);
            console.log("Existe libro:", existeLibro);
            const existeLibro = await Libro.findOne({
                where: {
                    titulo: req.body.titulo,
                    usuarioId: req.usuario.id
                }
            });
            if (existeLibro) {
                return res.status(400).json({
                    error: 'Este libro ya existe!'
                });
            }
            const nuevoLibro = await Libro.create({
                ...req.body,
                usuarioId: req.usuario.id
            })
            const libroCompleto = await Libro.findByPk(nuevoLibro.id, {
                include: ['genero'] 
            });
            res.status(201).json(libroCompleto);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Este libro ya existe!' });
            }
            console.error("ERROR CREAR LIBRO: ", error);
            res.status(400).json({error: error.message});
        }
    },

    async ObtenerId(req, res){
        try {
            const libro = await Libro.findOne({
                where: {
                    id: req.params.id,
                    usuarioId: req.usuario.id
                }, include: ['genero']

            });
            if (!libro) return res.status(404).json({error: 'Libro no encontrado'});
            res.json(libro);
        }catch (error){
            res.status(500).json({ error: 'Error al buscar el libro' });
        }
    },

    async actualizar(req, res){
        try {
            const libro = await Libro.findOne({
                where: {
                    id: req.params.id,
                    usuarioId: req.usuario.id
                }});
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
            const libro = await Libro.findOne({
                where: {
                    id: req.params.id,
                    usuarioId: req.usuario.id
                }});
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