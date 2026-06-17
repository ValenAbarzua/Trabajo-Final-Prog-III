const express = require ('express');
const router = express.Router();
const libroController= require ('../controllers/libroController');
const validarLibro = require('../middleware/validarLibro');
const verificarToken = require('../middleware/verificarToken');

router.get('/', verificarToken, libroController.obtenerTodos);
router.post('/', verificarToken, validarLibro, libroController.crear);
router.get('/:id', verificarToken, libroController.ObtenerId );
router.put('/:id', verificarToken, libroController.actualizar);
router.delete('/:id', verificarToken, libroController.eliminar);

module.exports = router;