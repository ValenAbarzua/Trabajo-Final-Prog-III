const express = require ('express');
const router = express.Router();
const generoController= require ('../controllers/generoController');

router.get('/', generoController.obtenerTodos);
router.post('/', generoController.crear);
router.put('/:id', generoController.editar);
router.delete('/:id', generoController.eliminar);

module.exports = router;