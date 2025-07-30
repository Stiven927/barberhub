const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Prodotto = sequelize.define('Prodotto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  prezzo: { type: DataTypes.FLOAT, allowNull: false },
  descrizione: { type: DataTypes.STRING },
  disponibilita: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Prodotto;
