import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveSession } from "../Services/AuthService";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Completá usuario y contraseña");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await login(username, password);
      saveSession(data);

      navigate("/admin");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      const mensaje = err.response?.data?.error || "No se pudo iniciar sesión";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container admin-page">
      <header className="admin-header">
        <h1>Iniciar sesión</h1>
        <p>Panel administrador de Loga's Burger</p>
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label>
            Usuario
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
