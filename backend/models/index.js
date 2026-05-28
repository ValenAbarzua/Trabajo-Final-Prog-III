// backend/models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
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

Genero.hasMany(Libro, {foreignKey: 'generoId'});
Libro.belongsTo(Genero, {foreignKey: 'generoId'});

module.exports = {
  sequelize,
  Sequelize,
  Genero,
  Libro
};
