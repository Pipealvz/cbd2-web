import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './auth/AuthProvider';

const EditarSolicitud = () => {
    const { getAuthHeader } = useAuth();
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    const location = useLocation();
    const id_solicitud = location?.state?.id_solicitud ?? null;
    console.log("ID recibido en EditarSolicitud:", id_solicitud);

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
            await axios.put(
                `http://localhost:26001/api/solicitud/${id_solicitud}`,
                formData,
                { headers: { ...getAuthHeader() } }
            );
            alert('Solicitud actualizada correctamente');
        } catch (err) {
            alert('Error al actualizar: ' + err.message);
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
                        <label className="form-label"><b>ID Factura</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_FACTURA"
                            value={formData.ID_FACTURA || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>ID Persona</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_PERSONA"
                            value={formData.ID_PERSONA || ''}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>Empleado Responsable</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_PERSONA_EMPLEADO"
                            value={formData.ID_PERSONA_EMPLEADO || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label"><b>Estado</b></label>
                        <select
                            className="form-select"
                            name="ID_ESTADO"
                            value={formData.ID_ESTADO || 0}
                            onChange={handleChange}
                        >
                            <option value="1">Completado</option>
                            <option value="0">No completado</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label"><b>Observaciones</b></label>
                    <textarea
                        className="form-control"
                        name="OBSERVACIONES"
                        rows="3"
                        value={formData.OBSERVACIONES || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label"><b>ID Garantía</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_GARANTIA"
                            value={formData.ID_GARANTIA || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label"><b>ID Equipo</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_EQUIPO"
                            value={formData.ID_EQUIPO || ''}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label"><b>ID Servicio</b></label>
                        <input
                            type="text"
                            className="form-control"
                            name="ID_SERVICIO"
                            value={formData.ID_SERVICIO || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label"><b>Fecha Creación</b></label>
                    <input
                        type="text"
                        className="form-control"
                        name="FECHA_CREACION"
                        value={formData.FECHA_CREACION || ''}
                        disabled
                    />
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default EditarSolicitud;