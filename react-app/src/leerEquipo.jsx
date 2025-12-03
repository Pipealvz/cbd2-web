import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useAuth } from "./auth/AuthProvider";
import axios from "axios";

function LeerEquipo() {
    const { auth, getAuthHeader } = useAuth();
    const [equipos, setEquipos] = useState([]);
    const [vista, setVista] = useState("card");
    const [marcas, setMarcas] = useState([]);
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:26001/api/equipo/${auth.user.ID_PERSONA || auth.user?.id_persona}`,
                    { headers: { ...getAuthHeader() } }
                );
                setEquipos(res.data || []);
            } catch (err) {
                console.error("Error al obtener equipos:", err);
                setEquipos([]);
            }
        };

        const fetchMarcas = async () => {
            try {
                const res = await axios.get("http://localhost:26001/api/marca", { headers: { ...getAuthHeader() } });
                setMarcas(res.data || []);
            } catch (err) {
                setMarcas([]);
            }
        };

        const fetchTipos = async () => {
            try {
                const res = await axios.get("http://localhost:26001/api/tipo-rep", { headers: { ...getAuthHeader() } });
                setTipos(res.data || []);
            } catch (err) {
                setTipos([]);
            }
        };

        fetchEquipos();
        fetchMarcas();
        fetchTipos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const eliminarEquipo = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el equipo de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:26001/api/equipo/${id}`, { headers: { ...getAuthHeader() } });
                    setEquipos(prev => prev.filter(e => (e.ID_EQUIPO || e.id_equipo) !== id));
                    Swal.fire('Eliminado', 'El equipo ha sido eliminado.', 'success');
                } catch (err) {
                    Swal.fire('Error', 'No se pudo eliminar el equipo.', 'error');
                }
            }
        });
    };

    const verDetalles = (eq) => {
        const currentTipo = eq.TIPO_EQ || eq.ID_TIPO || eq.id_tipo || eq.TIPO || "";
        const currentMarca = eq.MARCA_EQ || eq.ID_MARCA || eq.id_marca || "";
        const currentSpec = eq.ESPECIFICACIONES || eq.especificaciones || "";
        const currentSerial = eq.EQUIPO_SERIAL || eq.equipo_serial || "";

        const tiposOptions = tipos.length
            ? tipos
                .map(
                    (t) => `<option value="${t.ID_TIPO_REP || t.id_tipo_rep}" ${(t.ID_TIPO_REP || t.id_tipo_rep) == currentTipo ? 'selected' : ''}>${t.NOMBRE_TIPO_REP || t.nombre_tipo_rep}</option>`
                )
                .join("")
            : `<option value="${currentTipo}" selected>Tipo ${currentTipo}</option>`;

        const marcasOptions = marcas.length
            ? marcas
                .map(
                    (m) => `<option value="${m.ID_MARCA || m.id_marca}" ${(m.ID_MARCA || m.id_marca) == currentMarca ? 'selected' : ''}>${m.NOMBRE_MARCA || m.nombre_marca}</option>`
                )
                .join("")
            : `<option value="${currentMarca}" selected>Marca ${currentMarca}</option>`;

        Swal.fire({
            title: `<strong>Equipo #${eq.ID_EQUIPO || eq.id_equipo}</strong>`,
            width: "700px",
            confirmButtonText: "Guardar",
            confirmButtonColor: "#0d6efd",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            background: "#ffffff",
            html: `
        <style>
          .swal2-input, .swal2-textarea, .swal2-select { width: 90% !important; margin: 5px auto; border-radius: 12px !important; border: 1px solid #e0e0e0 !important; padding: 10px 12px !important; }
          .swal2-textarea { resize: vertical; min-height: 80px; }
          label { display:block; margin-top:12px; margin-bottom:5px; color:#0d6efd; }
        </style>

        <div style="text-align:left; font-size:15px;">
          <label><b>ID Equipo</b></label>
          <input class="swal2-input" value="${eq.ID_EQUIPO || eq.id_equipo}" disabled>

          <label><b>Tipo</b></label>
          <select id="ID_TIPO" class="swal2-select">${tiposOptions}</select>

          <label><b>Marca</b></label>
          <select id="ID_MARCA" class="swal2-select">${marcasOptions}</select>

          <label><b>Especificaciones</b></label>
          <textarea id="ESPECIFICACIONES" class="swal2-textarea">${currentSpec}</textarea>

          <label><b>Serial</b></label>
          <input id="SERIAL" class="swal2-input" value="${currentSerial}">
        </div>
      `,
            preConfirm: () => {
                return {
                    id_tipo: document.getElementById('ID_TIPO').value,
                    id_marca: document.getElementById('ID_MARCA').value,
                    especificaciones: document.getElementById('ESPECIFICACIONES').value,
                    equipo_serial: document.getElementById('SERIAL').value
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const payload = {
                        id_tipo: Number(result.value.id_tipo),
                        id_marca: Number(result.value.id_marca),
                        id_persona: auth.user.ID_PERSONA || auth.user?.id_persona,
                        especificaciones: result.value.especificaciones,
                        equipo_serial: result.value.equipo_serial
                    };
                    await axios.put(`http://localhost:26001/api/equipo/${eq.ID_EQUIPO || eq.id_equipo}`, payload, { headers: { ...getAuthHeader() } });
                    // update local state
                    setEquipos(prev => prev.map(item => ((item.ID_EQUIPO || item.id_equipo) === (eq.ID_EQUIPO || eq.id_equipo) ? { ...item, ...payload, ID_EQUIPO: eq.ID_EQUIPO || eq.id_equipo } : item)));
                    Swal.fire('Actualizado', 'Equipo actualizado correctamente', 'success');
                } catch (err) {
                    Swal.fire('Error', err.response?.data?.error || 'No se pudo actualizar', 'error');
                }
            }
        });
    };

    return (
        <div className="container py-4" style={{ backgroundColor: "#f4f7fb", minHeight: "100vh" }}>
            <h1 className="text-center mb-4 text-primary fw-bold">Mis Equipos</h1>

            <div className="d-flex justify-content-end mb-3">
                <button className={`btn me-2 ${vista === 'card' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setVista('card')}>Vista Card</button>
                <button className={`btn ${vista === 'list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setVista('list')}>Vista Lista</button>
            </div>

            {!Array.isArray(equipos) || equipos.length === 0 ? (
                <div className="text-center my-5">
                    <span className="display-6 text-muted fw-semibold">No hay equipos registrados</span>
                </div>
            ) : vista === 'card' ? (
                <div className="row">
                    {equipos.map((e) => (
                        <div className="col-md-4 mb-4" key={e.ID_EQUIPO || e.id_equipo}>
                            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                <div className="card-body" role="button" onClick={() => verDetalles(e)}>
                                    <h5 className="card-title text-primary fw-bold">Equipo #{e.ID_EQUIPO || e.id_equipo}</h5>
                                    <p className="card-text">Serial: {e.EQUIPO_SERIAL || e.equipo_serial}</p>
                                    <span className="badge bg-secondary">Marca: {(() => {
                                        const marca = marcas.find(m => (m.ID_MARCA || m.id_marca) == (e.ID_MARCA || e.id_marca));
                                        return (marca && (marca.NOMBRE_MARCA || marca.nombre_marca)) || (e.ID_MARCA || e.id_marca) || 'Marca desconocida';
                                    })()}</span>
                                </div>
                                <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                                    <button className="btn btn-danger btn-sm" onClick={() => eliminarEquipo(e.ID_EQUIPO || e.id_equipo)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <ul className="list-group shadow-sm">
                    {equipos.map((e) => (
                        <li key={e.ID_EQUIPO || e.id_equipo} className="list-group-item d-flex justify-content-between align-items-start">
                            <div role="button" onClick={() => verDetalles(e)}>
                                <h6 className="fw-bold text-primary">Equipo #{e.ID_EQUIPO || e.id_equipo}</h6>
                                <p className="mb-1">Serial: {e.EQUIPO_SERIAL || e.equipo_serial}</p>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                                <span className="badge bg-secondary mb-2">Marca: {e.MARCA_EQ || e.NOMBRE_MARCA || e.id_marca}</span>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarEquipo(e.ID_EQUIPO || e.id_equipo)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LeerEquipo;
