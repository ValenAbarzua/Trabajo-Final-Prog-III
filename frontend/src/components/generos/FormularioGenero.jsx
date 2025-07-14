import React, {useState} from 'react';
import '../../styles/formulario.css';
import '../../styles/libros.css';

const FormularioGenero = ({ onGeneroCreado}) => {
    const [nombre, setNombre] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) {
            alert ('El nombre del genero no puede estar vacio!');
            return;
        }

        try{
            const response = await fetch('http://localhost:3001/api/generos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nombre }),
            });

            if (!response.ok) throw new Error('Ocurrio un error al crear el genero!');
            const nuevoGenero = await response.json();
            alert ("Genero creado correctamente!");
            setNombre ('');
            if (onGeneroCreado) onGeneroCreado(nuevoGenero); //Actualiza la lista si hace falta

        } catch (error){
            console.error(error);
            alert('Ocurrio un error al crear el genero!')
        }
    };

    return (
        <form className='formulario-libro' onSubmit={handleSubmit}>
            <h2> Agregar nuevo genero </h2>
            <input type= 'text' placeholder= 'Nombre del genero' value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
            <button type = 'submit'> Crear genero </button>
        </form>
    )

}

export default FormularioGenero;