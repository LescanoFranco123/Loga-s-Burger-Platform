import { useEffect, useState } from "react";
import { getProducts } from "../Services/ProductService";

function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(
        "No se pudo cargar el menú. Verificá que el backend esté funcionando."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeEmojis = (text) => {
    return text
      .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  // Normaliza para comparar categorías sin importar emojis, mayúsculas,
  // tildes o espacios extra (así "Menú del Día", "menu del dia", etc. matchean).
  const normalizeCategory = (text) => {
    return removeEmojis(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const DAILY_MENU_KEY = "menu del dia";
  const PROMOTIONS_KEY = "promociones";

  const dailyMenuItems = products.filter(
    (product) => normalizeCategory(product.category) === DAILY_MENU_KEY
  );

  const promotionItems = products.filter(
    (product) => normalizeCategory(product.category) === PROMOTIONS_KEY
  );

  const groupedProducts = products.reduce((acc, product) => {
    const normalized = normalizeCategory(product.category);

    if (normalized === DAILY_MENU_KEY || normalized === PROMOTIONS_KEY) {
      return acc;
    }

    let category = removeEmojis(product.category || "Otros");

    if (category === "Papas y Guarniciones") {
      category = "Entradas";
    }

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(product);

    return acc;
  }, {});

  return (
    <div className="container">

      <header className="hero">
        <img
          src="/images/logo.png"
          alt="Logo Club"
          className="logo"
        />

        <h1>BUFFET LOGA</h1>
        <p>Carta Digital</p>
      </header>

      {(dailyMenuItems.length > 0 || promotionItems.length > 0) && (
        <section className="daily-menu">

          {dailyMenuItems.length > 0 && (
            <>
              <h2>MENÚ DEL DÍA</h2>

              {dailyMenuItems.map((item) => (
                <div className="daily-menu-card" key={item.id}>
                  <h3>{item.name}</h3>

                  {item.description && <p>{item.description}</p>}

                  <strong>${item.price}</strong>
                </div>
              ))}
            </>
          )}

          {promotionItems.length > 0 && (
            <div className="daily-menu-promotions">

              <h3>PROMOCIONES</h3>

              {promotionItems.map((item) => (
                <div className="promotion" key={item.id}>
                  <strong>{item.name}</strong>

                  {item.description && <small>{item.description}</small>}

                  <span>${item.price}</span>
                </div>
              ))}

            </div>
          )}

        </section>
      )}

      {loading && (
        <p style={{ textAlign: "center" }}>
          Cargando menú...
        </p>
      )}

      {error && (
        <p
          style={{
            textAlign: "center",
            color: "#b33a00",
            fontWeight: "bold"
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No hay productos disponibles.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <main>

          {Object.entries(groupedProducts).map(
            ([category, categoryProducts]) => (

              <section
                key={category}
                className="category-section"
              >

                <h2>{category}</h2>

                <div className="products-grid">

                  {categoryProducts.map((product) => (

                    <div
                      className="product-card"
                      key={product.id}
                    >

                      <h3>{product.name}</h3>

                      {product.description && (
                        <p>{product.description}</p>
                      )}

                      <span>
                        ${product.price}
                      </span>

                    </div>

                  ))}

                </div>

              </section>

            )
          )}

        </main>
      )}

    </div>
  );
}

export default MenuPage;
