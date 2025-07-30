const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Utente = sequelize.define('Utente', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  nome: { type: DataTypes.STRING },
  ruolo: { type: DataTypes.STRING, defaultValue: 'cliente' } // cliente o admin
});

module.exports = Utente;
