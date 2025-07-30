import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const DettaglioProdotto = () => {
  const { id } = useParams();
  const [prodotto, setProdotto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantita, setQuantita] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5200/api/prodotti/${id}`)
      .then(res => res.json())
      .then(data => {
        setProdotto(data);
        setLoading(false);
      });
  }, [id]);

  const handleOrder = () => {
    const utente = JSON.parse(localStorage.getItem('utente'));
    if (!utente) {
      setMsg('Devi essere loggato per acquistare');
      return;
    }
    const clienteId = utente.clienteId || utente.id;
    fetch('http://localhost:5200/api/ordini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prodottoId: prodotto.id, clienteId, quantita: Number(quantita) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setMsg('Errore: ' + data.error);
        else {
          setMsg('Acquisto effettuato!');
          // Aggiorna disponibilità
          fetch(`http://localhost:5200/api/prodotti/${id}`)
            .then(res => res.json())
            .then(data => setProdotto(data));
        }
      })
      .catch(() => setMsg('Errore nella richiesta'));
  };

  if (loading) return <div className="container py-5 text-center">Caricamento...</div>;
  if (!prodotto) return <div className="container py-5 text-center">Prodotto non trovato.</div>;

  return (
    <div className="container py-5">
      <Link to="/prodotti" className="btn btn-outline-secondary mb-4">
        <FaArrowLeft style={{marginRight:8}} /> Torna ai prodotti
      </Link>
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-lg border-0 p-4 prodotto-dettaglio">
            <h2 className="mb-3" style={{color:'#0d1a4a'}}>{prodotto.nome}</h2>
            <h4 className="mb-3 text-danger">€ {prodotto.prezzo.toFixed(2)}</h4>
            <p className="mb-4">{prodotto.descrizione}</p>
            <div className="mb-2">Disponibilità: <b>{prodotto.disponibilita}</b></div>
            <div className="d-flex gap-2 align-items-center">
              <input type="number" min="1" max={prodotto.disponibilita} value={quantita} onChange={e => setQuantita(e.target.value)} className="form-control" style={{maxWidth:80}} disabled={prodotto.disponibilita < 1} />
              <button className="btn btn-primary mt-3" disabled={prodotto.disponibilita < 1} onClick={handleOrder}>
                {prodotto.disponibilita > 0 ? 'Acquista' : 'Non disponibile'}
              </button>
            </div>
            {msg && <div className="alert alert-info mt-3">{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DettaglioProdotto;
