const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');


const Prenotazione = sequelize.define('Prenotazione', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data: { type: DataTypes.DATE, allowNull: false },
  clienteId: { type: DataTypes.INTEGER, allowNull: false },
  servizio: { type: DataTypes.STRING, allowNull: false },
  prezzo: { type: DataTypes.FLOAT, allowNull: false },
  note: { type: DataTypes.STRING },
});

module.exports = Prenotazione;
