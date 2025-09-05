import React, { useEffect, useState } from 'react';

const Profilo = ({ utente }) => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [ordini, setOrdini] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!utente) return;
    const clienteId = utente.clienteId || utente.id;

    Promise.all([
      fetch(`http://localhost:5200/api/prenotazioni`).then(r => r.json()),
      fetch(`http://localhost:5200/api/ordini`).then(r => r.json())
    ]).then(([pren, ord]) => {
      // filtro per questo cliente
      setPrenotazioni(pren.filter(p => p.clienteId === clienteId));
      setOrdini(ord.filter(o => o.clienteId === clienteId));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [utente]);

  if (!utente) return <div className="container py-5">Accedi per vedere il tuo profilo.</div>;

  return (
    <div className="container py-5">
      <h2>Il tuo profilo</h2>
      <p className="text-muted">Per eliminare o modificare una prenotazione/ordine contatta l'amministratore.</p>

      <div className="row">
        <div className="col-md-6">
          <h5 className="mt-4">Storico prenotazioni</h5>
          {loading ? <div>Caricamento...</div> : (
            prenotazioni.length === 0 ? <div>Nessuna prenotazione effettuata.</div> : (
              <ul className="list-group">
                {prenotazioni.map(p => (
                  <li className="list-group-item" key={p.id}>
                    <div><strong>Data:</strong> {p.data.split('T')[0]} <strong>Orario:</strong> {new Date(p.data).toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit', timeZone:'Europe/Rome'})}</div>
                    <div><strong>Servizio:</strong> {p.servizio} <strong>- Prezzo:</strong> {p.prezzo}€</div>
                    {p.note && <div><strong>Note:</strong> {p.note}</div>}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        <div className="col-md-6">
          <h5 className="mt-4">Storico ordini/Prodotti acquistati</h5>
          {loading ? <div>Caricamento...</div> : (
            ordini.length === 0 ? <div>Nessun ordine effettuato.</div> : (
              <ul className="list-group">
                {ordini.map(o => (
                  <li className="list-group-item" key={o.id}>
                    <div><strong>Ordine #</strong>{o.id} - <strong>Totale:</strong> {o.totale ? o.totale + '€' : '-'} </div>
                    <div><strong>Prodotti:</strong>
                      <ul>
                        {(
                          // se backend fornisce OrdineProdotti (vecchio schema)
                          o.OrdineProdotti ? o.OrdineProdotti.map(op => (
                            <li key={op.id}>{op.prodottoNome || op.nome} x{op.quantita}</li>
                          ))
                          // altrimenti supporto l'associazione semplice Prodotto
                          : o.Prodotto ? <li key={o.Prodotto.id}>{o.Prodotto.nome} x{o.quantita}</li>
                          : <li>Nessun dettaglio prodotto disponibile</li>
                        )}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profilo;
