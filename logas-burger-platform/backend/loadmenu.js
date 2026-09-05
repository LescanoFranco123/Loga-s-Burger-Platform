// Crea la base de datos (si no existe) y carga el menú desde database/menu.sql.
// Uso: node loadmenu.js  (o "npm run seed")

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "database", "database.db");
const initSqlPath = path.join(__dirname, "database", "init.sql");
const menuSqlPath = path.join(__dirname, "database", "menu.sql");

const db = new sqlite3.Database(dbPath);

const initSql = fs.readFileSync(initSqlPath, "utf8");
const menuSql = fs.readFileSync(menuSqlPath, "utf8");

db.serialize(() => {
  db.run(initSql.replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS"));

  db.get("SELECT COUNT(*) AS total FROM products", (err, row) => {
    if (err) {
      console.error("Error al leer la tabla products:", err.message);
      return db.close();
    }

    if (row.total > 0) {
      console.log(`La tabla ya tiene ${row.total} productos, no se vuelve a cargar el menú.`);
      return db.close();
    }

    db.exec(menuSql, (err) => {
      if (err) {
        console.error("Error al cargar el menú:", err.message);
      } else {
        console.log("Menú cargado correctamente en database.db");
      }
      db.close();
    });
  });
});
