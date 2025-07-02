// backend/models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

//Importamos los modelos
const Genero = require('./genero')(sequelize, Sequelize.DataTypes);
const Libro = require('./libro')(sequelize, Sequelize.DataTypes);
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
