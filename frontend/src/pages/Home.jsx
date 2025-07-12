import React, {useEffect, useState} from 'react';
import ListaLibros from '../components/libros/ListaLibros';
import FormularioLibros from '../components/libros/FormularioLibros';

const Home = () => {
    const [libros, setLibros] = useState([]);
    const [libroEditado, setLibroEditado] = useState(null);
    const obtenerLibros = async() => {
        try {
            const response = await fetch('http://localhost:3001/api/libros');
            const data = await response.json();
            setLibros(data);         
        } catch (error){
            console.error("Error al obtener los libros");
        }
    };

    useEffect( () => {
        obtenerLibros();
    }, []);

    return (
        <div className='contenedor-principal'>
            <h1> Mi biblioteca personal </h1>
            <ListaLibros 
            libros={libros}
            setLibroEditado={setLibroEditado}
            onEliminar={obtenerLibros} />
            <FormularioLibros 
            libroEditado = {libroEditado}
            onGuardar={() => {
                setLibroEditado(null);
                obtenerLibros();
            }} />
        </div>
    );
};

export default Home;