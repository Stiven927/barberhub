import React, { useEffect, useState } from 'react';

const AdminOrdini = () => {
  const [ordini, setOrdini] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5200/api/ordini')
      .then(res => res.json())
      .then(data => {
        setOrdini(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card p-3 shadow-sm mb-4">
      <h5 className="mb-3">Ultimi Ordini</h5>
      {loading ? <div>Caricamento...</div> : (
        ordini.length === 0 ? <div>Nessun ordine presente.</div> :
        <div style={{overflowX:'auto'}}>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Prodotto</th>
                <th>Quantità</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {ordini.slice(-10).reverse().map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.Cliente ? o.Cliente.nome : o.clienteId}</td>
                  <td>{o.Prodotto ? o.Prodotto.nome : o.prodottoId}</td>
                  <td>{o.quantita}</td>
                  <td>{o.createdAt ? o.createdAt.split('T')[0] : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdini;
