const express = require ('express');
const router = express.Router();
const generoController= require ('../controllers/generoController');
const verificarToken = require('../middleware/verificarToken');

router.get('/', generoController.obtenerTodos);
router.post('/', verificarToken, generoController.crear);
router.put('/:id', verificarToken, generoController.editar);
router.delete('/:id', verificarToken, generoController.eliminar);

module.exports = router;