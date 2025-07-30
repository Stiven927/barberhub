const Cliente = require('./Cliente');
const Prodotto = require('./Prodotto');
const Prenotazione = require('./Prenotazione');
const Ordine = require('./Ordine');
const Utente = require('./Utente');

// Associazioni
Cliente.hasMany(Prenotazione, { foreignKey: 'clienteId' });
Prenotazione.belongsTo(Cliente, { foreignKey: 'clienteId' });

Cliente.hasMany(Ordine, { foreignKey: 'clienteId' });
Ordine.belongsTo(Cliente, { foreignKey: 'clienteId' });

Prodotto.hasMany(Ordine, { foreignKey: 'prodottoId' });
Ordine.belongsTo(Prodotto, { foreignKey: 'prodottoId' });

module.exports = { Cliente, Prodotto, Prenotazione, Ordine, Utente };
