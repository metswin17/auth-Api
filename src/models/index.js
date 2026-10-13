'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const clothesModel = require('./clothes/model.js');
const foodModel = require('./food/model.js');
const Collection = require('./data-collection.js');
const userModel = require('../auth/models/users.js');

const environment = process.env.NODE_ENV;
const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:./auth-api.sqlite';
const testOrProduction = (environment === 'test' || environment === 'production');

const sequelize = environment === 'test'
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    })
  : new Sequelize(
      DATABASE_URL,
      testOrProduction ? { logging: false } : {}
    );

const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  food: new Collection(food),
  clothes: new Collection(clothes),
  users,
};