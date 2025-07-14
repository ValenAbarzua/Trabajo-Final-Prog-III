import React, {useEffect, useState} from 'react';
import ListaLibros from '../components/libros/ListaLibros';
import FormularioLibros from '../components/libros/FormularioLibros';
import FormularioGenero from '../components/generos/FormularioGenero';

const Home = () => {
    const [libros, setLibros] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [generoSeleccionado, setGeneroSeleccionado] = useState('');
    const [libroEditado, setLibroEditado] = useState(null);
    const [estadoLecturaSeleccionado, setEstadoLecturaSeleccionado] = useState('')
    const obtenerLibros = async() => {
        try {
            const response = await fetch('http://localhost:3001/api/libros');
            const data = await response.json();
            setLibros(data);         
        } catch (error){
            console.error("Error al obtener los libros");
        }
    };

    const eliminarLibro = async (id) => {
        try{
            const response = await fetch(`http://localhost:3001/api/libros/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Libro eliminado correctamente!");
                setLibros(libros.filter((libro) => libro.id !== id)) //Actualiza la lista
            } else {
                alert("Error al eliminar el libro!");
            }
        } catch (error){
            console.error("Error al eliminar el libro!");
            alert("Ocurrio un problema al eliminar el libro!");
        }
    };

    useEffect( () => {
        obtenerLibros();
    }, []);

    useEffect(() => {
        const obtenerGeneros = async () => {
            try{
                const response = await fetch('http://localhost:3001/api/generos');
                const data = await response.json();
                setGeneros(data);
            } catch (error) {
                console.error('Error al obtener los generos', error)
            }
        };
        obtenerGeneros();
    }, []);

    return (
        <div className='contenedor-principal'>
            <h1> Mi biblioteca personal </h1>
            <select value={generoSeleccionado} onChange={(e) => setGeneroSeleccionado(e.target.value)}>
                <option value=''> Todos los generos </option>
                {generos.map((genero) => (
                    <option key={genero.id} value={genero.id}> {genero.nombre} </option>
                ))}
            </select>
            <select value={estadoLecturaSeleccionado} onChange={(e) => setEstadoLecturaSeleccionado(e.target.value)}>
                <option value=''> Todos los estados de lectura </option>
                <option value='por leer'> Por leer </option>
                <option value='leyendo'> Leyendo </option>
                <option value='leido'> Leido </option>
            </select>
            <ListaLibros 
                libros={libros}
                setLibroEditado={setLibroEditado}
                onEliminar={eliminarLibro} 
                generoSeleccionado={generoSeleccionado}
                estadoLecturaSeleccionado={estadoLecturaSeleccionado}
            />
            <FormularioLibros 
                libroEditado = {libroEditado}
                generos={generos}
                onGuardar={() => {
                    setLibroEditado(null);
                    obtenerLibros();
                }}  
            />
            <FormularioGenero onGeneroCreado={() => {
                fetch('http://localhost:3001/api/generos') //Para que se actualize la lista de generos luego
                .then((res) => res.json())                 // de crear uno
                .then((data) => setGeneros(data))
                .catch((error) => console.error('Error al actualizar los generos', error))
            }}
            />
        </div>
    );
};

export default Home;