
import React, { useState } from 'react';

const Contattaci = () => {
  const [form, setForm] = useState({ nome: '', email: '', messaggio: '' });
  const [inviato, setInviato] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validazione base
    if (!form.nome.trim() || !form.email.trim() || !form.messaggio.trim()) {
      setError('Compila tutti i campi.');
      return;
    }
    // Email semplice
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Inserisci una email valida.');
      return;
    }
    setInviato(true);
    setForm({ nome: '', email: '', messaggio: '' });
    setError('');
  };

  return (
    <div className="container" style={{maxWidth:600, marginTop:32, marginBottom:32}}>
      <h2 className="mb-3" style={{color:'#0d1a4a'}}>Contattaci</h2>
      <p className="mb-4">Compila il modulo oppure scrivici a <a href="mailto:info@barberhub.it">info@barberhub.it</a> o chiamaci al <b>+39 327 1971103</b>.</p>
      {inviato && <div className="alert alert-success py-2">Messaggio inviato! Ti risponderemo al più presto.</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form className="card p-3 shadow-sm mb-4" onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" className="form-control" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Messaggio</label>
          <textarea className="form-control" name="messaggio" rows="4" value={form.messaggio} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Invia</button>
      </form>
      <div className="text-muted small">
        <b>BarberHub</b> &mdash; Via dei Barbieri 1, ALTAMURA &middot; P.IVA 12345678901
      </div>
    </div>
  );
};

export default Contattaci;
