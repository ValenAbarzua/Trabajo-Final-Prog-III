const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");
const db = require ("../models");
const Usuario = db.Usuario;

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });
    
    if (usuarioExistente) {
        return res.status(400).json({ mensaje: "El email ya esta registrado!"})
    };

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({
        nombre,
        email,
        password: passwordHash
    });

    res.status(201).json({
        mensaje: "Usuario creado correctamente!",
        usuario: {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        }
    });
    }catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
};

const loginUsuario = async (req, res) => {
    try{
        const { email, password }= req.body;
        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(404).json({mensaje: "Usuario no encontrado"})
        };

        const passwordValida= await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({mensaje: "Contraseña incorrecta"})
        };
        
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            mensaje: "Login exitoso!",
            token
        })
    }catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario
}