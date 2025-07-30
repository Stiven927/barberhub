const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Ordine = sequelize.define('Ordine', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clienteId: { type: DataTypes.INTEGER, allowNull: false },
  prodottoId: { type: DataTypes.INTEGER, allowNull: false },
  quantita: { type: DataTypes.INTEGER, allowNull: false },
  totale: { type: DataTypes.FLOAT, allowNull: false },
  pagato: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Ordine;
