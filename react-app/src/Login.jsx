import React, { useState } from "react";
import { useAuth } from "./auth/AuthProvider";

export default function Login() {
  const { login, loading, error } = useAuth();

  // ahora usamos los nombres reales que tu API espera
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [localError, setLocalError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.correo || !form.contrasena) {
      setLocalError("Por favor completa correo y contraseña.");
      return;
    }

    try {
      // Aquí enviamos los nombres correctos para tu backend
      await login({
        correo: form.correo,
        contrasena: form.contrasena,
      });
      
      // AuthProvider se encarga de guardar token en sessionStorage
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <div className="card shadow-sm" style={{ width: 420 }}>
        <div className="card-body">
          <h4 className="card-title text-primary mb-2">Iniciar sesión</h4>
          <p className="text-muted small mb-4">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small">Correo</label>
              <input
                type="email"
                className="form-control"
                placeholder="correo@ejemplo.com"
                value={form.correo}
                onChange={handleChange("correo")}
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={form.contrasena}
                onChange={handleChange("contrasena")}
                autoComplete="current-password"
              />
            </div>

            {(localError || error) && (
              <div className="alert alert-danger py-2" role="alert">
                {localError || error}
              </div>
            )}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Iniciando..." : "Iniciar sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
