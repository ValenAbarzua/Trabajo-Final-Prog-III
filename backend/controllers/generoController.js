const {Genero}= require('../models')
const generoController = {
    async obtenerTodos(req,res){
        try {
            const generos = await Genero.findAll()
            res.json(generos);
        } catch (error) {
            res.status(500).json({error: 'Error al obtener los generos'});
            
        }
    },

    async crear(req,res){
        try {
            const nuevoGenero = await Genero.create(req.body)
            res.status(201).json(nuevoGenero);
        } catch (error) {
            res.status(400).json({error: 'Error al crear el genero'});
            
        }
    },

    async editar(req, res) {
        try{
            const genero = await Genero.findByPk(req.params.id);
            if (!genero) return res.status(404).json({ error: 'Genero no encontrado' });
            await genero.update(req.body);
            res.json(genero);
        } catch (error) {
            res.status(400).json({error: 'Error al editar el genero'});
        }

    },

    async eliminar(req,res) {
        try{
            const genero = await Genero.findByPk(req.params.id);
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