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

    useEffect(() => {
        obtenerLibros();
    }, [obtenerLibros]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editando
                ? `${apiBase.replace(/\/$/, '')}/libros/${editando.id}`
                : `${apiBase.replace(/\/$/, '')}/libros`;

            const method = editando ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await obtenerLibros();
                setMostrarFormulario(false);
                setEditando(null);
                setFormData({ titulo: '', autor: '', anio: '', generoId: '' });
            }
        } catch (error) {
            console.error('Error al guardar el libro', error);
        }
    };

    const handleEdit = (libro) => {
        setEditando(libro);
        setFormData({
            titulo: libro.titulo,
            autor: libro.autor,
            anio: libro.anio,
            estadoLectura: libro.estadoLectura,
            generoId: libro.generoId || ''
        });
        setMostrarFormulario(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
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
        </div>
    );
};

export default ListaLibros;