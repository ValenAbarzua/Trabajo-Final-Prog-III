//Middleware para validar el cuerpo de la request tenga campos validos al crear o editar libros.
module.exports = ((req, res, next) => {
    const camposEsperados = ['titulo', 'autor', 'anio', 'estadoLectura', 'calificacion', 'generoId'];
    const camposEnviados = Object.keys(req.body);
    const camposExtra = camposEnviados.filter(c => !camposEsperados.includes(c));

    if (camposExtra.length > 0){
        return res.status(400).json({
            error: `Campos no validos:  ${camposExtra.join(', ')}`
        });
    };
    next();
})