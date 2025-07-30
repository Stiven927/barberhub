import React, { useState } from 'react';
import AdminOrdini from '../components/AdminOrdini';
import AdminCalendar from '../components/AdminCalendar';
import AdminProdotti from '../components/AdminProdotti';


const Admin = () => {

  // Stato per la sezione attiva: 'ordini', 'prenotazioni', 'prodotti'
  const [sezione, setSezione] = useState('ordini');

 

 

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
