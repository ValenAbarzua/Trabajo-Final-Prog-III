const {Genero}= require('../models')

const generoController = {
    async obtenerTodos(req,res){
        try {
            const generos = await Genero.findAll({
                where: {
                usuarioId: req.usuario.id}
            });
            res.json(generos);
        } catch (error) {
            res.status(500).json({error: 'Error al obtener los generos'});
            
        }
    },

    async crear(req,res){
        try {
            const nuevoGenero = await Genero.create({
                nombre: req.body.nombre,
                usuarioId: req.usuario.id
            });
            res.status(201).json(nuevoGenero);
        } catch (error) {
            res.status(400).json({error: 'Error al crear el genero'});
            
        }
    },

    async editar(req, res) {
        try{
            const genero = await Genero.findOne({
                where: {id: req.params.id, usuarioId: req.usuario.id}
            });
            if (!genero) return res.status(404).json({ error: 'Genero no encontrado' });
            await genero.save();
            res.json(genero);
        } catch (error) {
            res.status(400).json({error: 'Error al editar el genero'});
        }

    },

    async eliminar(req,res) {
        try{
            const genero = await Genero.findOne({
                where: { id: req.params.id, usuarioId: req.usuario.id}
            });
            if (!genero) return res.status(404).json({ error: 'Genero no encontrado' });
            await genero.destroy();
            res.json({ message: 'Genero eliminado' });
        } 
        catch{
            res.status(400).json({error: 'Error al eliminar el genero!'});
        }
    }
}
module.exports = generoController;