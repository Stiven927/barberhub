import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCut, FaUserCircle } from 'react-icons/fa';

const Header = ({ utente, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-custom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaCut style={{marginRight:8, color:'#e10600', fontSize:28}} />
          <span style={{fontWeight:700, letterSpacing:2}}>BarberHub</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/prodotti">Prodotti</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/prenota">Prenota</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contattaci">Contattaci</Link>
            </li>
            {utente ? (
              <>
                {utente.ruolo === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
                <li className="nav-item d-flex align-items-center">
                  <FaUserCircle style={{fontSize:22, marginRight:4, color:'#e10600'}} />
                  <span className="nav-link disabled">{utente.nome || utente.email}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registrati">Registrati</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
