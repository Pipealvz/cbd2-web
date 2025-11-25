import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';


function RequestForm() {

  const [formData, setFormData] = useState({
    id_factura: '',
    id_estado: '',
    observaciones: '',
    id_garantia: '',
    id_equipo: '',
    id_servicio: ''
  });

  const [errors, setErrors] = useState({});

  // Datos quemados para las listas desplegables
  const facturas = [
    { id: 1, nombre: 'Factura #001 - Cliente A' },
    { id: 2, nombre: 'Factura #002 - Cliente B' },
    { id: 3, nombre: 'Factura #003 - Cliente C' },
    { id: 4, nombre: 'Factura #004 - Cliente D' },
    { id: 5, nombre: 'Factura #005 - Cliente E' }
  ];

  const estados = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'En Proceso' },
    { id: 3, nombre: 'Completado' },
    { id: 4, nombre: 'Cancelado' },
    { id: 5, nombre: 'En Revisión' }
  ];

  const garantias = [
    { id: 1, nombre: 'Garantía 1 año' },
    { id: 2, nombre: 'Garantía 2 años' },
    { id: 3, nombre: 'Garantía 3 años' },
    { id: 4, nombre: 'Sin garantía' },
    { id: 5, nombre: 'Garantía extendida' }
  ];

  const equipos = [
    { id: 1, nombre: 'Laptop Dell Inspiron' },
    { id: 2, nombre: 'Desktop HP ProDesk' },
    { id: 3, nombre: 'Impresora Epson L3150' },
    { id: 4, nombre: 'Monitor Samsung 24"' },
    { id: 5, nombre: 'Router TP-Link' }
  ];

  const servicios = [
    { id: 1, nombre: 'Reparación' },
    { id: 2, nombre: 'Mantenimiento' },
    { id: 3, nombre: 'Instalación' },
    { id: 4, nombre: 'Consultoría' },
    { id: 5, nombre: 'Soporte Técnico' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_factura) {
      newErrors.id_factura = 'Debe seleccionar una factura';
    }

    if (!formData.id_estado) {
      newErrors.id_estado = 'Debe seleccionar un estado';
    }

    if (!formData.id_garantia) {
      newErrors.id_garantia = 'Debe seleccionar una garantía';
    }

    if (!formData.id_equipo) {
      newErrors.id_equipo = 'Debe seleccionar un equipo';
    }

    if (!formData.id_servicio) {
      newErrors.id_servicio = 'Debe seleccionar un servicio';
    }

    if (formData.observaciones && formData.observaciones.length > 200) {
      newErrors.observaciones = 'Las observaciones no pueden exceder 200 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log('Datos del formulario:', formData);
      alert('Solicitud enviada exitosamente');
      // Aquí puedes hacer la petición a tu API
      // resetForm();
    } else {
      setErrors(newErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      id_factura: '',
      id_estado: '',
      observaciones: '',
      id_garantia: '',
      id_equipo: '',
      id_servicio: ''
    });
    setErrors({});
  };
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white py-4">
              <h3 className="mb-0 text-center">
                <i className="bi bi-file-earmark-text me-2"></i>
                Nueva Solicitud de Servicio
              </h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Factura */}
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="form-label fw-bold">
                        Factura <span className="text-danger">*</span>
                      </label>
                      <select
                        name="id_factura"
                        value={formData.id_factura}
                        onChange={handleChange}
                        className={`form-select shadow-sm ${errors.id_factura ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione una factura</option>
                        {facturas.map((factura) => (
                          <option key={factura.id} value={factura.id}>
                            {factura.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.id_factura && (
                        <div className="invalid-feedback">
                          {errors.id_factura}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="form-label fw-bold">
                        Estado <span className="text-danger">*</span>
                      </label>
                      <select
                        name="id_estado"
                        value={formData.id_estado}
                        onChange={handleChange}
                        className={`form-select shadow-sm ${errors.id_estado ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione un estado</option>
                        {estados.map((estado) => (
                          <option key={estado.id} value={estado.id}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.id_estado && (
                        <div className="invalid-feedback">
                          {errors.id_estado}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equipo */}
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="form-label fw-bold">
                        Equipo <span className="text-danger">*</span>
                      </label>
                      <select
                        name="id_equipo"
                        value={formData.id_equipo}
                        onChange={handleChange}
                        className={`form-select shadow-sm ${errors.id_equipo ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione un equipo</option>
                        {equipos.map((equipo) => (
                          <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.id_equipo && (
                        <div className="invalid-feedback">
                          {errors.id_equipo}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Servicio */}
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                      <label className="form-label fw-bold">
                        Servicio <span className="text-danger">*</span>
                      </label>
                      <select
                        name="id_servicio"
                        value={formData.id_servicio}
                        onChange={handleChange}
                        className={`form-select shadow-sm ${errors.id_servicio ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione un servicio</option>
                        {servicios.map((servicio) => (
                          <option key={servicio.id} value={servicio.id}>
                            {servicio.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.id_servicio && (
                        <div className="invalid-feedback">
                          {errors.id_servicio}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Garantía */}
                  <div className="col-md-12 mb-3">
                    <div className="form-group">
                      <label className="form-label fw-bold">
                        Garantía <span className="text-danger">*</span>
                      </label>
                      <select
                        name="id_garantia"
                        value={formData.id_garantia}
                        onChange={handleChange}
                        className={`form-select shadow-sm ${errors.id_garantia ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione un tipo de garantía</option>
                        {garantias.map((garantia) => (
                          <option key={garantia.id} value={garantia.id}>
                            {garantia.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.id_garantia && (
                        <div className="invalid-feedback">
                          {errors.id_garantia}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="col-md-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-bold">
                        Observaciones
                      </label>
                      <textarea
                        rows={4}
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        placeholder="Ingrese observaciones adicionales (máximo 200 caracteres)"
                        maxLength={200}
                        className={`form-control shadow-sm ${errors.observaciones ? 'is-invalid' : ''}`}
                      />
                      <small className="form-text text-muted">
                        {formData.observaciones.length}/200 caracteres
                      </small>
                      {errors.observaciones && (
                        <div className="invalid-feedback">
                          {errors.observaciones}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="row mt-3">
                  <div className="col d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn btn-secondary px-4 py-2"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Limpiar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Enviar Solicitud
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card mt-3 border-0 bg-light">
            <div className="card-body p-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-2"></i>
                Los campos marcados con <span className="text-danger">*</span> son obligatorios
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestForm;
