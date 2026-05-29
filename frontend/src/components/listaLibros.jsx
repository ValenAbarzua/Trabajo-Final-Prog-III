import React, {useEffect, useState, useCallback} from 'react';

const ListaLibros = () => {
    const [libros, setLibros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        autor: '',
        anio: '',
        estadoLectura: 'por leer',
        generoId: ''
    });
    const [generos, setGeneros] = useState([]);
    const [nuevoGenero, setNuevoGenero] = useState('');
    const [cargandoGeneros, setCargandoGeneros] = useState(true);

    const apiBase = process.env.REACT_APP_API_URL || 'https://trabajo-final-prog-iii.onrender.com/api';

    const obtenerLibros = useCallback(async () => {
        try {
            const response = await fetch(`${apiBase.replace(/\/$/, '')}/libros`);
            const data = await response.json();
            setLibros(data);
        } catch (error) {
            console.error('Error al obtener los libros', error);
        } finally {
            setCargando(false);
        }
    }, [apiBase]);

    const obtenerGeneros = useCallback(async () => {
        try {
            const response = await fetch(`${apiBase.replace(/\/$/, '')}/generos`);
            const data = await response.json();
            setGeneros(data || []);
        } catch (error) {
            console.error('Error al obtener los géneros', error);
            setGeneros([]);
        } finally {
            setCargandoGeneros(false);
        }
    }, [apiBase]);

    useEffect(() => {
        obtenerLibros();
        obtenerGeneros();
    }, [obtenerLibros, obtenerGeneros]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que todos los campos requeridos estén presentes
        if (!formData.titulo || !formData.autor || !formData.anio || !formData.estadoLectura) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        // Preparar los datos para enviar
        const dataToSend = {
            titulo: formData.titulo.trim(),
            autor: formData.autor.trim(),
            anio: String(formData.anio).trim(), // Asegurar que sea string
            estadoLectura: formData.estadoLectura,
            generoId: formData.generoId ? parseInt(formData.generoId) : null
        };

        console.log('Enviando datos:', dataToSend); // Debug

        try {
            const url = editando
                ? `${apiBase.replace(/\/$/, '')}/libros/${editando.id}`
                : `${apiBase.replace(/\/$/, '')}/libros`;

            const method = editando ? 'PUT' : 'POST';
            console.log('URL:', url, 'Method:', method); // Debug

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            console.log('Response status:', response.status); // Debug

            if (response.ok) {
                const result = await response.json();
                console.log('Libro guardado:', result); // Debug
                await obtenerLibros();
                setMostrarFormulario(false);
                setEditando(null);
                setFormData({ titulo: '', autor: '', anio: '', estadoLectura: 'por leer', generoId: '' });
                alert(editando ? 'Libro actualizado correctamente' : 'Libro creado correctamente');
            } else {
                const error = await response.text();
                console.error('Error del servidor:', error);
                alert('Error al guardar el libro: ' + error);
            }
        } catch (error) {
            console.error('Error al guardar el libro', error);
            alert('Error de conexión: ' + error.message);
        }
    };

    const handleEdit = (libro) => {
        setEditando(libro);
        setFormData({
            titulo: libro.titulo,
            autor: libro.autor,
            anio: libro.anio,
            estadoLectura: libro.estadoLectura,
            generoId: libro.generoId || libro.genero?.id || ''
        });
        setMostrarFormulario(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Estas seguro de que quieres eliminar este libro?')) {
            try {
                const response = await fetch(`${apiBase.replace(/\/$/, '')}/libros/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    await obtenerLibros();
                }
            } catch (error) {
                console.error('Error al eliminar el libro', error);
            }
        }
    };

    const handleNuevoGeneroSubmit = async (e) => {
        e.preventDefault();

        if (!nuevoGenero.trim()) {
            alert('Ingresa el nombre del genero');
            return;
        }

        try {
            const response = await fetch(`${apiBase.replace(/\/$/, '')}/generos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nuevoGenero.trim() }),
            });

            if (response.ok) {
                setNuevoGenero('');
                await obtenerGeneros();
                alert('Genero creado correctamente');
            } else {
                const errorText = await response.text();
                console.error('Error al crear genero:', errorText);
                alert('Error al crear genero: ' + errorText);
            }
        } catch (error) {
            console.error('Error al crear género', error);
            alert('Error de conexión al crear género');
        }
    };

    const handleEliminarGenero = async (id) => {
        if (!window.confirm('Estas seguro de que quieres eliminar este genero?')) return;

        try {
            const response = await fetch(`${apiBase.replace(/\/$/, '')}/generos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                await obtenerGeneros();
                alert('Genero eliminado correctamente');
            }
        } catch (error) {
            console.error('Error al eliminar el genero')
        }
    };

    const handleEditarGenero = async (genero) => {
        const nuevoNombre = prompt(
            'Nuevo nombre del genero: ',
            genero.nombre
        );
        if (!nuevoNombre) return;

        try{
            const response = await fetch(`${apiBase.replace(/\/$/, '')}/generos/${genero.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevoNombre.trim() })
            });
            if (response.ok) {
                await obtenerGeneros();
                alert('Genero actualizado correctamente');
            }
        } catch (error) {
            console.error('Error al editar el genero', error);
            alert('Error de conexión al editar género');
        }
    }

    const handleCancel = () => {
        setMostrarFormulario(false);
        setEditando(null);
        setFormData({ titulo: '', autor: '', anio: '', estadoLectura: 'por leer', generoId: '' });
    };

    if (cargando) return <p>Cargando libros...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Lista de libros</h2>

            <button
                onClick={() => setMostrarFormulario(true)}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Agregar Nuevo Libro
            </button>

            {mostrarFormulario && (
                <div style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>{editando ? 'Editar Libro' : 'Nuevo Libro'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Título:</label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Autor:</label>
                            <input
                                type="text"
                                value={formData.autor}
                                onChange={(e) => setFormData({...formData, autor: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Año:</label>
                            <input
                                type="number"
                                value={formData.anio}
                                onChange={(e) => setFormData({...formData, anio: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Estado de Lectura:</label>
                            <select
                                value={formData.estadoLectura}
                                onChange={(e) => setFormData({...formData, estadoLectura: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            >
                                <option value="por leer">Por leer</option>
                                <option value="leyendo">Leyendo</option>
                                <option value="leido">Leído</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label>Género:</label>
                            {generos.length > 0 ? (
                                <select
                                    value={formData.generoId}
                                    onChange={(e) => setFormData({...formData, generoId: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                >
                                    <option value="">Selecciona un género</option>
                                    {generos.map((genero) => (
                                        <option key={genero.id} value={genero.id}>
                                            {genero.nombre}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="number"
                                    value={formData.generoId}
                                    onChange={(e) => setFormData({...formData, generoId: e.target.value})}
                                    required
                                    placeholder="Ingresa ID de género"
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            )}
                            {generos.length === 0 && (
                                <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px' }}>
                                    No hay géneros cargados en la API. Si no hay opciones, crea un género primero o ingresa el ID manualmente.
                                </p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                {editando ? 'Actualizar' : 'Crear'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {libros.length === 0 ? (
                <p>No hay libros registrados!</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {libros.map((libro) => (
                        <li key={libro.id} style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '4px',
                            backgroundColor: '#fff'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{libro.titulo}</strong> - {libro.autor} ({libro.anio})<br />
                                    Estado: {libro.estadoLectura} | Género: {libro.genero?.nombre || 'Sin género'}
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleEdit(libro)}
                                        style={{
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '5px'
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(libro.id)}
                                        style={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f6f9ff' }}>
                <h3>Generos</h3>
                <p style={{ marginBottom: '15px', color: '#555' }}>
                    Generos existentes y crear nuevos generos para usar en tus libros!
                </p>

                <form onSubmit={handleNuevoGeneroSubmit} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={nuevoGenero}
                            onChange={(e) => setNuevoGenero(e.target.value)}
                            placeholder="Nombre del genero"
                            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Crear genero
                        </button>
                    </div>
                </form>

                {cargandoGeneros ? (
                    <p>Cargando generos...</p>
                ) : generos.length === 0 ? (
                    <p>No hay generos creados.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {generos.map((genero) => (
                            <li
                                key={genero.id}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div> 
                                        <strong>{genero.nombre}</strong>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEditarGenero(genero)}
                                            style={{
                                                backgroundColor: '#ff9800',
                                                color: 'white',
                                                padding: '5px 10px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginRight: '5px'
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminarGenero(genero.id)}
                                            style={{
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                padding: '5px 10px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ListaLibros;