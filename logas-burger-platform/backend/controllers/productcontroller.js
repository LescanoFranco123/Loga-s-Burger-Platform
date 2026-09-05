const db = require("../models/productmodel");

const getProducts = (req, res) => {
  const sql = "SELECT * FROM products";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al obtener los productos"
      });
    }

    res.json(rows);
  });
};

const createProduct = (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      error: "Nombre, precio y categoría son obligatorios"
    });
  }

  const sql = `
    INSERT INTO products (name, description, price, category)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, description || "", price, category],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error al crear el producto"
        });
      }

      res.status(201).json({
        message: "Producto creado correctamente",
        product: {
          id: this.lastID,
          name,
          description: description || "",
          price,
          category,
          available: 1
        }
      });
    }
  );
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, available } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({
      error: "Nombre, precio y categoría son obligatorios"
    });
  }

  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, category = ?, available = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      name,
      description || "",
      price,
      category,
      available === undefined ? 1 : available,
      id
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error al actualizar el producto"
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Producto no encontrado"
        });
      }

      res.json({
        message: "Producto actualizado correctamente"
      });
    }
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al eliminar el producto"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      message: "Producto eliminado correctamente"
    });
  });
};

const renameCategory = (req, res) => {
  const { oldCategory, newCategory } = req.body;

  if (!oldCategory || !newCategory) {
    return res.status(400).json({
      error: "Falta la categoría actual o el nuevo nombre"
    });
  }

  const sql = "UPDATE products SET category = ? WHERE category = ?";

  db.run(sql, [newCategory, oldCategory], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error al renombrar la categoría"
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "No se encontraron productos con esa categoría"
      });
    }

    res.json({
      message: `Categoría renombrada correctamente (${this.changes} productos actualizados)`
    });
  });
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  renameCategory
};