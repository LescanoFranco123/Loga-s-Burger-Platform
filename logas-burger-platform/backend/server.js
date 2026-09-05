require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productroutes");
const authRoutes = require("./routes/authroutes");

const app = express();

// CORS: por defecto permite cualquier origen (cómodo para desarrollo local).
// En producción podés restringirlo definiendo CORS_ORIGIN con la URL exacta
// de tu frontend (ej: https://tuapp.vercel.app), así solo esa web puede
// llamar a la API.
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/products", productRoutes);
app.use("/auth", authRoutes);

// Los hosting como Render, Railway o Fly asignan su propio puerto a través
// de la variable de entorno PORT. En tu máquina local, si no está definida,
// usamos 5000 como antes.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});