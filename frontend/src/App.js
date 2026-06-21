import React, { useState } from 'react';
import './App.css';
import ListaLibros from './components/listaLibros';
import Login from './components/Login';

function App() {
  const [logueado, setLogueado] = useState(!!localStorage.getItem("token"));

  const handleLoginSuccess = () => setLogueado(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogueado(false);
  };

  return (
    <div className="App">
      {logueado ? (
        <ListaLibros onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;