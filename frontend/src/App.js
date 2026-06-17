import React from 'react';
import './App.css';
import ListaLibros from './components/listaLibros';
import Login from './components/Login';

function App() {
  const token = localStorage.getItem("token")
  return (
    <div className="App">
      {token ? <ListaLibros /> : <Login />}
    </div>
  );
}

export default App;
