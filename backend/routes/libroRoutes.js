const express = require ('express');
const router = express.Router();
const libroController= require ('../controllers/libroController');
const validarLibro = require('../middleware/validarLibro');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/verificarToken');

router.get('/', libroController.obtenerTodos);
router.post('/login', (req,res) => {
    const usuario = {
        id: 1,
        nombre: 'Valen'
    };

    const token = jwt.sign(usuario, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.json({token});
})
router.post('/', verificarToken, libroController.crear);
router.get('/:id', libroController.ObtenerId );
router.put('/:id', verificarToken, libroController.actualizar);
router.delete('/:id', verificarToken, libroController.eliminar);

module.exports = router;