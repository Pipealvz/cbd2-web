import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useAuth } from "./auth/AuthProvider";

function LeerSolicitud() {
  const { auth, getAuthHeader } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [vista, setVista] = useState("card");
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();
  const handleNavigate = (id_solicitud) => {
    navigate('/editar-solicitud', { state: { id_solicitud } });
  };
  const [estados, setEstados] = useState([
    { id: 1, nombre: "Completado" },
    { id: 0, nombre: "No completado" }
  ]);

  useEffect(() => {
    // Esperar hasta que el usuario esté cargado
    const personaId = auth?.user?.ID_PERSONA || auth?.user?.id_persona;
    if (!personaId) {
      // No tenemos id de persona aún; esperaremos a que auth esté disponible
      return;
    }

    // Obtener solicitudes del usuario
    fetch(`http://localhost:26001/api/solicitud/user/${personaId}`, {
      headers: {
        ...getAuthHeader(), // 👉 Enviamos Authorization: Bearer token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("DATA RECIBIDA:", data);
        setSolicitudes(data || []);
      })
      .catch((err) => console.error("Error al obtener solicitudes:", err));

    // Obtener servicios para el select
    fetch("http://localhost:26001/api/servicio", {
      headers: {
        ...getAuthHeader(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("SERVICIOS RECIBIDOS:", data);
        setServicios(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al obtener servicios:", err);
        setServicios([]);
      });
    // re-ejecutar cuando auth cambie (por ejemplo después del login)
  }, [auth, getAuthHeader]);

  const eliminarSolicitud = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la solicitud de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:26001/api/solicitud/${id}`, {
          method: 'DELETE',
          headers: {
            ...getAuthHeader(),
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error('Error al eliminar');
            setSolicitudes((prev) => prev.filter((s) => s.ID_SOLICITUD !== id));
            Swal.fire('Eliminado', 'La solicitud ha sido eliminada.', 'success');
          })
          .catch(() => {
            Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
          });
      }
    });
  };

  return (
    <div
      className="container py-4"
      style={{ backgroundColor: "#f4f7fb", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4 text-primary fw-bold">
        Panel de Solicitudes
      </h1>

      <div className="d-flex justify-content-end mb-3">
        <button
          className={`btn me-2 ${vista === "card" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setVista("card")}
        >
          Vista Card
        </button>
        <button
          className={`btn ${vista === "list" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setVista("list")}
        >
          Vista Lista
        </button>
      </div>

      {!Array.isArray(solicitudes) || solicitudes.length === 0 ? (
        <div className="text-center my-5">
          <span className="display-6 text-muted fw-semibold">
            No hay solicitudes registradas
          </span>
        </div>
      ) : vista === "card" ? (
        <div className="row">
          {solicitudes.map((s) => (
            <div className="col-md-4 mb-4" key={s.ID_SOLICITUD}>
              <div
                className="card shadow-sm border-0"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body" role="button" onClick={() => handleNavigate(s.ID_SOLICITUD)}>
                  <h5 className="card-title text-primary fw-bold">
                    Solicitud #{s.ID_SOLICITUD}
                  </h5>
                  <p className="card-text">Factura: {s.ID_FACTURA}</p>
                  <span className="badge bg-secondary">
                    Estado: { (estados.find(st => st.id == s.ID_ESTADO)?.nombre) || s.ID_ESTADO }
                  </span>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                  <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); eliminarSolicitud(s.ID_SOLICITUD); }}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="list-group shadow-sm">
          {solicitudes.map((s) => (
            <li
              key={s.ID_SOLICITUD}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div role="button" onClick={() => handleNavigate(s.ID_SOLICITUD)}>
                <h6 className="fw-bold text-primary">
                  Solicitud #{s.ID_SOLICITUD}
                </h6>
                <p className="mb-1">Factura: {s.ID_FACTURA}</p>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span className="badge bg-secondary mb-2">
                  Estado { (estados.find(st => st.id == s.ID_ESTADO)?.nombre) || s.ID_ESTADO }
                </span>
                <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); eliminarSolicitud(s.ID_SOLICITUD); }}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeerSolicitud;
