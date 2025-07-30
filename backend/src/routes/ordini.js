const express = require('express');
const router = express.Router();
const Ordine = require('../models/Ordine');
const Cliente = require('../models/Cliente');
const Prodotto = require('../models/Prodotto');

// Crea un nuovo ordine
router.post('/', async (req, res) => {
  try {
    let { clienteId, prodottoId, quantita, totale } = req.body;
    const prodotto = await Prodotto.findByPk(prodottoId);
    if (!prodotto) return res.status(400).json({ error: 'Prodotto non trovato' });
    if (prodotto.disponibilita < quantita) {
      return res.status(400).json({ error: 'Prodotto non disponibile in quantità richiesta' });
    }
    if (!totale) {
      totale = prodotto.prezzo * quantita;
    }
    // Log prima dello scaling
    console.log(`[ORDINE] Disponibilità prima: ${prodotto.disponibilita}, acquisto: ${quantita}`);
    prodotto.disponibilita = prodotto.disponibilita - quantita;
    await prodotto.save();
    // Log dopo il salvataggio
    const prodottoAggiornato = await Prodotto.findByPk(prodottoId);
    console.log(`[ORDINE] Disponibilità dopo: ${prodottoAggiornato.disponibilita}`);
    const ordine = await Ordine.create({ clienteId, prodottoId, quantita, totale });
    res.status(201).json(ordine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ottieni tutti gli ordini (con nome cliente e prodotto)
router.get('/', async (req, res) => {
  try {
    const ordini = await Ordine.findAll({
      include: [
        { model: Cliente, attributes: ['nome', 'email'] },
        { model: Prodotto, attributes: ['nome'] }
      ]
    });
    res.json(ordini);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni un ordine per ID
router.get('/:id', async (req, res) => {
  try {
    const ordine = await Ordine.findByPk(req.params.id);
    if (!ordine) return res.status(404).json({ error: 'Ordine non trovato' });
    res.json(ordine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna un ordine
router.put('/:id', async (req, res) => {
  try {
    const ordine = await Ordine.findByPk(req.params.id);
    if (!ordine) return res.status(404).json({ error: 'Ordine non trovato' });
    await ordine.update(req.body);
    res.json(ordine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Elimina un ordine
router.delete('/:id', async (req, res) => {
  try {
    const ordine = await Ordine.findByPk(req.params.id);
    if (!ordine) return res.status(404).json({ error: 'Ordine non trovato' });
    await ordine.destroy();
    res.json({ message: 'Ordine eliminato' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
