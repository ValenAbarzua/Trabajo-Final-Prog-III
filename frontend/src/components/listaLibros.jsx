import React, {useEffect, useState} from 'react';

const ListaLibros = () => {
    const [libros, setLibros] = useState ([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const apiBase = process.env.REACT_APP_API_URL || 'https://trabajo-final-prog-iii.onrender.com/api';
        const apiEndpoint = `${apiBase.replace(/\/$/, '')}/libros`;

        fetch(apiEndpoint)
         .then((res)=> res.json())
         .then((data) => {
            setLibros(data);
            setCargando(false);
         })
        .catch((error) => {
            console.error('Error al obtener los libros', error);
            setCargando(false);
         });
    }, []);

    if (cargando) return <p> Cargando libros...</p>;

    return (
        <div>
            <h2> Lista de libros: </h2>
            {libros.length === 0 ? (
                <p> No hay libros registrados! </p>

            ) : (
                <ul>
                    {libros.map((libro) => (
                        <li key={libro.id}>
                            <strong> {libro.titulo} </strong> - {libro.autor} ({libro.anio}) <br />
                            Genero: {libro.genero?.nombre || 'Sin genero'}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export default ListaLibros;