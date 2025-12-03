
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import FormTipoRep from "./form-tipoRep";

function TipoRepView() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTipos = () => {
    setLoading(true);
    axios.get("http://localhost:26001/api/tipo-rep")
      .then(res => setTipos(res.data))
      .catch(() => setTipos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar tipo de repuesto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:26001/api/tipo-rep/${id}`);
        fetchTipos();
        Swal.fire("Eliminado", "Tipo de repuesto eliminado", "success");
        navigate('/tipo-rep');
      } catch (err) {
        Swal.fire("Error", err.response?.data?.error || err.message, "error");
      }
    }
  };

  const handleUpdate = (tipo) => {
    const currentName = tipo.NOMBRE_TIPO_REP || tipo.nombre_tipo_rep || "";
    Swal.fire({
      title: "Actualizar Tipo de Repuesto",
      html: `<input id="swal-nombre-tipo" class="swal2-input" value="${currentName}" placeholder="Nombre" />`,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre-tipo").value;
        if (!nombre) return Swal.showValidationMessage("El nombre es requerido");
        return nombre;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:26001/api/tipo-rep/${tipo.ID_TIPO_REP || tipo.id_tipo_rep}`, {
            nombre_tipo_rep: result.value
          });
          fetchTipos();
          Swal.fire("Actualizado", "Tipo de repuesto actualizado", "success");
          navigate('/tipo-rep');
        } catch (err) {
          Swal.fire("Error", err.response?.data?.error || err.message, "error");
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3 fw-bold" onClick={() => navigate('/form-tipo-rep')}>
        + Nuevo Tipo Rep
      </button>
      <div className="card shadow p-4" style={{ maxWidth: 600, margin: "0 auto", borderRadius: 16 }}>
        <h4 className="text-primary fw-bold mb-3">Tipos de repuesto registrados</h4>
        {loading ? (
          <div className="text-center py-3">Cargando...</div>
        ) : (
          <table className="table table-bordered table-striped mt-2">
            <thead className="table-primary">
              <tr>
                <th>ID Tipo Rep</th>
                <th>Nombre Tipo Rep</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.length === 0 ? (
                <tr><td colSpan={3} className="text-center">No hay tipos registrados</td></tr>
              ) : (
                tipos.map(t => (
                  <tr key={t.ID_TIPO_REP || t.id_tipo_rep}>
                    <td>{t.ID_TIPO_REP || t.id_tipo_rep}</td>
                    <td>{t.NOMBRE_TIPO_REP || t.nombre_tipo_rep}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdate(t)}>
                        Actualizar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.ID_TIPO_REP || t.id_tipo_rep)}>
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

export default TipoRepView;
