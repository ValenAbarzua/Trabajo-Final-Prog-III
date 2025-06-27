module.exports= (sequelize, DataTypes) => {
    const Libro = sequelize.define('Libro', {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        autor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        anio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estadoLectura: {
            type: DataTypes.ENUM('leido, leyendo, por leer'),
            allowNull: false,
        },
        calificacion: { //opcional pero si o si dentro del rango 1-5
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 5,
            },
        },

    })

    Libro.associate = function(models) {
        Libro.belongsTo(models.Genero, {
            foreignKey: 'generoId',
            as: 'genero',
        })
    }

return Libro;
}