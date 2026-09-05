CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    available INTEGER DEFAULT 1
);

-- Tabla de usuarios para el login del panel administrador.
-- Nota: esta tabla también se crea automáticamente al iniciar el servidor
-- (ver backend/models/usermodel.js), así que no hace falta correr este
-- script a mano para que funcione el login.
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);