import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './auth/AuthProvider';
import Swal from 'sweetalert2';

const EditarSolicitud = () => {
    const { getAuthHeader } = useAuth();
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [servicios, setServicios] = useState([]);
    const noData = "No hay datos cargados";
    const location = useLocation();
    const id_solicitud = location?.state?.id_solicitud ?? null;

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const res = await axios.get("http://localhost:26001/api/servicio");
                setServicios(res.data);
            } catch (err) {
                console.error("Error al cargar servicios:", err);
            }
        };

        fetchServicios();
    }, []);

    useEffect(() => {
        if (!id_solicitud) {
            setError("No hay datos de ID para cargar la solicitud.");
            setLoading(false);
            return;
        }

        const fetchSolicitud = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:26001/api/solicitud/${id_solicitud}`,
                    { headers: { ...getAuthHeader() } }
                );

                setSolicitud(response.data);
                setFormData(response.data);
            } catch (err) {
                setError(err.message || "Error al cargar la solicitud");
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitud();
    }, [id_solicitud]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Solo enviamos los campos editables
            const payload = {
                ID_ESTADO: formData.ID_ESTADO,
                OBSERVACIONES: formData.OBSERVACIONES,
                ID_GARANTIA: formData.ID_GARANTIA,
                ID_SERVICIO: formData.ID_SERVICIO,
                ID_TIPOUS: formData.ID_TIPOUS
            };

            console.log("DATA A ENVIAR:", payload); // Para depuración

            await axios.put(
                `http://localhost:26001/api/solicitud/${id_solicitud}`,
                payload,
                { headers: { ...getAuthHeader() } }
            );

            Swal.fire({
                title: "Exitoso",
                text: "Solicitud actualizada exitosamente",
                icon: "success"
            });

        } catch (err) {
            console.error('Error enviando solicitud:', err);
            const serverMsg = err.response?.data?.error || err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
            Swal.fire({
                title: "Error",
                text: `Error al actualizar la solicitud: ${serverMsg}`,
                icon: "error"
            });
        }
    };


    if (loading) return <div className="container py-4"><p>Cargando...</p></div>;
    if (error) return <div className="container py-4 alert alert-danger">{error}</div>;
    if (!solicitud) return <div className="container py-4 alert alert-warning">No se encontró la solicitud</div>;

    return (
        <div className="container py-4">
            <h3 className="mb-4 text-primary fw-bold">Editar Solicitud #{id_solicitud}</h3>

            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>Factura asociada</b></label>
                        <input type="text" className="form-control"
                            name="ID_FACTURA"
                            value={formData.ID_FACTURA || "No hay facturas asociadas"}
                            onChange={handleChange}
                            disabled
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>Persona responsable</b></label>
                        <input type="text" className="form-control"
                            name="ID_PERSONA"
                            value={formData.ID_PERSONA || noData}
                            onChange={handleChange}
                            disabled
                            hidden
                        />
                        <input type="text" className="form-control"
                            value={formData.CORREO || noData}
                            onChange={handleChange}
                            disabled
                        /> {/* Agrega correo por ID_PERSONA. NO cuenta para editar */}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>Empleado Responsable</b></label>
                        <input type="text" className="form-control"
                            name="ID_PERSONA_EMPLEADO"
                            value={formData.ID_PERSONA_EMPLEADO || "No hay empleado asociado"}
                            onChange={handleChange}
                            disabled
                            hidden
                        /> {/* Agrega nombre por ID_PERSONA_EMPLEADO. NO cuenta para editar */}
                        <input type="text" className="form-control"
                            value={formData.NOMBRE_EMPLEADO || "No hay empleado asociado"}
                            onChange={handleChange}
                            disabled
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>Estado</b></label>
                        <select className="form-select"
                            name="ID_ESTADO"
                            value={formData.ID_ESTADO || noData}
                            onChange={handleChange}
                        >
                            <option value="1">Completado</option>
                            <option value="0">No completado</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label"><b>Observaciones</b></label>
                    <textarea className="form-control"
                        name="OBSERVACIONES"
                        rows="3"
                        value={formData.OBSERVACIONES || noData}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label"><b>ID Garantía</b></label>
                        <input type="text" className="form-control"
                            name="ID_GARANTIA"
                            value={formData.ID_GARANTIA || noData}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label"><b>ID Equipo</b></label>
                        <input type="text" className="form-control"
                            name="ID_EQUIPO"
                            value={formData.ID_EQUIPO || noData}
                            onChange={handleChange}
                            disabled
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label"><b>ID Servicio</b></label>
                        <select className="form-control"
                            name="ID_SERVICIO"
                            value={formData.ID_SERVICIO || noData}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un servicio</option>
                            {servicios.map(serv => (
                                <option key={serv.ID_SERVICIO} value={serv.ID_SERVICIO}>
                                    {serv.NOMBRE_SERVICIO}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fecha creación solo lectura */}
                <div className='row d-flex '>
                    {/* NUEVO CAMPO: id_tipous */}
                    <div className="mb-3 col-6">
                        <label className="form-label"><b>ID Tipo US</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_TIPOUS"
                            value={formData.ID_TIPOUS || noData}
                            onChange={handleChange}
                            hidden
                        />
                        <input
                            type="text"
                            className="form-control"
                            value={formData.NOMBRE_TIPOUS || noData}
                            disabled
                        /> {/* Agrega nombre por ID_TIPOUS. NO cuenta para editar */}
                    </div>
                    <div className="mb-3 col-6">
                        <label className="form-label"><b>Fecha Creación</b></label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.FECHA_CREACION?.split("T")[0] || noData}
                            disabled
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditarSolicitud;
