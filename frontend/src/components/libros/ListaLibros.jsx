import { useEffect, useState } from 'react';
import '../../styles/libros.css';
import '../../styles/formulario.css';

const ListaLibros = ({libros, setLibroEditado, onEliminar, generoSeleccionado, estadoLecturaSeleccionado}) => {

 /*   const librosFiltrados = generoSeleccionado === 0
        ? libros
        : libros.filter((libro) => libro.genero?.id === generoSeleccionado); */
    
    const librosFiltrados = libros.filter((libro) => {
        const coincideGenero = generoSeleccionado === '' || libro.genero?.id === parseInt(generoSeleccionado);
        const coincideEstado = estadoLecturaSeleccionado === '' || libro.estadoLectura === estadoLecturaSeleccionado;
        return coincideGenero && coincideEstado;
    });



    return (
        <div className='lista-libros'>
            <h2> Lista de libros: </h2>
            {librosFiltrados.length === 0 ? (
                <p> No hay libros para mostrar! </p>
            ) : (
                librosFiltrados.map((libro) => (
                    <div key={libro.id} className='libro'>
                        <strong>{libro.titulo}</strong> - {libro.autor} ({libro.anio})
                        <br /> Genero: {libro.genero?.nombre || 'Sin genero'}
                        <br /> Calificacion: {libro.calificacion}/5
                        <br /> Estado de lectura: {libro.estadoLectura}

                        <div className='botones-lista-libros'>
                            <button onClick={() => setLibroEditado(libro)}> Editar libro </button>
                            <button onClick={() => onEliminar(libro.id)}> Eliminar libro </button>
                        </div>
                   
                    </div>
                ))
            )}
        </div>
    );


};
export default ListaLibros;
