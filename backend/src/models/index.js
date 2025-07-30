const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('barberhub_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = { sequelize };
