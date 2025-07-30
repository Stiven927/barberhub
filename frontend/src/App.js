import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Prodotti from './pages/Prodotti';
import DettaglioProdotto from './pages/DettaglioProdotto';
import Prenota from './pages/Prenota';
import Contattaci from './pages/Contattaci';
import Login from './pages/Login';
import Registrati from './pages/Registrati';
import Admin from './pages/Admin';
import { Navigate } from 'react-router-dom';

function App() {
  const [utente, setUtente] = useState(() => {
    const u = localStorage.getItem('utente');
    return u ? JSON.parse(u) : null;
  });

  const handleLogin = (user) => {
    setUtente(user);
    localStorage.setItem('utente', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUtente(null);
    localStorage.removeItem('utente');
  };

  return (
    <Router>
      <Header utente={utente} onLogout={handleLogout} />
      <main style={{minHeight:'70vh'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/registrati" element={<Registrati onRegister={() => window.location.href='/login'} />} />
          <Route path="/prodotti" element={utente ? <Prodotti utente={utente} /> : <Login onLogin={handleLogin} />} />
          <Route path="/prodotti/:id" element={<DettaglioProdotto />} />
          <Route path="/prenota" element={utente ? <Prenota utente={utente} /> : <Login onLogin={handleLogin} />} />
          <Route path="/contattaci" element={<Contattaci />} />
          <Route path="/admin" element={utente && utente.ruolo === 'admin' ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;