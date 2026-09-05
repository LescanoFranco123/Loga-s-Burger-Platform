// Conexión única a SQLite para todo el backend.
//
// Antes había dos módulos (productmodel.js y usermodel.js) que abrían la
// base de datos con una ruta relativa ("./database/database.db"). Eso sólo
// funciona si el proceso de Node se ejecuta exactamente desde la carpeta
// backend/, y además el archivo database.db no viaja en el repo/zip
// (está en .gitignore), así que en una instalación nueva la tabla
// "products" no existía y el backend fallaba al pedir el menú.
//
// Ahora usamos __dirname para armar una ruta absoluta (funciona sin
// importar desde dónde se ejecute "node"), creamos las tablas si no
// existen, y si la tabla de productos está vacía, la sembramos
// automáticamente con database/menu.sql. Así "npm install && npm start"
// deja todo funcionando sin pasos manuales extra.

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databaseDir = path.join(__dirname, "..", "database");
const dbPath = path.join(databaseDir, "database.db");
const menuSqlPath = path.join(databaseDir, "menu.sql");

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("No se pudo abrir la base de datos:", err);
  }
});

db.serialize(() => {
  db.run(
    `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        available INTEGER DEFAULT 1
      )
    `,
    (err) => {
      if (err) {
        console.error("Error creando la tabla de productos:", err);
        return;
      }

      // Si la tabla quedó vacía (primera vez que se corre el proyecto),
      // cargamos el menú de ejemplo automáticamente.
      db.get("SELECT COUNT(*) AS total FROM products", (err, row) => {
        if (err) {
          console.error("Error al verificar la tabla de productos:", err);
          return;
        }

        if (row.total > 0) return;

        if (!fs.existsSync(menuSqlPath)) {
          console.warn(
            "No se encontró database/menu.sql: el menú va a arrancar vacío."
          );
          return;
        }

        const menuSql = fs.readFileSync(menuSqlPath, "utf8");

        db.exec(menuSql, (err) => {
          if (err) {
            console.error("Error al cargar el menú inicial:", err);
          } else {
            console.log("Menú inicial cargado en database.db");
          }
        });
      });
    }
  );

  db.run(
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    (err) => {
      if (err) {
        console.error("Error creando la tabla de usuarios:", err);
      }
    }
  );
});

module.exports = db;
