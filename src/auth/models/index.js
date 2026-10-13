'use strict';

// Reuse the shared database and User model.
const { db, users } = require('../../models');

module.exports = {
  db,
  users,
};
