import axios from "axios";

// En local, si no configurás nada, apunta a tu backend en localhost:5000.
// Para producción (Vercel, Netlify, etc.), definí la variable de entorno
// VITE_API_URL con la URL pública de tu backend, por ejemplo:
//   VITE_API_URL=https://logas-burger-api.onrender.com
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

// Agrega automáticamente el token guardado (si existe) a cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Si el backend responde 401 (sesión inválida o vencida), limpiamos la
// sesión guardada y mandamos al usuario de vuelta al login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
