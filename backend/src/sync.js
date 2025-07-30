const { sequelize } = require('./models');
require('./models/associations');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tabelle sincronizzate con il database!');
    process.exit();
  })
  .catch((err) => {
    console.error('Errore nella sincronizzazione:', err);
    process.exit(1);
  });
