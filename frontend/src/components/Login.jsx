import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://trabajo-final-prog-iii.onrender.com/api';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${apiBase.replace(/\/$/, '')}/usuarios/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login correcto');
        onLogin(); // avisa al App que ya está logueado
      } else {
        alert(data.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '300px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <button type="submit" style={{
          padding: '10px',
          backgroundColor: '#673ab7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
