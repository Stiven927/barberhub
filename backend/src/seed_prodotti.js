const Prodotto = require('./models/Prodotto');
const { sequelize } = require('./models');

const prodotti = [
  {
    nome: 'Shampoo Barba Deluxe',
    prezzo: 12.90,
    descrizione: 'Shampoo delicato per la pulizia quotidiana della barba.',
    disponibilita: 30
  },
  {
    nome: 'Olio Barba Nutriente',
    prezzo: 15.50,
    descrizione: 'Olio nutriente per ammorbidire e profumare la barba.',
    disponibilita: 25
  },
  {
    nome: 'Cera Modellante Capelli',
    prezzo: 10.00,
    descrizione: 'Cera professionale per uno styling perfetto e duraturo.',
    disponibilita: 40
  },
  {
    nome: 'Balsamo Dopobarba',
    prezzo: 9.90,
    descrizione: 'Balsamo lenitivo per una pelle morbida dopo la rasatura.',
    disponibilita: 35
  },
  {
    nome: 'Pettine in Legno',
    prezzo: 7.50,
    descrizione: 'Pettine antistatico in legno naturale per barba e capelli.',
    disponibilita: 50
  },
  {
    nome: 'Schiuma da Barba Classica',
    prezzo: 8.90,
    descrizione: 'Schiuma ricca e cremosa per una rasatura confortevole.',
    disponibilita: 20
  },
  {
    nome: 'Spazzola Barba Professionale',
    prezzo: 13.00,
    descrizione: 'Spazzola con setole naturali per una barba ordinata.',
    disponibilita: 18
  },
  {
    nome: 'Gel Fissativo Forte',
    prezzo: 11.00,
    descrizione: 'Gel a tenuta forte per capelli sempre in ordine.',
    disponibilita: 28
  },
  {
    nome: 'Lozione Rinfrescante',
    prezzo: 14.00,
    descrizione: 'Lozione rinfrescante per viso e cuoio capelluto.',
    disponibilita: 22
  },
  {
    nome: 'Kit Cura Barba Completo',
    prezzo: 29.90,
    descrizione: 'Kit completo con shampoo, olio e balsamo per la barba.',
    disponibilita: 10
  }
];

async function seed() {
  try {
    await sequelize.sync();
    await Prodotto.destroy({ where: {} });
    await Prodotto.bulkCreate(prodotti);
    console.log('Prodotti inseriti con successo!');
    process.exit();
  } catch (err) {
    console.error('Errore nel seeding:', err);
    process.exit(1);
  }
}

seed();
