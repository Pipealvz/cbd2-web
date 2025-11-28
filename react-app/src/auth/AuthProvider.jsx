import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthProvider
 * - Guarda el objeto auth en sessionStorage bajo la key "auth".
 * - login(credentials) -> POST a http://localhost:26001/login
 *   Espera respuesta JSON con al menos { user: {...}, token: "..." }.
 * - logout() -> limpia sessionStorage y el estado
 * - getAuthHeader() -> { Authorization: 'Bearer ...' } si hay token
 */

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

  // Persistir sessionStorage cuando cambie auth
  useEffect(() => {
    try {
      if (auth) sessionStorage.setItem("auth", JSON.stringify(auth));
      else sessionStorage.removeItem("auth");
    } catch (e) {
      // ignore
    }
  }, [auth]);

  // login: POST a la API
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
        // tratar posible JSON de error
        let msg = `Error ${res.status}`;
        try {
          const j = await res.json();
          msg = j.message || JSON.stringify(j);
        } catch (e) {
          try {
            msg = await res.text();
          } catch (e2) {}
        }
        throw new Error(msg || "Error en inicio de sesión");
      }

      const data = await res.json();
      if (!data || !data.token) {
        throw new Error("La respuesta del servidor no contiene 'token'.");
      }

      setAuth(data); // guarda user+token tal cual venga
      return data;
    } catch (err) {
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuth(null);
    setError(null);
    setLoading(false);
    try {
      sessionStorage.removeItem("auth");
    } catch (e) {
      // ignore
    }
  }

  function getAuthHeader() {
    if (!auth || !auth.token) return {};
    return { Authorization: `Bearer ${auth.token}` };
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, error, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}