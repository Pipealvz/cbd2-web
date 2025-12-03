import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

function FormTipoRep({ onCreated }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        id_tipo_rep: Math.floor(Math.random() * 90000000) + 10000000,
        nombre_tipo_rep: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:26001/api/tipo-rep", {
                id_tipo_rep: form.id_tipo_rep,
                nombre_tipo_rep: form.nombre_tipo_rep,
            });
            if (onCreated) onCreated();
            await Swal.fire({
                title: "Éxito",
                text: "Tipo de repuesto creado correctamente",
                icon: "success"
            });
            navigate('/tipos-rep');
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

    return (
        <form className="container-fluid p-3 w-50" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Nombre Tipo Rep</label>
                <input type="text" className="form-control" name="nombre_tipo_rep" value={form.nombre_tipo_rep} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading} style={{ borderRadius: 8 }}>
                {loading ? "Registrando..." : "Registrar Tipo Rep"}
            </button>
        </form>
    );
}

export default FormTipoRep;