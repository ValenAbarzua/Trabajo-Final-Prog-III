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
    }
}
module.exports = generoController;