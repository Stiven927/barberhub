
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';
import './Prodotti.css';


const Prodotti = ({ utente }) => {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordini, setOrdini] = useState({}); // { [prodottoId]: quantita }
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5200/api/prodotti')
      .then(res => res.json())
      .then(data => {
        // Demo: se meno di 8 prodotti, aggiungi prodotti fittizi per mostrare lo scroll
        let arr = data;
        if (data.length < 8) {
          const fake = [
            {id:1001, nome:'Shampoo Energizzante', prezzo:12, descrizione:'Dona energia e freschezza ai capelli.', disponibilita:10},
            {id:1002, nome:'Cera Opaca', prezzo:9, descrizione:'Per uno styling naturale e duraturo.', disponibilita:15},
            {id:1003, nome:'Olio Barba', prezzo:15, descrizione:'Nutre e ammorbidisce la barba.', disponibilita:8},
            {id:1004, nome:'Balsamo Dopobarba', prezzo:11, descrizione:'Lenisce e idrata la pelle.', disponibilita:12},
            {id:1005, nome:'Gel Fissaggio Forte', prezzo:8, descrizione:'Tenuta estrema per ogni look.', disponibilita:20},
            {id:1006, nome:'Pettine Professionale', prezzo:6, descrizione:'Per uno styling perfetto ogni giorno.', disponibilita:30},
            {id:1007, nome:'Spazzola Barba', prezzo:10, descrizione:'Districa e modella la barba.', disponibilita:18},
            {id:1008, nome:'Crema Styling', prezzo:13, descrizione:'Definisce e protegge i capelli.', disponibilita:14},
          ];
          arr = [...data, ...fake.slice(0,8-data.length)];
        }
        setProdotti(arr);
        setLoading(false);
      });
  }, []);

  const handleOrder = (prodottoId) => {
    const quantita = Number(ordini[prodottoId]) || 1;
    if (!quantita) {
      setMsg('Inserisci la quantità');
      return;
    }
    const clienteId = utente.clienteId || utente.id;
    fetch('http://localhost:5200/api/ordini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prodottoId, clienteId, quantita })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setMsg('Errore: ' + data.error);
        else {
          setMsg('Ordine effettuato con successo!');
          // Ricarica prodotti per aggiornare la disponibilità
          fetch('http://localhost:5200/api/prodotti')
            .then(res => res.json())
            .then(data => setProdotti(data));
        }
      })
      .catch(() => setMsg('Errore nella richiesta'));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center" style={{color:'#0d1a4a', letterSpacing:1, zIndex:2, position:'relative'}}>Prodotti</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="prodotti-scroll pb-3" style={{marginTop: '24px'}}>
        {loading ? <p>Caricamento...</p> : prodotti.map(prodotto => (
          <div className="prodotto-card" key={prodotto.id} style={{height: 370, width: 320, display: 'flex', alignItems: 'stretch'}}>
            <div className="home-block d-flex flex-column" style={{height: '100%', width: '100%', minHeight: 0, justifyContent: 'flex-start', padding: 0}}>
              <div className="icon" style={{marginTop: 24, marginBottom: 12}}><FaBoxOpen /></div>
              <h5 className="mb-2" style={{minHeight: 40}}>{prodotto.nome}</h5>
              <h6 className="mb-2">€{Number(prodotto.prezzo).toFixed(2)}</h6>
              <p className="mb-2" style={{minHeight: 48}}>{prodotto.descrizione}</p>
              <div className="mb-2">Disponibilità: <b>{prodotto.disponibilita}</b></div>
              <div className="d-flex w-100 gap-2 mt-auto justify-content-center" style={{marginBottom: 12}}>
                <Link to={`/prodotti/${prodotto.id}`} className="btn btn-outline-secondary" style={{padding: '4px 10px', minWidth: 0, flex: 'none', whiteSpace: 'nowrap'}}>Dettaglio</Link>
                <form className="d-flex" style={{gap:4}} onSubmit={e => { e.preventDefault(); handleOrder(prodotto.id); }}>
                  <input type="number" className="form-control" style={{maxWidth:70}} min="1" max={prodotto.disponibilita} value={ordini[prodotto.id] || 1} onChange={e => setOrdini({ ...ordini, [prodotto.id]: e.target.value })} required disabled={prodotto.disponibilita < 1} />
                  <button type="submit" className="btn btn-primary" disabled={prodotto.disponibilita < 1}>Acquista</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prodotti;
