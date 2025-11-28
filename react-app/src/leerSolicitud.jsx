import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useAuth } from "./auth/AuthProvider";

function LeerSolicitud() {
  const { auth, getAuthHeader } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [vista, setVista] = useState("card");
  const [servicios, setServicios] = useState([]); // <-- agregar esto

  // 🔹 Definir rol (usuario o empleado)
  const rol = "empleado"; // <-- CAMBIA esto según login real

  useEffect(() => {
    // Obtener solicitudes
    fetch(`http://localhost:26001/api/solicitud/user/${auth.user.ID_PERSONA}`, {
      headers: {
        ...getAuthHeader(),  // 👉 Enviamos Authorization: Bearer token
      },
    })
      .then((res) => res.json())
      .then((data) => { console.log("DATA RECIBIDA:", data); setSolicitudes(data) })
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
  }, []);

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

        <label><b> Facturado </b></label>
        <input class="swal2-input" value="${sol.ID_FACTURA}" disabled>

        <label><b>Persona</b></label>
        <input class="swal2-input" value="${auth?.user?.correo || sol.ID_PERSONA}" disabled>

        <label><b>Empleado Responsable</b></label>
        <input id="ID_PERSONA_EMPLEADO" class="swal2-input" value="${sol.ID_PERSONA_EMPLEADO}" ${rol === "usuario" ? "disabled" : ""}>

        <label><b>Estado</b></label>
        <select id="ID_ESTADO" class="swal2-select" ${rol === "usuario" ? "disabled" : ""}>
        <option value="1" ${sol.ID_ESTADO == 1 ? "selected" : ""}>Completado</option>
        <option value="0" ${sol.ID_ESTADO == 0 ? "selected" : ""}>No completado</option>
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
                role="button"
                onClick={() => verDetalles(s)}
              >
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">
                    Solicitud #{s.ID_SOLICITUD}
                  </h5>
                  <p className="card-text">Factura: {s.ID_FACTURA}</p>
                  <span className="badge bg-secondary">
                    Estado: {s.ID_ESTADO}
                  </span>
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
              role="button"
              onClick={() => verDetalles(s)}
            >
              <div>
                <h6 className="fw-bold text-primary">
                  Solicitud #{s.ID_SOLICITUD}
                </h6>
                <p className="mb-1">Factura: {s.ID_FACTURA}</p>
              </div>
              <span className="badge bg-secondary">
                Estado {s.ID_ESTADO}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeerSolicitud;
