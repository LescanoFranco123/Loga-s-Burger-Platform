// Script para crear (o resetear) el ÚNICO usuario administrador del panel.
//
// Uso:
//   node create-admin.js miusuario micontraseña
//
// o simplemente:
//   node create-admin.js
//   (te va a preguntar el usuario y la contraseña por consola)
//
// También podés usar: npm run create-admin -- miusuario micontraseña
//
// Este script SIEMPRE deja un solo usuario en la base de datos: si ya
// existía uno, lo borra y crea el nuevo. Así queda garantizado que nunca
// puede haber más de una cuenta con acceso al panel administrador, y la
// única forma de crear o cambiar esa cuenta es teniendo acceso a la
// terminal del servidor (no se puede hacer desde el navegador).

const readline = require("readline");
const bcrypt = require("bcryptjs");
const db = require("./models/db");

const askQuestion = (query) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

const run = async () => {
  let [, , username, password] = process.argv;

  if (!username) {
    username = await askQuestion("Usuario para el panel administrador: ");
  }

  if (!password) {
    password = await askQuestion("Contraseña (mínimo 6 caracteres): ");
  }

  if (!username || !password) {
    console.error("Usuario y contraseña son obligatorios.");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("La contraseña debe tener al menos 6 caracteres.");
    process.exit(1);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Borramos cualquier usuario anterior: sólo puede existir uno a la vez.
  db.run("DELETE FROM users", (err) => {
    if (err) {
      console.error("Error al limpiar usuarios anteriores:", err.message);
      process.exit(1);
    }

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) {
          console.error("Error al crear el usuario administrador:", err.message);
          process.exit(1);
        }

        console.log("");
        console.log(`✔ Usuario administrador "${username}" creado correctamente.`);
        console.log("  Ya podés iniciar sesión en /login con ese usuario y contraseña.");
        console.log("");
        process.exit(0);
      }
    );
  });
};

run();
