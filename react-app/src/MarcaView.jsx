import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function MarcaView() {

    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMarcas = () => {
        setLoading(true);
        axios.get("http://localhost:26001/api/marca")
            .then(res => setMarcas(res.data))
            .catch(() => setMarcas([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMarcas();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar marca?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });
        if (confirm.isConfirmed) {
            try {
                await axios.delete(`http://localhost:26001/api/marca/${id}`);
                fetchMarcas();
                Swal.fire("Eliminado", "Marca eliminada", "success");
            } catch (err) {
                Swal.fire("Error", err.response?.data?.error || err.message, "error");
            }
        }
    };

    const handleUpdate = (marca) => {
        const currentName = marca.NOMBRE_MARCA || marca.nombre_marca || "";
        Swal.fire({
            title: "Actualizar Marca",
            html: `<input id="swal-nombre-marca" class="swal2-input" value="${currentName}" placeholder="Nombre" />`,
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            preConfirm: () => {
                const nombre = document.getElementById("swal-nombre-marca").value;
                if (!nombre) return Swal.showValidationMessage("El nombre es requerido");
                return nombre;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:26001/api/marca/${marca.ID_MARCA || marca.id_marca}`, {
                        nombre_marca: result.value
                    });
                    fetchMarcas();
                    Swal.fire("Actualizado", "Marca actualizada", "success");
                    navigate('/marca');
                } catch (err) {
                    Swal.fire("Error", err.response?.data?.error || err.message, "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-primary mb-3 fw-bold" onClick={() => navigate('/form-marca')}>
                + Nueva Marca
            </button>
            <div className="card shadow col-6 p-4" style={{ margin: "0 auto", borderRadius: 16 }}>
                <h4 className="text-primary fw-bold mb-3">Marcas registradas</h4>
                {loading ? (
                    <div className="text-center py-3">Cargando...</div>
                ) : (
                    <table className="table table-bordered table-striped mt-2">
                        <thead className="table-primary">
                            <tr>
                                <th>ID Marca</th>
                                <th>Nombre Marca</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marcas.length === 0 ? (
                                <tr><td colSpan={3} className="text-center">No hay marcas registradas</td></tr>
                            ) : (
                                marcas.map(m => (
                                    <tr key={m.ID_MARCA || m.id_marca}>
                                        <td>{m.ID_MARCA || m.id_marca}</td>
                                        <td>{m.NOMBRE_MARCA || m.nombre_marca}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdate(m)}>
                                                Actualizar
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.ID_MARCA || m.id_marca)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MarcaView;
