const sequelize = require("sequelize");

//Creamos la tabla del genero de los libros
module.exports = (sequelize, DataTypes) => {
    const Genero= sequelize.define('Genero', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false, //el string es obligatorio
        }
    })

    //relacion entre el genero y los libros (un genero puede tener muchos libros)
    Genero.associate = function(models){
        Genero.hasMany(models.Libro, {
            foreignKey: 'generoId',
            as: 'libros'
        })
    }

return Genero;
}