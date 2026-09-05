import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  renameCategory
} from "../Services/ProductService";
import { logout, getCurrentUser } from "../Services/AuthService";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  available: 1
};

function AdminPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [oldCategory, setOldCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudo cargar el menú. Verificá que el backend esté funcionando.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      setError("Nombre, precio y categoría son obligatorios");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      available: Number(form.available)
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      console.error("Error guardando el producto:", err);
      setError("No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      available: product.available
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Eliminar este producto del menú?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Error eliminando el producto:", err);
      setError("No se pudo eliminar el producto.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const categories = [...new Set(products.map((p) => p.category))].sort();

  const categorySuggestions = [
    ...new Set([...categories, "Menú del Día", "Promociones"])
  ].sort();

  const handleRenameCategory = async (e) => {
    e.preventDefault();

    if (!oldCategory || !newCategory) {
      setError("Elegí la categoría a renombrar y escribí el nuevo nombre");
      return;
    }

    const confirmed = window.confirm(
      `¿Renombrar "${oldCategory}" a "${newCategory}" en todos los productos?`
    );
    if (!confirmed) return;

    try {
      setRenaming(true);
      setError("");

      await renameCategory(oldCategory, newCategory);

      setOldCategory("");
      setNewCategory("");
      await loadProducts();
    } catch (err) {
      console.error("Error renombrando la categoría:", err);
      setError("No se pudo renombrar la categoría.");
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="container admin-page">
      <header className="admin-header admin-header-with-actions">
        <div>
          <h1>Panel Administrador</h1>
          <p>Gestión del menú de Loga's Burger</p>
          {currentUser && (
            <p className="admin-form-hint">Sesión iniciada como {currentUser.username}</p>
          )}
        </div>

        <div className="admin-header-actions">
          <button type="button" className="admin-btn-secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>

        <p className="admin-form-hint">
          Tip: para que un ítem aparezca en la sección "Menú del Día" de la carta,
          cargalo con categoría <strong>Menú del Día</strong>. Para que aparezca
          en "Promociones", usá la categoría <strong>Promociones</strong>.
        </p>

        <div className="admin-form-grid">
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Categoría
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              list="category-options"
              placeholder='Ej: "Menú del Día", "Promociones", "Pizzas"...'
              required
            />
            <datalist id="category-options">
              {categorySuggestions.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          <label>
            Precio
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            Disponible
            <select name="available" value={form.available} onChange={handleChange}>
              <option value={1}>Sí</option>
              <option value={0}>No</option>
            </select>
          </label>

          <label className="admin-form-full">
            Descripción
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
            />
          </label>
        </div>

        <div className="admin-form-actions">
          <button type="submit" disabled={saving}>
            {editingId ? "Guardar cambios" : "Agregar producto"}
          </button>

          {editingId && (
            <button type="button" className="admin-btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <form className="admin-form" onSubmit={handleRenameCategory}>
        <h2>Renombrar categoría</h2>

        <div className="admin-form-grid">
          <label>
            Categoría actual
            <select
              value={oldCategory}
              onChange={(e) => setOldCategory(e.target.value)}
            >
              <option value="">Elegí una categoría</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nuevo nombre
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </label>
        </div>

        <div className="admin-form-actions">
          <button type="submit" disabled={renaming}>
            Renombrar categoría
          </button>
        </div>
      </form>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Disponible</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.available ? "Sí" : "No"}</td>
                <td className="admin-table-actions">
                  <button type="button" onClick={() => handleEdit(product)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;
