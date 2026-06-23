import React, { useState } from 'react';
import Registro from './Registro';

const Login = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://trabajo-final-prog-iii.onrender.com/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBase.replace(/\/$/, '')}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(loginData)
      });
      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('nombre', data.usuario.nombre);
        alert('Login correcto');
        onLogin();
      } else {
        alert(data.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  if (mostrarRegistro) {
    return (
      <Registro
        onRegistroExitoso={() => {
          alert("Registro exitoso, ahora puedes iniciar sesión");
          setMostrarRegistro(false); 
        }}
        onCancelar={() => setMostrarRegistro(false)}
      />
    );
  }

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
          backgroundColor: '#6cb384',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Ingresar
        </button>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          No tienes cuenta?{" "}
          <span
            onClick={() => setMostrarRegistro(true)}
            style={{ color: '#6cb384', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Registrarme
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
