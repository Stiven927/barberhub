import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCut, FaBars } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';

const Header = ({ utente, onLogout }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(false);

  const handleLogoutConfirmed = () => {
    setShowLogoutConfirm(false);
    onLogout();
    navigate('/login');
  };

  const userInitial = utente && (utente.nome ? utente.nome.charAt(0).toUpperCase() : (utente.email ? utente.email.charAt(0).toUpperCase() : 'U'));

  return (
    <>
      <nav className="navbar navbar-custom shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <FaCut style={{marginRight:8, color:'#e10600', fontSize:28}} />
            <span style={{fontWeight:700, letterSpacing:2}}>BarberHub</span>
          </Link>

          <div className="d-flex align-items-center">
            {utente && (
              <div className="me-3 d-flex align-items-center text-white" style={{fontWeight:600}}>
                <div className="user-initial me-2">{utente.ruolo === 'admin' ? 'A' : userInitial}</div>
                <div className="d-none d-md-block">{utente.ruolo === 'admin' ? 'Admin' : (utente.nome || utente.email)}</div>
              </div>
            )}

            <button className="btn btn-hamburger" onClick={() => setOpenMenu(true)} aria-label="Apri menu">
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* Custom offcanvas */}
      {openMenu && (
        <div>
          <div className="offcanvas-overlay" onClick={() => setOpenMenu(false)} />
          <div className="offcanvas-custom">
            <div className="p-3 d-flex justify-content-between align-items-center border-bottom">
              <strong>Menu</strong>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpenMenu(false)}>Chiudi</button>
            </div>
            <div className="p-3">
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><Link className="offcanvas-link" to="/" onClick={() => setOpenMenu(false)}>Home</Link></li>
                <li className="mb-2"><Link className="offcanvas-link" to="/prodotti" onClick={() => setOpenMenu(false)}>Prodotti</Link></li>
                <li className="mb-2"><Link className="offcanvas-link" to="/prenota" onClick={() => setOpenMenu(false)}>Prenota</Link></li>
                <li className="mb-2"><Link className="offcanvas-link" to="/contattaci" onClick={() => setOpenMenu(false)}>Contattaci</Link></li>
                {utente ? (
                  <>
                    {utente.ruolo === 'admin' && <li className="mb-2"><Link className="offcanvas-link" to="/admin" onClick={() => setOpenMenu(false)}>Admin</Link></li>}
                    <li className="mb-2"><Link className="offcanvas-link" to="/profilo" onClick={() => setOpenMenu(false)}>Profilo</Link></li>
                    <li className="mt-3"><button className="btn btn-outline-danger w-100" onClick={() => { setOpenMenu(false); setShowLogoutConfirm(true); }}>Logout</button></li>
                  </>
                ) : (
                  <>
                    <li className="mb-2"><Link className="offcanvas-link" to="/login" onClick={() => setOpenMenu(false)}>Login</Link></li>
                    <li className="mb-2"><Link className="offcanvas-link" to="/registrati" onClick={() => setOpenMenu(false)}>Registrati</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal show={showLogoutConfirm} title="Conferma logout" message="Sei sicuro di voler effettuare il logout?" onConfirm={handleLogoutConfirmed} onCancel={() => setShowLogoutConfirm(false)} confirmText="Logout" cancelText="Annulla" confirmClass="btn-primary" cancelClass="btn-secondary" />
    </>
  );
};

export default Header;
