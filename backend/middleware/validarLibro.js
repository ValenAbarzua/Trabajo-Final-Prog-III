const validarLibro = (req, res, next) => {
    const { titulo, autor, anio, generoId} = req.body;
    if (!titulo || !autor || !anio || !generoId) {
        return res.status(400).json({ error: 'Campos obligatorios de completar: titulo, autor, año, generoId' });
    }
    if (typeof titulo !== 'string' || typeof autor !== 'string') {
        return res.status(400).json({ error: 'Los campos titulo y autor deben ser cadenas de texto' });
    }
    if (!anio || isNaN(anio) || anio < 1800 || anio > new Date().getFullYear()) {
        return res.status(400).json({ error: 'El año debe ser un numero válido' });
    }
    next();
};
module.exports = validarLibro;