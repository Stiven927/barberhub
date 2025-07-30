const express = require('express');
const router = express.Router();
const Prenotazione = require('../models/Prenotazione');

// Crea una nuova prenotazione
router.post('/', async (req, res) => {
  try {
    const { servizio, prezzo } = req.body;
    if (!servizio || typeof prezzo !== 'number') {
      return res.status(400).json({ error: 'Servizio e prezzo sono obbligatori' });
    }
    const prenotazione = await Prenotazione.create(req.body);
    res.status(201).json(prenotazione);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ottieni tutte le prenotazioni (con nome cliente)
const Cliente = require('../models/Cliente');
router.get('/', async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.findAll({
      include: [{ model: Cliente, attributes: ['nome'] }],
      order: [['data', 'ASC']]
    });
    // Restituisco anche orario, servizio, prezzo
    const result = prenotazioni.map(p => ({
      id: p.id,
      data: p.data,
      orario: p.data.toISOString().slice(11,16),
      clienteId: p.clienteId,
      nomeCliente: p.Cliente ? p.Cliente.nome : undefined,
      servizio: p.servizio,
      prezzo: p.prezzo,
      note: p.note
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni una prenotazione per ID
router.get('/:id', async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findByPk(req.params.id);
    if (!prenotazione) return res.status(404).json({ error: 'Prenotazione non trovata' });
    res.json(prenotazione);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiorna una prenotazione
router.put('/:id', async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findByPk(req.params.id);
    if (!prenotazione) return res.status(404).json({ error: 'Prenotazione non trovata' });
    await prenotazione.update(req.body);
    res.json(prenotazione);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Elimina una prenotazione
router.delete('/:id', async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findByPk(req.params.id);
    if (!prenotazione) return res.status(404).json({ error: 'Prenotazione non trovata' });
    await prenotazione.destroy();
    res.json({ message: 'Prenotazione eliminata' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
