const express = require("express");

const router = express.Router();

const { login } = require("../controllers/authcontroller");

// Sólo existe login. La cuenta del administrador se crea con
// "npm run create-admin" desde la terminal, no desde una página web.
router.post("/login", login);

module.exports = router;
