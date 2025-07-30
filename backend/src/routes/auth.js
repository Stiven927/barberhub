const express = require('express');
const router = express.Router();
const Utente = require('../models/Utente');
const bcrypt = require('bcryptjs');

const Cliente = require('../models/Cliente');
// Registrazione
router.post('/register', async (req, res) => {
  try {
    const { email, password, nome } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const utente = await Utente.create({ email, password: hash, nome });
    // Crea anche il cliente associato
    const cliente = await Cliente.create({ nome: nome || 'Cliente', email });
    res.status(201).json({ id: utente.id, email: utente.email, nome: utente.nome, clienteId: cliente.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const utente = await Utente.findOne({ where: { email } });
    if (!utente) return res.status(401).json({ error: 'Credenziali non valide' });
    const valid = await bcrypt.compare(password, utente.password);
    if (!valid) return res.status(401).json({ error: 'Credenziali non valide' });
    // Trova anche il cliente associato
    const cliente = await Cliente.findOne({ where: { email } });
    // Semplice sessione lato client (no JWT per semplicità)
    res.json({ id: utente.id, email: utente.email, nome: utente.nome, ruolo: utente.ruolo, clienteId: cliente ? cliente.id : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
