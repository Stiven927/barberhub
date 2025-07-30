const authRouter = require('./auth');

const clientiRouter = require('./clienti');
const prodottiRouter = require('./prodotti');
const prenotazioniRouter = require('./prenotazioni');
const ordiniRouter = require('./ordini');

function setRoutes(app) {
    app.get('/api', (req, res) => {
        res.send('Welcome to Barberhub API');
    });

    app.use('/api/auth', authRouter);

    app.use('/api/clienti', clientiRouter);
    app.use('/api/prodotti', prodottiRouter);
    app.use('/api/prenotazioni', prenotazioniRouter);
    app.use('/api/ordini', ordiniRouter);
}

module.exports = setRoutes;