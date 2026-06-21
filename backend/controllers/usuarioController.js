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
                expiresIn: "30s" //CAMBIAR DESPUES
            }
        );

        const refreshToken = jwt.sign(
            { id: usuario.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d"}
        );

        console.log("Creando refresh token");
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none" //TEMPORAL
        });

        res.status(200).json({
            mensaje: "Login exitoso!",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        })
    }catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("Cookies recibidas:", req.cookies);
    if (!refreshToken) return res.status(401).json({ error: "No hay refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            console.log("Error verificando token", err.message);
            return res.status(403).json({ error: "Refresh token invalido" })
        }

        const nuevoAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "1m" }
        );

    res.json({ token: nuevoAccessToken });
  });
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    refreshToken
}