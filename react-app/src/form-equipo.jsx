import React, { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const initialState = {
  id_tipo: 0,
  id_marca: 0,
  id_persona: "",
  especificaciones: "",
  equipo_serial: "",
};
function FormEquipo() {
  const { auth } = useAuth();
  const [form, setForm] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:26001/api/equipo", {
        id_equipo: Math.floor(Math.random() * 9000000000) + 1000000000, // 10 dígitos
        id_tipo: form.id_tipo,
        id_marca: form.id_marca,
        id_persona: auth?.user?.id_persona || auth?.user?.ID_PERSONA,
        especificaciones: form.especificaciones,
        equipo_serial: form.equipo_serial,
      });
      await Swal.fire({
        title: "Éxito",
        text: "Equipo creado correctamente",
        icon: "success"
      });
      setForm({ ...initialState });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || err.message,
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch marcas
    const fetchMarcas = async () => {
      try {
        const res = await axios.get("http://localhost:26001/api/marca");
        setMarcas(res.data || []);
        if ((!form.id_marca || form.id_marca === "") && res.data && res.data.length > 0) {
          const first = res.data[0].ID_MARCA || res.data[0].id_marca;
          setForm(f => ({ ...f, id_marca: first }));
        }
      } catch (err) {
        setMarcas([]);
      }
    };

    const fetchTipos = async () => {
      try {
        const res = await axios.get("http://localhost:26001/api/tipo-rep");
        setTipos(res.data || []);
        if ((!form.id_tipo || form.id_tipo === "") && res.data && res.data.length > 0) {
          const first = res.data[0].ID_TIPO_REP || res.data[0].id_tipo_rep;
          setForm(f => ({ ...f, id_tipo: first }));
        }
      } catch (err) {
        setTipos([]);
      }
    };

    fetchMarcas();
    fetchTipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4" style={{ maxWidth: 500, margin: "0 auto", borderRadius: 16 }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Registrar Equipo</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Tipo de Equipo</label>
            <select className="form-select" name="id_tipo" value={form.id_tipo} onChange={handleChange} required>
              <option value="" disabled>Seleccione un tipo</option>
              {tipos.map(t => (
                <option key={t.ID_TIPO_REP} value={t.ID_TIPO_REP}>
                  {t.NOMBRE_TIPO_REP}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Marca</label>
            <select className="form-select" name="id_marca" value={form.id_marca} onChange={handleChange} required>
              <option value="" disabled>Seleccione una marca</option>
              {marcas.map(m => (
                <option key={m.ID_MARCA} value={m.ID_MARCA}>
                  {m.NOMBRE_MARCA}
                </option>
              ))}
            </select>
          </div>
          {/* El ID Persona se toma del usuario logueado y no es editable */}
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Especificaciones</label>
            <textarea className="form-control" name="especificaciones" value={form.especificaciones} onChange={handleChange} rows={3} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Serial del Equipo</label>
            <input type="text" className="form-control" name="equipo_serial" value={form.equipo_serial} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading} style={{ borderRadius: 8 }}>
            {loading ? "Registrando..." : "Registrar Equipo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormEquipo;
