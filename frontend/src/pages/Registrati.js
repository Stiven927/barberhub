import React, { useState } from 'react';

const Registrati = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:5200/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nome })
    });
    const data = await res.json();
    if (data.error) setMsg(data.error);
    else {
      setMsg('Registrazione avvenuta! Ora puoi accedere.');
      if (onRegister) onRegister();
    }
  };

  return (
    <div className="container mt-4" style={{maxWidth:400}}>
      <h2>Registrati</h2>
      {msg && <div className={msg.includes('errore') ? 'alert alert-danger' : 'alert alert-success'}>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success w-100">Registrati</button>
      </form>
    </div>
  );
};

export default Registrati;
