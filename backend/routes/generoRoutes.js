const express = require ('express');
const router = express.Router();
const generoController= require ('../controllers/generoController');

router.get('/', generoController.obtenerTodos);
router.post('/', generoController.crear);

module.exports = router;