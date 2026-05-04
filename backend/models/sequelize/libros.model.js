const {Libro, Genero}= require('..')
class LibroModel {
    obtenerTodos(){
        const libros =  Libro.findAll({
                include: {
                    model: Genero,
                    as: 'genero',
                }
            })
            return libros;
     
    }
}
module.exports = new LibroModel();