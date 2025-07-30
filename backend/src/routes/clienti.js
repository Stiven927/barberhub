const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Crea un nuovo cliente
router.post('/', async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ottieni tutti i clienti
router.get('/', async (req, res) => {
  try {
    const clienti = await Cliente.findAll();
    res.json(clienti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni un cliente per ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente non trovato' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna un cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente non trovato' });
    await cliente.update(req.body);
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Elimina un cliente
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente non trovato' });
    await cliente.destroy();
    res.json({ message: 'Cliente eliminato' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
