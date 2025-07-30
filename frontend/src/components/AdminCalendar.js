import React, { useEffect, useState } from 'react';

const AdminCalendar = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5200/api/prenotazioni')
      .then(res => res.json())
      .then(data => {
        setPrenotazioni(data);
        setLoading(false);
      });
  }, []);

  // Raggruppa prenotazioni per data
  const grouped = prenotazioni.reduce((acc, p) => {
    const giorno = p.data.split('T')[0];
    acc[giorno] = acc[giorno] || [];
    acc[giorno].push(p);
    return acc;
  }, {});

  return (
    <div className="card p-3 shadow-sm mb-4">
      <h5 className="mb-3">Calendario Prenotazioni</h5>
      {loading ? <div>Caricamento...</div> : (
        Object.keys(grouped).length === 0 ? <div>Nessuna prenotazione.</div> :
        <div style={{overflowX:'auto'}}>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Data</th>
                <th>Orario</th>
                <th>Cliente</th>
                <th>Servizio</th>
                <th>Prezzo</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([giorno, prenots]) => (
                prenots.map((p, idx) => {
                  // Orario locale italiano
                  const orarioLocale = new Date(p.data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
                  return (
                    <tr key={p.id}>
                      {idx === 0 && <td rowSpan={prenots.length}>{giorno}</td>}
                      <td>{orarioLocale}</td>
                      <td>{p.nomeCliente || p.clienteId}</td>
                      <td>{p.servizio || '-'}</td>
                      <td>{p.prezzo ? p.prezzo + '€' : '-'}</td>
                    </tr>
                  );
                })
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
