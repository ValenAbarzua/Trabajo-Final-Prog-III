const jwt = require('jsonwebtoken');
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({error: 'Debes obtener un Token!'})
    };
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next()
    } catch (error) {
        return res.status(401).json({error: 'El token es invalido o expiro!'})
    };
};
module.exports= verificarToken;