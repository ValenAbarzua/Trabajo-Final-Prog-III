const express = require ('express');
const router = express.Router();
const libroController= require ('../controllers/libroController');
const validarLibro = require('../middleware/validarLibro');

router.get('/', libroController.obtenerTodos);
router.post('/', validarLibro, libroController.crear);
router.get('/:id', libroController.ObtenerId );
router.put('/:id', libroController.actualizar);
router.delete('/:id', libroController.eliminar);

module.exports = router;