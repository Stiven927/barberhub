import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const AdminCalendar = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrenotazione, setEditingPrenotazione] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // elenco servizi (allineato al server)
  const servizi = [
    { nome: 'Taglio', prezzo: 15 },
    { nome: 'Taglio + Barba', prezzo: 25 },
    { nome: 'Solo Barba', prezzo: 10 },
    { nome: 'Tinta', prezzo: 30 },
    { nome: 'Taglio+Shampoo', prezzo: 20 }
  ];

  useEffect(() => {
    let mounted = true;
    const fetchPrenotazioni = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5200/api/prenotazioni');
        if (!res.ok) {
          console.error('GET /api/prenotazioni responded with', res.status);
          if (!mounted) return;
          setPrenotazioni([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setPrenotazioni(data);
        setLoading(false);
      } catch (err) {
        console.error('Errore fetching prenotazioni:', err);
        if (!mounted) return;
        setPrenotazioni([]);
        setLoading(false);
      }
    };
    fetchPrenotazioni();
    return () => { mounted = false; };
  }, []);

  // Elimina prenotazione
  const handleDelete = async (id) => {
    setToDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    await fetch(`http://localhost:5200/api/prenotazioni/${toDeleteId}`, { method: 'DELETE' });
    setPrenotazioni(prenotazioni.filter(p => p.id !== toDeleteId));
    setShowConfirm(false);
    setToDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setToDeleteId(null);
  };

  // Apri form di modifica
  const handleEditClick = (p) => {
    // estraggo data e orario in formato per gli input
    const iso = p.data;
    const datePart = iso.split('T')[0];
    // orario in formato HH:MM
    const timePart = new Date(p.data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    setEditingPrenotazione({
      id: p.id,
      data: datePart,
      orario: timePart,
      servizio: p.servizio || servizi[0].nome,
      note: p.note || ''
    });
  };

  // Salva modifica
  const handleSave = async () => {
    if (!editingPrenotazione) return;
    const { id, data, orario, servizio, note } = editingPrenotazione;
    if (!data || !orario || !servizio) {
      alert('Compila data, orario e servizio');
      return;
    }
    const payload = {
      data: `${data}T${orario}:00`,
      servizio,
      note
    };
    try {
      const res = await fetch(`http://localhost:5200/api/prenotazioni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Errore durante l\'aggiornamento');
        return;
      }
      const updated = await res.json();
      // Aggiorno lo stato locale
      setPrenotazioni(prenotazioni.map(p => p.id === updated.id ? {
        ...p,
        data: updated.data,
        servizio: updated.servizio,
        prezzo: updated.prezzo,
        note: updated.note
      } : p));
      setEditingPrenotazione(null);
    } catch (e) {
      alert('Errore di rete');
    }
  };

  // Annulla modifica
  const handleCancel = () => setEditingPrenotazione(null);

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

      {/* Form di modifica inline */}
      {editingPrenotazione && (
        <div className="card p-3 mb-3 border-primary">
          <h6>Modifica prenotazione #{editingPrenotazione.id}</h6>
          <div className="row g-2 align-items-end">
            <div className="col-auto">
              <label className="form-label">Data</label>
              <input type="date" className="form-control" value={editingPrenotazione.data} onChange={e => setEditingPrenotazione({...editingPrenotazione, data: e.target.value})} />
            </div>
            <div className="col-auto">
              <label className="form-label">Orario</label>
              <input type="time" className="form-control" value={editingPrenotazione.orario} onChange={e => setEditingPrenotazione({...editingPrenotazione, orario: e.target.value})} />
            </div>
            <div className="col-auto">
              <label className="form-label">Servizio</label>
              <select className="form-select" value={editingPrenotazione.servizio} onChange={e => setEditingPrenotazione({...editingPrenotazione, servizio: e.target.value})}>
                {servizi.map(s => <option key={s.nome} value={s.nome}>{s.nome} ({s.prezzo}€)</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Note</label>
              <input className="form-control" value={editingPrenotazione.note} onChange={e => setEditingPrenotazione({...editingPrenotazione, note: e.target.value})} />
            </div>
            <div className="col-auto mt-2">
              <button className="btn btn-success me-2" onClick={handleSave}>Salva</button>
              <button className="btn btn-secondary" onClick={handleCancel}>Annulla</button>
            </div>
          </div>
        </div>
      )}

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
                <th>Azioni</th>
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
                      <td>
                        <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(p.id)}>Elimina</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(p)}>Modifica</button>
                      </td>
                    </tr>
                  );
                })
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal show={showConfirm} title="Conferma eliminazione prenotazione" message="Vuoi eliminare questa prenotazione?" onConfirm={confirmDelete} onCancel={cancelDelete} confirmText="Elimina" cancelText="Annulla" confirmClass="btn-danger" cancelClass="btn-outline-primary" />
    </div>
  );
};

export default AdminCalendar;
