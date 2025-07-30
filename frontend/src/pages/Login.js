import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:5200/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.error) setMsg(data.error);
    else {
      onLogin(data);
      navigate('/');
    }
  };

  return (
    <div className="container mt-4" style={{maxWidth:400}}>
      <h2>Login</h2>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Accedi</button>
      </form>
    </div>
  );
};

export default Login;
