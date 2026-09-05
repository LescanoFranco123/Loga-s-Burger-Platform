const jwt = require("jsonwebtoken");

// IMPORTANTE: en producción, definí esta clave como variable de entorno JWT_SECRET
// en vez de dejarla escrita acá.
const JWT_SECRET = process.env.JWT_SECRET || "logas-burger-secret-cambiar-en-produccion";

// Bloquea la petición si no hay un token válido de la sesión iniciada.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No autorizado. Iniciá sesión para continuar."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Sesión inválida o expirada. Iniciá sesión nuevamente."
    });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
