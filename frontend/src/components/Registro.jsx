import React, { useState } from 'react';

const Registro = ({ onRegistroExitoso }) => {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://trabajo-final-prog-iii.onrender.com/api';

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBase.replace(/\/$/, '')}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        alert('Registro exitoso, ahora puedes iniciar sesión');
        onRegistroExitoso(); 
      } else {
        alert(data.mensaje || 'Error al registrarse');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al registrarse');
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
        onSubmit={handleRegistro}
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registro</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
        <button type="submit" style={{
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;
