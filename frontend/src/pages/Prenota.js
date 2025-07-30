import React, { useState } from 'react';
import BookingCalendar from '../components/BookingCalendar';

const servizi = [
  { nome: 'Taglio', prezzo: 15 },
  { nome: 'Taglio+Shampoo', prezzo: 20 },
  { nome: 'Barba', prezzo: 10 },
  { nome: 'Tinta', prezzo: 25 }
];

const Prenota = ({ utente }) => {
  const [selezione, setSelezione] = useState(null);
  const [servizio, setServizio] = useState(servizi[0].nome);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (data, orario) => {
    setSelezione({ data, orario });
    setMsg('');
  };

  const getPrezzo = () => servizi.find(s => s.nome === servizio)?.prezzo || 0;

  const handlePrenota = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const body = {
        data: `${selezione.data}T${selezione.orario}:00`,
        clienteId: utente.clienteId || utente.id,
        servizio,
        prezzo: getPrezzo(),
        note
      };
      const res = await fetch('http://localhost:5200/api/prenotazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setMsg('Prenotazione effettuata con successo!');
        setSelezione(null);
        setNote('');
        setServizio(servizi[0].nome);
      } else {
        const data = await res.json();
        setMsg(data.error || 'Errore nella prenotazione');
      }
    } catch {
      setMsg('Errore di rete');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Prenota un appuntamento</h2>
      <BookingCalendar onSelect={handleSelect} />
      {selezione && (
        <form className="card p-3 shadow-sm mb-4" onSubmit={handlePrenota} style={{maxWidth:500}}>
          <div className="mb-2">
            <b>Data:</b> {selezione.data} <b>Orario:</b> {selezione.orario}
          </div>
          <div className="mb-2">
            <label className="form-label">Servizio</label>
            <select className="form-select" value={servizio} onChange={e => setServizio(e.target.value)}>
              {servizi.map(s => (
                <option key={s.nome} value={s.nome}>{s.nome} ({s.prezzo}€)</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <b>Prezzo:</b> {getPrezzo()}€
          </div>
          <div className="mb-2">
            <textarea className="form-control" placeholder="Note (opzionale)" value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Prenotazione...' : 'Conferma prenotazione'}</button>
        </form>
      )}
      {msg && <div className={`alert ${msg.includes('successo') ? 'alert-success' : 'alert-danger'} py-2`}>{msg}</div>}
    </div>
  );
};

export default Prenota;
