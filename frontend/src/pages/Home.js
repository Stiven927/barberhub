import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaCalendarCheck, FaEnvelopeOpenText } from 'react-icons/fa';



const Home = () => (
  <div>
    <section className="text-center" style={{paddingTop:'2.5rem', paddingBottom:'0.5rem'}}>
      <h1 className="display-3 fw-bold mb-2" style={{color:'#0d1a4a', letterSpacing:2}}>BarberHub</h1>
      <p className="lead mb-2" style={{maxWidth:'600px', margin:'0 auto'}}>Gestione prenotazioni, prodotti e contatti per il tuo barbiere.</p>
    </section>

    <section className="home-section">
      <div className="home-block">
        <div className="icon"><FaBoxOpen /></div>
        <h2>Prodotti</h2>
        <p>
          Acquista i migliori prodotti per barba e capelli, scelti dai professionisti.
        </p>
        <Link to="/prodotti" className="btn btn-outline-primary">Vai ai Prodotti</Link>
      </div>
      <div className="home-block">
        <div className="icon"><FaCalendarCheck /></div>
        <h2>Prenota</h2>
        <p>
          Prenota il tuo appuntamento in modo semplice e veloce, senza attese.
        </p>
        <Link to="/prenota" className="btn btn-outline-primary">Prenota ora</Link>
      </div>
      <div className="home-block">
        <div className="icon"><FaEnvelopeOpenText /></div>
        <h2>Contattaci</h2>
        <p>
          Scrivici per qualsiasi domanda o richiesta, siamo a tua disposizione.
        </p>
        <Link to="/contattaci" className="btn btn-outline-primary">Contattaci</Link>
      </div>
    </section>
  </div>
);

export default Home;
