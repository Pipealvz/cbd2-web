import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = sessionStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 El ÚNICO logout válido
  const logout = () => {
    setAuth(null);
    setError(null);
    setLoading(false);
    sessionStorage.removeItem("auth");
  };

  // Persistir sessionStorage
  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [auth]);

  // Login
  async function login(credentials) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:26001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        let msg = `Error ${res.status}`;
        try {
          const j = await res.json();
          msg = j.message || JSON.stringify(j);
        } catch (e) {
          msg = await res.text();
        }
        throw new Error(msg || "Error en inicio de sesión");
      }

      const data = await res.json();

      if (!data || !data.token) {
        throw new Error("La respuesta del servidor no contiene 'token'.");
      }

      setAuth(data); // Guarda user + token
      return data;

    } catch (err) {
      setError(err.message || "Error desconocido");
      throw err;

    } finally {
      setLoading(false);
    }
  }

  // Header autorizado
  function getAuthHeader() {
    if (!auth || !auth.token) return {};
    return { Authorization: `Bearer ${auth.token}` };
  }

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, loading, error, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
