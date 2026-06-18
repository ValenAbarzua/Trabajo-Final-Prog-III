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
            type: DataTypes.ENUM('leido', 'leyendo', 'por leer'),
            allowNull: false,
        },
        calificacion: { //opcional pero si o si dentro del rango 1-5
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 5,
            },
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })

    Libro.associate = function(models) {
        Libro.belongsTo(models.Genero, {
            foreignKey:{ 
                name: 'generoId',
                allowNull: false,
            },
            as: 'genero',
        })

        Libro.belongsTo(models.Usuario, { 
        foreignKey: "usuarioId",
        as: "usuario"
    })
    }


return Libro;
}

//Ejemplo de libro
//{
//  "titulo": "El senior de los anillos",
//  "autor": "J.R.R. Tolkien",
//  "anio": "1960",
//  "estadoLectura": "leyendo",
//  "calificacion": 5,
//  "generoId": 3
//}