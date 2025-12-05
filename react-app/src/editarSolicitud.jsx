
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const EditarSolicitud = () => {
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const id_solicitud = location?.state?.id_solicitud ?? null;
    console.log("ID recibido en EditarSolicitud:", id_solicitud);

    useEffect(() => {
        if (!id_solicitud) return console.log("No hay datos de ID para cargar la solicitud.");

        const fetchSolicitud = async () => {
            try {
                const response = await axios.get(`http://localhost:26001/api/solicitud/${id_solicitud}`);
                setSolicitud(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitud();
    }, [id_solicitud]);
    console.log(solicitud);
    return (
        <div className="container py-4">
            <h3>Editar Solicitud</h3>
            {id_solicitud ? (
                <p>ID recibido: {id_solicitud}</p>
            ) : (
                <p>No se recibió ningún ID. Abre este componente desde la lista de solicitudes.</p>
            )}
        </div>
    );
}

export default EditarSolicitud;
