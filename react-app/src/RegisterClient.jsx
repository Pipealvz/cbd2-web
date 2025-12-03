import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const initialState = {
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    telefono: 0,
    fecha_nacimiento: "",
    password: "",
    confirmarPassword: "",
};

function RegisterClient() {
    const [form, setForm] = useState(initialState);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmarPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        // Validación de fecha de nacimiento
        if (form.fecha_nacimiento) {
            const fecha = new Date(form.fecha_nacimiento);
            const hoy = new Date();
            if (fecha > hoy) {
                await Swal.fire({
                    title: "Error",
                    text: "La fecha de nacimiento no puede ser futura.",
                    icon: "error"
                });
                return;
            }
            // Calcular edad
            let edad = hoy.getFullYear() - fecha.getFullYear();
            const m = hoy.getMonth() - fecha.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
                edad--;
            }
            if (edad < 18) {
                await Swal.fire({
                    title: "Error",
                    text: "Debes ser mayor de 18 años.",
                    icon: "error"
                });
                return;
            }
        }
        setLoading(true);
        try {
            let fechaOracle = null;
            if (form.fecha_nacimiento) {
                // YYYY-MM-DD → YYYY-MM-DD"T"HH:mm:ss
                const d = new Date(form.fecha_nacimiento);
                const pad = (n) => n.toString().padStart(2, '0');
                fechaOracle = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            }
            await axios.post("http://localhost:26001/api/persona", {
                id_persona: Math.floor(Math.random() * 9000000000) + 1000000000,
                nombre: form.nombre,
                primer_apellido: form.primer_apellido,
                segundo_apellido: form.segundo_apellido,
                correo: form.correo,
                telefono: form.telefono,
                id_perfil: 2, // Cliente
                contrasena: form.password,
                fecha_nacimiento: fechaOracle,
            });
            await Swal.fire({
                title: "Éxito",
                text: "Registro exitoso",
                icon: "success"
            });
            navigate("/login");
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const bloquear = (e) => {
        const prohibidos = ["0-9", "e", "E", "+", "-", "."];
        if (prohibidos.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f4f7fb" }}>
            <div className="w-50 shadow p-4" style={{ borderRadius: 16, background: "#fff" }}>
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#0d6efd" }}>Registro de Cliente</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Fecha de nacimiento</label>
                            <input type="date" className="form-control" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Primer Apellido</label>
                            <input type="text" className="form-control" name="primer_apellido" value={form.primer_apellido} onChange={handleChange} required />
                        </div>
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Segundo Apellido</label>
                            <input type="text" className="form-control" name="segundo_apellido" value={form.segundo_apellido} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Correo electrónico</label>
                            <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} required />
                        </div>
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Teléfono</label>
                            <input
                                type="number"
                                className="form-control"
                                name="telefono"
                                value={form.telefono}
                                min="0"
                                onChange={e => {
                                    const val = e.target.value;
                                    // Solo permitir números positivos
                                    if (/^\d*$/.test(val)) {
                                        setForm({ ...form, telefono: val });
                                    }
                                }}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                onKeyDown={bloquear}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Contraseña</label>
                            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required minLength={6} />
                        </div>
                        <div className="col-6">
                            <label className="form-label fw-semibold" style={{ color: "#0d6efd" }}>Confirmar contraseña</label>
                            <input type="password" className="form-control" name="confirmarPassword" value={form.confirmarPassword} onChange={handleChange} required minLength={6} />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading} style={{ borderRadius: 8 }}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default RegisterClient;
