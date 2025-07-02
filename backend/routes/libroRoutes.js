const express = require ('express');
const router = express.Router();
const libroController= require ('../controllers/libroController');

router.get('/', libroController.obtenerTodos);
router.post('/', libroController.crear);

module.exports = router;