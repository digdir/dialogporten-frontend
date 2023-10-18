// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

import { Sequelize } from 'sequelize-typescript';
import PersonModel from './Person.model';
import FamilyModel from './Family.model';

const database = process.env.DATABASE_NAME ?? '';
const username = process.env.DATABASE_USERNAME ?? 'root';
const password = process.env.DATABASE_PASSWORD ?? 'root';
const host = process.env.DATABASE_HOST ?? 'localhost';
const dialect = process.env.DATABASE_DIALECT ?? 'mysql';

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.family = FamilyModel(sequelize, Sequelize);
db.person = PersonModel(sequelize, Sequelize);

db.family.hasMany(db.person, { onDelete: 'CASCADE' });
db.person.belongsTo(db.family);

export default db;
