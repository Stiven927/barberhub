
require('./models/associations');
const Utente = require('./models/Utente');
const Cliente = require('./models/Cliente');
const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    await sequelize.sync({ force: true });
    // Elimina eventuale utente e cliente admin esistenti
    await Utente.destroy({ where: { email: 'admin@barberhub' } });
    await Cliente.destroy({ where: { email: 'admin@barberhub' } });
    // Crea cliente
    const cliente = await Cliente.create({ nome: 'Admin', email: 'admin@barberhub' });
    // Crea utente admin
    const hash = await bcrypt.hash('admin', 10);
    await Utente.create({
      email: 'admin@barberhub',
      password: hash,
      nome: 'Admin',
      ruolo: 'admin'
    });
    console.log('Utente admin e cliente associato creati!');
    process.exit();
  } catch (err) {
    console.error('Errore nel seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
