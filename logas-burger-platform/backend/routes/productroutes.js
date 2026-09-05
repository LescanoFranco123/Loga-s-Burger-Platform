const express = require("express");

const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  renameCategory
} = require("../controllers/productcontroller");

const { authMiddleware } = require("../middleware/authmiddleware");

// El menú (GET) queda público para que los clientes puedan verlo sin loguearse.
// Crear, editar, borrar productos y renombrar categorías requiere estar logueado.
router.get("/", getProducts);
router.post("/", authMiddleware, createProduct);
router.put("/categories/rename", authMiddleware, renameCategory);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;