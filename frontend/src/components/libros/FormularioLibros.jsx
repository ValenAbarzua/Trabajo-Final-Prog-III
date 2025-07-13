import React, {useState, useEffect} from 'react';
import '../../styles/libros.css'
import '../../styles/formulario.css'

const FormularioLibros = ({libroEditado, onGuardar}) => {
        const [titulo, setTitulo] = useState('');
        const [autor, setAutor] = useState('');
        const [anio, setAnio] = useState('');
        const [estadoLectura, setEstadoLectura] = useState ('');
        const [calificacion, setCalificacion] = useState ('');
        const [generoId, setGeneroId] = useState('');
        const [generos, setGeneros] = useState ([]) 

    useEffect(() => {
        fetch('http://localhost:3001/api/generos')
        .then((res) => res.json())
        .then((data) => setGeneros(data))
        .catch((error) => console.error("Error al cargar generos", error))
    }, []);

    useEffect(() => {
        if (libroEditado) {
            setTitulo(libroEditado.titulo || '');
            setAutor(libroEditado.autor || '');
            setAnio(libroEditado.anio || '');
            setEstadoLectura(libroEditado.estadoLectura || '');
            setCalificacion(libroEditado.calificacion || '');
            setGeneroId(libroEditado.generoId || '');
        }
    }, [libroEditado]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoLibro = {
            titulo,
            autor,
            anio,
            estadoLectura,
            calificacion: calificacion ? parseInt(calificacion): null,
            generoId: parseInt(generoId),
        };

        try {
            const url = libroEditado
                ? `http://localhost:3001/api/libros/${libroEditado.id}`
                : 'http://localhost:3001/api/libros';
                const method= libroEditado ? 'PUT' : 'POST';
                const response =await fetch(url, {
                    method, 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(nuevoLibro),

                })

            if (!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la solicitud');    
            }
            
            await response.json();
            alert(libroEditado ? 'Libro editado correctamente!' : 'Libro creado correctamente!');
            setTitulo('');
            setAutor('');
            setAnio('');
            setEstadoLectura('');
            setCalificacion('');
            setGeneroId('');

            onGuardar();
        } catch (error) {
            console.error(error);
            alert('Ocurrio un error al crear el libro.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className= "formulario-libro">
            <h2> Agregar libro </h2>
            <input type = 'text' placeholder= "Titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required/>
            <input type = 'text' placeholder= "Autor" value={autor} onChange={(e) => setAutor(e.target.value)} required/>
            <input type = 'text' placeholder= "Anio" value={anio} onChange={(e) => setAnio(e.target.value)} required/>
            <select value = {estadoLectura} onChange= {(e) => setEstadoLectura(e.target.value)} required defaultValue="leido"> 
                <option value='leido'> Leido </option>
                <option value='por leer'> Por leer </option>
                <option value= 'leyendo'> Leyendo </option>
            </select>
            <input type = 'number' placeholder= "Calificacion (1-5)" min="1" max="5" value={calificacion} onChange={(e) => setCalificacion(e.target.value)}/>
            <select value={generoId} onChange={(e) => setGeneroId(e.target.value)} required>
                <option value=""> Seleccionar genero</option>
                {generos.map((genero) => (
                    <option key={genero.id} value={genero.id}>
                        {genero.nombre}
                    </option>
                ))}
            </select>
            <button type='submit'> Guardar libro</button>

        </form>
    );
};
export default FormularioLibros;