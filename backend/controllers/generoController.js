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

    async crear(req, res) {
    try {
        const nombre = req.body.nombre.trim();
        const existente = await Genero.findOne({
        where: {
            nombre,
            usuarioId: req.usuario.id
        }
        });

        if (existente) {
        return res.status(400).json({ error: "Este genero ya existe!" });
        }

        const nuevoGenero = await Genero.create({
        nombre,
        usuarioId: req.usuario.id
        });
        res.status(201).json(nuevoGenero);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error al crear el genero" });
    }
    },


    async editar(req, res) {
        try{
            const genero = await Genero.findOne({
                where: {id: req.params.id, usuarioId: req.usuario.id}
            });
            if (!genero) return res.status(404).json({ error: 'Genero no encontrado' });
            genero.nombre = req.body.nombre
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