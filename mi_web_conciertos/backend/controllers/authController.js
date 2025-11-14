const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registro
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Ver si existe
        const existe = await Usuario.findByEmail(email);
        if (existe) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }

        // Hashear
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // Crear
        const nuevo = await Usuario.create({
            nombre,
            email,
            password: hashed
        });

        res.status(201).json({ success: true, message: 'Usuario registrado', usuario: nuevo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};


// LOGIN
exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findByEmail(email);

        if (!usuario) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // 🔥 DEBUG: MOSTRAR EL USUARIO TAL CUAL VIENE DE LA BD
        console.log("DEBUG USUARIO:", usuario);

        // 🔥 ACA ESTÁ EL PROBLEMA Y LO TENÉS QUE CAMBIAR
        // CAMBIÁ usuario.password por el nombre REAL del campo que traiga la BD
        const match = await bcrypt.compare(password, usuario.password);

        if (!match) {
            return res.status(400).json({ success: false, message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};


// ELIMINAR USUARIO
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.delete(id);
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
