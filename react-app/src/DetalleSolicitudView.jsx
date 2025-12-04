import { useEffect, useState } from "react";
import axios from "axios";

function DetalleSolicitudView() {

    const [usuarios, setUsuarios] = useState([]);
    const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState("");
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);

    // ========================
    // 1. Cargar TODOS los usuarios
    // ========================
    const fetchUsuarios = () => {
        axios.get("http://localhost:26001/api/persona")
            .then(res => setUsuarios(res.data))
            .catch(() => setUsuarios([]));
    };

    // ========================
    // 2. Consultar detalle solicitud por usuario
    // ========================
    const fetchDetalleSolicitud = () => {
        if (!idUsuarioSeleccionado) return;

        setLoading(true);
        axios.get(`http://localhost:26001/api/detalles/${idUsuarioSeleccionado}`)
            .then(res => {
                if (res.data.success) {
                    setSolicitudes(res.data.data);
                } else {
                    setSolicitudes([]);
                }
            })
            .catch(() => setSolicitudes([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div className="container mt-4">

            <div className="card shadow p-4" style={{ borderRadius: 16 }}>
                <h4 className="text-primary fw-bold mb-3">Consultar Detalle de Solicitudes</h4>

                {/* ================ SELECT DE USUARIOS ================= */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Seleccione un usuario:</label>
                    <select
                        className="form-select"
                        value={idUsuarioSeleccionado}
                        onChange={(e) => setIdUsuarioSeleccionado(e.target.value)}
                    >
                        <option value="">Seleccione un usuario</option>

                        {usuarios.map(u => (
                            <option key={u.ID_PERSONA} value={u.ID_PERSONA}>
                                {u.NOMBRE} {u.PRIMER_APELLIDO} {u.SEGUNDO_APELLIDO}
                            </option>
                        ))}
                    </select>
                </div>

                {/* BOTÓN PARA CONSULTAR */}
                <button
                    className="btn btn-primary mb-3 fw-bold"
                    disabled={!idUsuarioSeleccionado}
                    onClick={fetchDetalleSolicitud}
                >
                    Consultar Solicitudes
                </button>

                {/* ===================== RESULTADOS ==================== */}
                {loading ? (
                    <div className="text-center py-3">Cargando resultados...</div>
                ) : solicitudes.length === 0 ? (
                    <div className="text-center">No hay solicitudes para este usuario.</div>
                ) : (
                    <table className="table table-bordered table-striped mt-2">
                        <thead className="table-primary">
                            <tr>
                                <th>ID Solicitud</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Observaciones</th>
                                <th>Equipo</th>
                                <th>Marca</th>
                                <th>Serial</th>
                                <th>Servicio</th>
                                <th>Precio Base</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((s, i) => (
                                <tr key={i}>
                                    <td>{s.ID_SOLICITUD}</td>
                                    <td>{s.FECHA_CREACION}</td>
                                    <td>{s.ESTADO_SOLICITUD}</td>
                                    <td>{s.OBSERVACIONES}</td>
                                    <td>{s.ESPECIFICACIONES}</td>
                                    <td>{s.MARCA_EQUIPO}</td>
                                    <td>{s.EQUIPO_SERIAL}</td>
                                    <td>{s.NOMBRE_SERVICIO}</td>
                                    <td>{s.PRECIO_BASE}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default DetalleSolicitudView;
