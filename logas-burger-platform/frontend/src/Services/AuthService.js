import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });

  return response.data;
};

export const saveSession = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem("user");

  return raw ? JSON.parse(raw) : null;
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};
