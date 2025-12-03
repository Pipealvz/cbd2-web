import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useAuth } from "./auth/AuthProvider";

function LeerSolicitud() {
  const { auth, getAuthHeader } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [vista, setVista] = useState("card");
  const [servicios, setServicios] = useState([]); // <-- agregar esto
  const [estados, setEstados] = useState([
    { id: 1, nombre: "Completado" },
    { id: 0, nombre: "No completado" }
  ]); // puedes reemplazar por fetch si tienes endpoint

  // 🔹 Definir rol (usuario o empleado)
  const rol = "empleado"; // <-- CAMBIA esto según login real

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
        console.log("DATA RECIBIDA:", data);
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
        console.log("SERVICIOS RECIBIDOS:", data);
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

  const verDetalles = (sol) => {
    // Construir opciones del select de servicios
    const serviciosOptions = servicios.length
      ? servicios
          .map(
            (sv) =>
              `<option value="${sv.ID_SERVICIO}" ${
                sv.ID_SERVICIO == sol.ID_SERVICIO ? "selected" : ""
              }>${sv.NOMBRE_SERVICIO ?? sv.NOMBRE ?? "Servicio " + sv.ID_SERVICIO}</option>`
          )
          .join("")
      : `<option value="${sol.ID_SERVICIO ?? ""}" selected>Servicio ${sol.ID_SERVICIO}</option>`;

    // Construir opciones del select de estados (estado-solicitud)
    const estadosOptions = (estados || [])
      .map(
        (st) =>
          `<option value="${st.id}" ${st.id == sol.ID_ESTADO ? "selected" : ""}>${st.nombre}</option>`
      )
      .join("");
    
    Swal.fire({
      title: `<strong>Solicitud #${sol.ID_SOLICITUD}</strong>`,
      width: "700px",
      confirmButtonText: "Guardar",
      confirmButtonColor: "#0d6efd",
      showCancelButton: true,
      cancelButtonText: "Cerrar",
      background: "#ffffff",
      didOpen: (modal) => {
      const inputs = modal.querySelectorAll(".swal2-input, .swal2-textarea, .swal2-select");
      inputs.forEach((input) => {
        input.style.borderRadius = "12px";
        input.style.border = "1px solid #e0e0e0";
        input.style.padding = "10px 12px";
        input.style.fontFamily = "inherit";
      });
      },

      html: `
      <style>
        .swal2-input, .swal2-textarea, .swal2-select {
        width: 90% !important;
        margin: 5px auto;
        border-radius: 12px !important;
        border: 1px solid #e0e0e0 !important;
        padding: 10px 12px !important;
        }
        .swal2-textarea {
        resize: vertical;
        min-height: 80px;
        }
        label {
        display: block;
        margin-top: 12px;
        margin-bottom: 5px;
        color: #0d6efd;
        }
      </style>

      <div style="text-align:left; font-size:15px;">

        <label><b>Facturado</b></label>
        <input class="swal2-input" value="${sol.ID_FACTURA}" disabled>

        <label><b>Persona</b></label>
        <input class="swal2-input" value="${auth?.user?.correo || sol.ID_PERSONA}" disabled>

        <label><b>Empleado Responsable</b></label>
        <input id="ID_PERSONA_EMPLEADO" class="swal2-input" value="${sol.ID_PERSONA_EMPLEADO}" ${rol === "usuario" ? "disabled" : ""}>

        <label><b>Estado</b></label>
        <select id="ID_ESTADO" class="swal2-select" ${rol === "usuario" ? "disabled" : ""}>
          ${estadosOptions}
        </select>

        <label><b>OBSERVACIONES</b></label>
        <textarea id="OBSERVACIONES" class="swal2-textarea">${sol.OBSERVACIONES ?? ""}</textarea>

        <label><b>ID Garantía</b></label>
        <input id="ID_GARANTIA" class="swal2-input" value="${sol.ID_GARANTIA ?? ""}">

        <label><b>ID Equipo</b></label>
        <input id="ID_EQUIPO" class="swal2-input" value="${sol.ID_EQUIPO}" ${rol === "usuario" ? "" : ""}>

        <label><b>Fecha Creación</b></label>
        <input class="swal2-input" value="${sol.FECHA_CREACION}" disabled>

        <label><b>Servicio</b></label>
        <select id="ID_SERVICIO" class="swal2-select">
          ${serviciosOptions}
        </select>

        <label><b>ID Tipo Servicio</b></label>
        <input id="ID_TIPOUS" class="swal2-input" value="${sol.ID_TIPOUS}">
      </div>
      `,

      preConfirm: () => {
      return {
        ID_PERSONA_EMPLEADO: document.getElementById("ID_PERSONA_EMPLEADO").value,
        ID_ESTADO: document.getElementById("ID_ESTADO").value,
        OBSERVACIONES: document.getElementById("OBSERVACIONES").value,
        ID_GARANTIA: document.getElementById("ID_GARANTIA").value,
        ID_EQUIPO: document.getElementById("ID_EQUIPO").value,
        ID_SERVICIO: document.getElementById("ID_SERVICIO").value,
        ID_TIPOUS: document.getElementById("ID_TIPOUS").value
      };
      }
    }).then((res) => {
      if (res.isConfirmed) {
      console.log("Datos modificados:", res.value);

      // aquí podrías hacer un PUT a la API
      // fetch("http://localhost:26001/api/solicitud/"+sol.id_solicitud, { ... })

      Swal.fire("Guardado", "La solicitud se actualizó correctamente", "success");
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
                <div className="card-body" role="button" onClick={() => verDetalles(s)}>
                  <h5 className="card-title text-primary fw-bold">
                    Solicitud #{s.ID_SOLICITUD}
                  </h5>
                  <p className="card-text">Factura: {s.ID_FACTURA}</p>
                  <span className="badge bg-secondary">
                    Estado: {s.ID_ESTADO}
                  </span>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-end">
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarSolicitud(s.ID_SOLICITUD)}>
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
              <div role="button" onClick={() => verDetalles(s)}>
                <h6 className="fw-bold text-primary">
                  Solicitud #{s.ID_SOLICITUD}
                </h6>
                <p className="mb-1">Factura: {s.ID_FACTURA}</p>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span className="badge bg-secondary mb-2">
                  Estado {s.ID_ESTADO}
                </span>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarSolicitud(s.ID_SOLICITUD)}>
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
