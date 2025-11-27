import React from 'react';
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


function RequestForm() {

  const [formData, setFormData] = useState({
    id_solicitud: uuidv4(),
    id_persona: 1,
    id_estado: 1,
    observaciones: '',
    id_equipo: 0,
    fecha_creacion: new Date(),
    id_servicio: 0,
    id_tipous: 0
  });

  console.log('Formulario inicializado con ID:', formData.id_solicitud);

  const [errors, setErrors] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tipoUs, setTipoUs] = useState([]);

  useEffect(() => {
    // Obtener datos de la API
    const fetchData = async () => {
      try {
        const [equiposRes, serviciosRes, tipoUsRes] = await Promise.all([
          axios.get('http://localhost:26001/api/equipo'),
          axios.get('http://localhost:26001/api/servicio'),
          axios.get('http://localhost:26001/api/tipo-usuario')
        ]);
        setEquipos(equiposRes.data);
        setServicios(serviciosRes.data);
        setTipoUs(tipoUsRes.data);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_equipo) newErrors.id_equipo = 'Debe seleccionar un equipo';
    if (!formData.id_servicio) newErrors.id_servicio = 'Debe seleccionar un servicio';
    if (formData.observaciones && formData.observaciones.length > 200) {
      newErrors.observaciones = 'Las observaciones no pueden exceder 200 caracteres';
    }
    if (!formData.id_tipous) newErrors.id_tipous = 'Debe seleccionar un tipo de usuario';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Enviando datos:', formData);
        await axios.post('http://localhost:26001/api/solicitud', formData);
        Swal.fire({
          title: "Exitoso",
          text: "Solicitud enviada exitosamente",
          icon: "success"
        });
        resetForm();
      } catch (err) {
        console.error('Error enviando solicitud:', err);
        Swal.fire({
          title: "Error",
          text: "Error al enviar la solicitud",
          icon: "error"
        });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      id_solicitud: uuidv4(),
      id_persona: 1,
      id_estado: 1,
      observaciones: '',
      id_equipo: 0,
      fecha_creacion: new Date(),
      id_servicio: 0,
      id_tipous: 0
    }));
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

                  {/* Equipo */}
                  <div className="d-flex col-12 justify-content-between mb-3">
                    <div className='w-50'>
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
                        {equipos.map(eq => (
                          <option key={eq.ID_EQUIPO} value={eq.ID_EQUIPO}>{eq.TIPO_EQ} - {eq.MARCA_EQ}</option>
                        ))}
                      </select>
                      {errors.id_equipo && <div className="invalid-feedback">{errors.id_equipo}</div>}
                    </div>
                    <div className='w-50 ms-1'>
                      <label className="form-label fw-bold">
                        Tipo usuario <span className="text-danger">*</span>
                      </label>
                      <select
                        name="id_tipous"
                        value={formData.id_tipous}
                        onChange={handleChange}
                        className={`form-select shadow-sm ${errors.id_tipous ? 'is-invalid' : ''}`}
                      >
                        <option value="">Seleccione su tipo de usuario</option>
                        {tipoUs.map(e => (
                          <option key={e.ID_TIPOUS} value={e.ID_TIPOUS}>{e.NOMBRE_TIPOUS}</option>
                        ))}
                      </select>
                      {errors.id_tipous && <div className="invalid-feedback">{errors.id_tipous}</div>}
                    </div>
                  </div>

                  {/* Servicio */}
                  <div className="col-md-12 mb-3">
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
                      {servicios.map(e => (
                        <option className="text-dark" key={e.ID_SERVICIO} value={e.ID_SERVICIO}>{e.NOMBRE_SERVICIO}</option>

                      ))}
                    </select>
                    {errors.id_servicio && <div className="invalid-feedback">{errors.id_servicio}</div>}
                  </div>

                  {/* Observaciones */}
                  <div className="col-md-12 mb-4">
                    <label className="form-label fw-bold">Observaciones</label>
                    <textarea
                      rows={4}
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      placeholder="Ingrese observaciones (máx 1000 caracteres)"
                      maxLength={1000}
                      className={`form-control shadow-sm ${errors.observaciones ? 'is-invalid' : ''}`}
                    />
                    <small className="form-text text-muted">{formData.observaciones.length}/1000 caracteres</small>
                    {errors.observaciones && <div className="invalid-feedback">{errors.observaciones}</div>}
                  </div>

                  {/* Botones */}
                  <div className="col d-flex justify-content-end gap-2">
                    <button type="button" onClick={resetForm} className="btn btn-secondary px-4 py-2">
                      Limpiar
                    </button>
                    <button type="submit" className="btn btn-primary px-4 py-2">
                      Enviar Solicitud
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestForm;
