import { useEffect, useState } from 'react';
import '../../styles/libros.css';

const ListaLibros = ({libros, setLibroEditado}) => {

    const eliminarLibro = async (id) => {
        try{
            const response = await fetch(`http://localhost:3001/api/libros/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert("Libro eliminado con exito!");
                onEliminar();
            } else {
                console.error("Error al eliminar el libro");
            }
        } catch (error){
            console.error('Ocurrio un error!', error)
        }
    }

    return (
        <div className='lista-libros'>
            <h2> Lista de libros: </h2>
            {libros.length === 0 ? (
                <p> No hay libros para mostrar! </p>
            ) : (
                libros.map((libro) => (
                    <div key={libro.id} className='libro'>
                        <strong>{libro.titulo}</strong> - {libro.autor} ({libro.anio})
                        <br /> Genero: {libro.genero?.nombre || 'Sin genero'}
                        <br /> Calificacion: {libro.calificacion}/5
                        <br /> Estado de lectura: {libro.estadoLectura}

                        <button onClick={() => setLibroEditado(libro)}> Editar </button>
                        <button onClick={() => eliminarLibro(libro.id)}> Eliminar libro </button>
                    </div>
                ))
            )}
        </div>
    );


};
export default ListaLibros;
