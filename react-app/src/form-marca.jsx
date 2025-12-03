import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

function FormMarca({ onCreated }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        id_marca: Math.floor(Math.random() * 90000000) + 10000000,
        nombre_marca: ""
    });

    //console.log(form);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:26001/api/marca", {
                id_marca: form.id_marca,
                nombre_marca: form.nombre_marca,
            });
            if (onCreated) onCreated();
            await Swal.fire({
                title: "Éxito",
                text: "Marca creada correctamente",
                icon: "success"
            });
            navigate('/marcas');
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
                <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Nombre Marca</label>
                <input type="text" className="form-control" name="nombre_marca" value={form.nombre_marca} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading} style={{ borderRadius: 8 }}>
                {loading ? "Registrando..." : "Registrar Marca"}
            </button>
        </form>
    );
}

export default FormMarca;
