import React, { useState } from 'react';
import AdminOrdini from '../components/AdminOrdini';
import AdminCalendar from '../components/AdminCalendar';
import AdminProdotti from '../components/AdminProdotti';


const Admin = () => {
  const [form, setForm] = useState({ nome: '', prezzo: '', descrizione: '', disponibilita: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  // Stato per la sezione attiva: 'ordini', 'prenotazioni', 'prodotti'
  const [sezione, setSezione] = useState('ordini');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('http://localhost:5200/api/prodotti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          prezzo: parseFloat(form.prezzo),
          descrizione: form.descrizione,
          disponibilita: parseInt(form.disponibilita || '0', 10)
        })
      });
      if (res.ok) {
        setMsg('Prodotto inserito con successo!');
        setForm({ nome: '', prezzo: '', descrizione: '', disponibilita: '' });
      } else {
        const data = await res.json();
        setMsg(data.error || 'Errore nell\'inserimento');
      }
    } catch (err) {
      setMsg('Errore di rete');
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{color:'#0d1a4a'}}>Pannello amministratore</h2>
      <div className="alert alert-info">Benvenuto nell'area admin! Qui puoi monitorare ordini, prenotazioni e inserire nuovi prodotti.</div>
      <div className="d-flex gap-2 mb-4">
        <button className={`btn btn-${sezione==='ordini'?'primary':'outline-primary'}`} onClick={()=>setSezione('ordini')}>Gestisci ordini</button>
        <button className={`btn btn-${sezione==='prenotazioni'?'primary':'outline-primary'}`} onClick={()=>setSezione('prenotazioni')}>Gestisci prenotazioni</button>
        <button className={`btn btn-${sezione==='prodotti'?'primary':'outline-primary'}`} onClick={()=>setSezione('prodotti')}>Gestisci prodotti</button>
      </div>
      {sezione==='ordini' && <AdminOrdini />}
      {sezione==='prenotazioni' && <AdminCalendar />}
      {sezione==='prodotti' && <AdminProdotti />}
    </div>
  );
};

export default Admin;
