import React, {useEffect, useState, useCallback} from 'react';
import { fetchConToken } from '../utils/api';

const ListaLibros = ({onLogout}) => {
    const [libros, setLibros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [vista, setVista] = useState("libros");
    const [totalPaginas, setTotalPaginas]= useState(1);
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

    const nombreUsuario = localStorage.getItem("nombre");
    const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://trabajo-final-prog-iii.onrender.com/api';

    const obtenerLibros = useCallback(async () => {
        try {
            const response = await fetchConToken(`${apiBase.replace(/\/$/, '')}/libros?pagina=${pagina}&limite=5`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setLibros(data.libros || []);
            setTotalPaginas(data.totalPaginas || 0);
        } catch (error) {
            console.error('Error al obtener los libros', error);
        } finally {
            setCargando(false);
        }
    }, [apiBase, pagina]);

    const obtenerGeneros = useCallback(async () => {
        try {
            const response = await fetchConToken(`${apiBase.replace(/\/$/, '')}/generos`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
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
            generoId: formData.generoId ? parseInt(formData.generoId) : null,
            calificacion: formData.calificacion ? parseInt(formData.calificacion) : null
        };

        console.log('Enviando datos:', dataToSend); 
        try {
            const url = editando
                ? `${apiBase.replace(/\/$/, '')}/libros/${editando.id}`
                : `${apiBase.replace(/\/$/, '')}/libros`;

            const method = editando ? 'PUT' : 'POST';
            console.log('URL:', url, 'Method:', method);

            const response = await fetchConToken(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend),
            });

            console.log('Response status:', response.status); 

            if (response.ok) {
                const result = await response.json();
                console.log('Libro guardado:', result); 
                await obtenerLibros();
                setMostrarFormulario(false);
                setEditando(null);
                setFormData({ titulo: '', autor: '', anio: '', estadoLectura: 'por leer', generoId: '', calificacion: '' });
                alert(editando ? 'Libro actualizado correctamente' : 'Libro creado correctamente');
            } else {
                const error = await response.json();
                console.log("ERROR BACKEND ", error);
                alert(JSON.stringify(error)); //EDITAR
                //alert('Error al guardar el libro: ' + error.error);
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
            generoId: libro.generoId || libro.genero?.id || '',
            calificacion: libro.calificacion
        });
        setMostrarFormulario(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Estas seguro de que quieres eliminar este libro?')) {
            try {
                const response = await fetchConToken(`${apiBase.replace(/\/$/, '')}/libros/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    await obtenerLibros();
                    alert('Libro eliminado correctamente')
                }else {
                    const error = await response.json();
                    alert(error.error)
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
            const response = await fetchConToken(`${apiBase.replace(/\/$/, '')}/generos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ nombre: nuevoGenero.trim() }),
            });

            if (response.ok) {
                setNuevoGenero('');
                await obtenerGeneros();
                alert('Genero creado correctamente');
            } else {
                const error = await response.json();
                alert('Error al crear genero: ' + error.error);
            }
        } catch (error) {
            console.error('Error al crear género', error);
            alert('Error de conexión al crear género');
        }
    };

    const handleEliminarGenero = async (id) => {
        if (!window.confirm('Estas seguro de que quieres eliminar este genero?')) return;

        try {
            const response = await fetchConToken(`${apiBase.replace(/\/$/, '')}/generos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                await obtenerGeneros();
                alert('Genero eliminado correctamente');
            } else {
                const error = await response.json();
                alert(error.error);
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
            const response = await fetchConToken(`${apiBase.replace(/\/$/, '')}/generos/${genero.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ nombre: nuevoNombre.trim() })
            });
            if (response.ok) {
                await obtenerGeneros();
                alert('Genero actualizado correctamente');
            } else{
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error al editar el genero', error);
            alert('Error de conexión al editar género');
        }
    };

    const handleCancel = () => {
        setMostrarFormulario(false);
        setEditando(null);
        setFormData({ titulo: '', autor: '', anio: '', estadoLectura: 'por leer', generoId: '', calificacion: '' });
    };

    if (cargando) return <p>Cargando biblioteca personal...</p>;

    return (
        <div style={{ 
            padding: '20px', 
            width: '100%', 
            maxWidth: '900px',
            margin: '0 auto',
            boxSizing: 'border-box' 
            }}>
            <div
                style= {{
                    backgroundColor: '#6cb384',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    marginBottom: '25px',
                    color: 'white'
                }}
            >
                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}
                >
                    <h2 style={{margin: 0}}>
                        Biblioteca personal de {nombreUsuario}
                    </h2>

                    <button 
                        onClick={onLogout}
                        style={{
                            backgroundColor: '#F44336',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Cerrar sesion
                    </button>     
                </div>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px'
                }}
                >
                    <button 
                        onClick={() => setVista("libros")}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor:
                            vista === 'libros'
                                ? '#1f7421'
                                : '#e0e0e0',
                            color:
                            vista === 'libros'
                            ? 'white'
                            : 'black'
                        }}
                    >
                        Libros
                    </button>
                    <button 
                        onClick={() => setVista("generos")}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor:
                            vista === 'generos'
                                ? '#1f7421'
                                : '#e0e0e0',
                            color:
                            vista === 'generos'
                                ? 'white'
                                : 'black'
                        }}
                    >
                    Generos 
                    </button>
                </div>
            </div>
        {vista === "libros" && (
        <>
            <button
                onClick={() => setMostrarFormulario(true)}
                style={{
                    backgroundColor: '#1f7421',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                + Agregar un libro
            </button>

            {mostrarFormulario && (
                <div style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <div
                        style={{
                        background: '#f5f8ff',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px'
                    }}
                >
                <h3 style={{ marginTop: 0 }}>
                Mis Libros
                </h3>

                <p style={{ marginBottom: 0 }}>
                Tu biblioteca personal,
                agrega tus libros, edita su informacion
                y lleva tu seguimiento de lectura.
                </p>
            </div>
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
                        <div style={{ marginBottom: '10px'}}>
                            <label> Calificacion: </label>
                            <select
                                value={formData.calificacion || ''}
                                onChange={(e) => setFormData({ ...formData, calificacion: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                            <option value=""> Sin calificacion </option>
                            <option value="1">⭐ 1</option>
                            <option value="2">⭐⭐ 2</option>
                            <option value="3">⭐⭐⭐ 3</option>
                            <option value="4">⭐⭐⭐⭐ 4</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5</option>
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
                                    placeholder="Carga tus generos en la seccion 'Generos'"
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            )}
                            {generos.length === 0 && (
                                <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '8px' }}>
                                    No hay generos cargados! Si no hay opciones, crea un genero primero.
                                </p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#6cb384',
                                    color: 'white',
                                    padding: '10px',
                                    minWidth: '120px', 
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
                                    padding: '10px',
                                    minWidth: '120px',
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
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '10px'
                                }}>
                                <div style={{ marginBottom: '8px'}}>
                                    <strong>{libro.titulo}</strong> <br />
                                    {libro.autor} ({libro.anio}) <br />
                                    Estado: {libro.estadoLectura} | Género: {libro.genero?.nombre || 'Sin género'} <br />
                                    {libro.calificacion && (
                                        <span>
                                        Calificación: {"⭐".repeat(libro.calificacion)}
                                        </span>
                                    )} <br />

                                </div>
                                <div>
                                    <button
                                        onClick={() => handleEdit(libro)}
                                        style={{
                                            backgroundColor: '#6cb384',
                                            color: 'white',
                                            padding: '5px',
                                            minWidth: '100px',
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
                                            padding: '5px',
                                            minWidth: '100px',
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
            <div
                style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '20px'
            }}
            >
            <button
            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
            disabled={pagina === 1}
            >
            Anterior
            </button>

            <span>Página {pagina}</span>

            <button
                onClick={() => setPagina((prev) => prev + 1)}
                disabled= {pagina >= totalPaginas}
            >
            Siguiente
            </button>
            </div>
        </>
        )}

        {vista === "generos" && (
        <>
            <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f6f9ff' }}>
                <h3>Generos</h3>
                <p style={{ marginBottom: '15px', color: '#555' }}>
                    Generos guardados para poder utilizar en tus libros!
                </p>

                <form onSubmit={handleNuevoGeneroSubmit} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                                padding: '10px',
                                minWidth: '120px',
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
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{
                                     display: 'flex', 
                                     justifyContent: 'space-between', 
                                     alignItems: 'center',
                                     flexWrap: 'wrap',
                                     gap: '10px'
                                     }}>
                                    <div> 
                                        <strong>{genero.nombre}</strong>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEditarGenero(genero)}
                                            style={{
                                                backgroundColor: '#ff9800',
                                                color: 'white',
                                                padding: '5px',
                                                minWidth: '100px',
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
                                                padding: '5px',
                                                minWidth: '100px',
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
        </>
        )}
    </div>
    
    );
};





export default ListaLibros;