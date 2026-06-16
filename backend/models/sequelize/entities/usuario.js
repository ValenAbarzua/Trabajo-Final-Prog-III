module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define("Usuario", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Usuario.associate = (models) => {
        Usuario.hasMany(models.Libro, {
            foreignKey: "usuarioId",
            as: "libros"
        });
    };
    return Usuario;
};