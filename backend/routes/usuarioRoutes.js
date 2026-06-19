const express = require ('express');
const router = express.Router();
const {
    registrarUsuario,
    loginUsuario,
    refreshToken
} = require ("../controllers/usuarioController");

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.post("/refresh", refreshToken); 

module.exports = router;