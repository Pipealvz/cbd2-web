

const EditarSolicitud = () => {
    return (
        <form className="container">
            <div className="row">
                {/* Facturado */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>Facturado</b></label>
                    <input
                        type="text"
                        className="form-control"
                        value={sol.ID_FACTURA}
                        disabled
                    />
                </div>
                {/* Persona */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>Persona</b></label>
                    <input
                        type="text"
                        className="form-control"
                        value={auth?.user?.correo || sol.ID_PERSONA}
                        disabled
                    />
                </div>
            </div>
            <div className="row">
                {/* Empleado Responsable */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>Empleado Responsable</b></label>
                    <input
                        id="ID_PERSONA_EMPLEADO"
                        type="text"
                        className="form-control"
                        defaultValue={sol.ID_PERSONA_EMPLEADO}
                        disabled={rol === "usuario"}
                    />
                </div>
                {/* Estado */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>Estado</b></label>
                    <select
                        id="ID_ESTADO"
                        className="form-select"
                        disabled={rol === "usuario"}
                        dangerouslySetInnerHTML={{ __html: estadosOptions }}
                    />
                </div>
            </div>
            <div className="row">
                {/* Observaciones (ocupa toda la fila) */}
                <div className="col-12 mb-3">
                    <label className="form-label"><b>Observaciones</b></label>
                    <textarea
                        id="OBSERVACIONES"
                        className="form-control"
                        rows="3"
                        defaultValue={sol.OBSERVACIONES ?? ""}
                    />
                </div>
            </div>
            <div className="row">
                {/* ID Garantía */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>ID Garantía</b></label>
                    <input
                        id="ID_GARANTIA"
                        type="text"
                        className="form-control"
                        defaultValue={sol.ID_GARANTIA ?? "Sin garantía"}
                    />
                </div>
                {/* ID Equipo */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>ID Equipo</b></label>
                    <input
                        id="ID_EQUIPO"
                        type="text"
                        className="form-control"
                        defaultValue={sol.ID_EQUIPO}
                    />
                </div>
            </div>
            <div className="row">
                {/* Fecha Creación */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>Fecha Creación</b></label>
                    <input
                        type="text"
                        className="form-control"
                        value={sol.FECHA_CREACION}
                        disabled
                    />
                </div>
                {/* Servicio */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>Servicio</b></label>
                    <select
                        id="ID_SERVICIO"
                        className="form-select"
                        dangerouslySetInnerHTML={{ __html: serviciosOptions }}
                    />
                </div>
            </div>
            <div className="row">
                {/* ID Tipo Servicio */}
                <div className="col-md-6 mb-3">
                    <label className="form-label"><b>ID Tipo Servicio</b></label>
                    <input
                        id="ID_TIPOUS"
                        type="text"
                        className="form-control"
                        defaultValue={sol.ID_TIPOUS}
                    />
                </div>
            </div>

        </form>
    );
}

export default EditarSolicitud;
