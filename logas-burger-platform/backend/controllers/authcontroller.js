const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../models/usermodel");
const { JWT_SECRET } = require("../middleware/authmiddleware");

// El sistema está pensado para un único usuario administrador.
// Esa cuenta NO se crea desde la web: se crea (o se resetea) corriendo
// el script backend/create-admin.js desde la terminal del servidor.
// Así nadie puede darse de alta por su cuenta ni crear cuentas extra.
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Usuario y contraseña son obligatorios"
    });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al iniciar sesión" });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Inicio de sesión correcto",
      token,
      user: { id: user.id, username: user.username }
    });
  });
};

module.exports = { login };
