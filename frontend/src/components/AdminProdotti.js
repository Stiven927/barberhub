import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const AdminProdotti = () => {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nome: '', prezzo: '', descrizione: '', disponibilita: '' });
  const [msg, setMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const fetchProdotti = () => {
    setLoading(true);
    fetch('http://localhost:5200/api/prodotti')
      .then(res => res.json())
      .then(data => {
        setProdotti(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProdotti();
  }, []);

  const handleEdit = (prodotto) => {
    setEditId(prodotto.id);
    setForm({
      nome: prodotto.nome,
      prezzo: prodotto.prezzo,
      descrizione: prodotto.descrizione,
      disponibilita: prodotto.disponibilita
    });
    setMsg('');
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nome: '', prezzo: '', descrizione: '', disponibilita: '' });
    setMsg('');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5200/api/prodotti/${editId}` : 'http://localhost:5200/api/prodotti';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          prezzo: parseFloat(form.prezzo),
          descrizione: form.descrizione,
          disponibilita: parseInt(form.disponibilita || '0', 10)
        })
      });
      if (res.ok) {
        setMsg(editId ? 'Prodotto modificato!' : 'Prodotto aggiunto!');
        setForm({ nome: '', prezzo: '', descrizione: '', disponibilita: '' });
        setEditId(null);
        fetchProdotti();
      } else {
        const data = await res.json();
        setMsg(data.error || 'Errore');
      }
    } catch {
      setMsg('Errore di rete');
    }
  };

  const handleDelete = async id => {
    // mostra modal di conferma
    setToDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      const res = await fetch(`http://localhost:5200/api/prodotti/${toDeleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg('Prodotto eliminato!');
        fetchProdotti();
      } else {
        setMsg('Errore eliminazione');
      }
    } catch {
      setMsg('Errore di rete');
    }
    setShowConfirm(false);
    setToDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setToDeleteId(null);
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <ConfirmationModal show={showConfirm} title="Conferma eliminazione prodotto" message="Vuoi eliminare questo prodotto?" onConfirm={confirmDelete} onCancel={cancelDelete} confirmText="Elimina" cancelText="Annulla" confirmClass="btn-outline-danger" cancelClass="btn-outline-primary" />
      <h5 className="mb-3">Gestione Prodotti</h5>
      {msg && <div className={`alert ${msg.includes('!') ? 'alert-success' : 'alert-danger'} py-2`}>{msg}</div>}
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-3">
            <input type="text" className="form-control" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" name="prezzo" placeholder="Prezzo" step="0.01" value={form.prezzo} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control" name="descrizione" placeholder="Descrizione" value={form.descrizione} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" name="disponibilita" placeholder="Disponibilità" value={form.disponibilita} onChange={handleChange} min="0" required />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-primary">{editId ? 'Salva' : 'Aggiungi'}</button>
          </div>
        </div>
        {editId && <button type="button" className="btn btn-link mt-2" onClick={handleCancel}>Annulla modifica</button>}
      </form>
      <div style={{overflowX:'auto'}}>
        {loading ? <div>Caricamento...</div> : (
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Prezzo</th>
                <th>Descrizione</th>
                <th>Disponibilità</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {prodotti.map(p => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>€{Number(p.prezzo).toFixed(2)}</td>
                  <td>{p.descrizione}</td>
                  <td>{p.disponibilita}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>Modifica</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProdotti;
