// backend/models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

//Importamos los modelos
const Genero = require('./sequelize/entities/genero')(sequelize, Sequelize.DataTypes);
const Libro = require('./sequelize/entities/libro')(sequelize, Sequelize.DataTypes);
if (Genero.associate) Genero.associate({ Libro });
if (Libro.associate) Libro.associate({ Genero });

Genero.hasMany(Libro, {foreignkey: 'generoId'});
Libro.belongsTo(Genero, {foreignkey: 'generoId'});

module.exports = {
  sequelize,
  Sequelize,
  Genero,
  Libro
};
