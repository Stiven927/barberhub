const express = require('express');
const router = express.Router();
const Prodotto = require('../models/Prodotto');
// Elimina tutti i prodotti
router.delete('/all', async (req, res) => {
  try {
    await Prodotto.destroy({ where: {} });
    res.json({ message: 'Tutti i prodotti sono stati eliminati.' });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la cancellazione dei prodotti.' });
  }
});

// Crea un nuovo prodotto
router.post('/', async (req, res) => {
  try {
    const prodotto = await Prodotto.create(req.body);
    res.status(201).json(prodotto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ottieni tutti i prodotti
router.get('/', async (req, res) => {
  try {
    const prodotti = await Prodotto.findAll();
    res.json(prodotti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni un prodotto per ID
router.get('/:id', async (req, res) => {
  try {
    const prodotto = await Prodotto.findByPk(req.params.id);
    if (!prodotto) return res.status(404).json({ error: 'Prodotto non trovato' });
    res.json(prodotto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna un prodotto
router.put('/:id', async (req, res) => {
  try {
    const prodotto = await Prodotto.findByPk(req.params.id);
    if (!prodotto) return res.status(404).json({ error: 'Prodotto non trovato' });
    await prodotto.update(req.body);
    res.json(prodotto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Elimina un prodotto
router.delete('/:id', async (req, res) => {
  try {
    const prodotto = await Prodotto.findByPk(req.params.id);
    if (!prodotto) return res.status(404).json({ error: 'Prodotto non trovato' });
    await prodotto.destroy();
    res.json({ message: 'Prodotto eliminato' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
