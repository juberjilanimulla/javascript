// frontend/src/pages/Auth/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import api from "../../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const u = res.data.data.user;
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    const u = res.data.data.user;
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    return u;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used inside <AuthProvider>. Check main.jsx."
    );
  }
  return ctx;
}