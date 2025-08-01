import React from 'react';

const Footer = () => (
  <footer className="navbar-custom footer-sticky" style={{padding:'1rem 2rem',textAlign:'center'}}>
    <div>
      &copy; {new Date().getFullYear()} BarberHub. Tutti i diritti riservati.
    </div>
  </footer>
);

export default Footer;
