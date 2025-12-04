import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';



function RequestForm() {
  const { auth, getAuthHeader } = useAuth();
  const userId = auth?.user?.id_persona;

  const location = useLocation();

  const [formData, setFormData] = useState({
    id_solicitud: uuidv4(),
    id_persona: userId || 0,
    id_estado: 1,
    observaciones: '',
    id_equipo: 0,
    fecha_creacion: new Date(),
    id_servicio: 0,
    id_tipous: 0
  });

  //console.log('Formulario inicializado con ID:', formData.id_solicitud);

  const [errors, setErrors] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tipoUs, setTipoUs] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Obtener datos de la API
    const fetchData = async () => {
      try {
        let equiposRes = { data: [] };
        if (userId) {
          equiposRes = await axios.get(`http://localhost:26001/api/equipo/${userId}`);
        }
        const [serviciosRes, tipoUsRes, marcasRes] = await Promise.all([
          axios.get('http://localhost:26001/api/servicio'),
          axios.get('http://localhost:26001/api/tipo-usuario'),
          axios.get('http://localhost:26001/api/marca')
        ]);
        setEquipos(equiposRes.data);
        setServicios(serviciosRes.data);
        setTipoUs(tipoUsRes.data);
        setMarcas(marcasRes.data);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchData();
  }, [userId]);

  // Cargar solicitud a editar si viene ?edit=<id> en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (!editId) return;

    const loadSolicitud = async (id) => {
      try {
        const res = await axios.get(`http://localhost:26001/api/solicitud/${id}`, { headers: { ...getAuthHeader() } });
        const data = res.data;
        if (data) {
          setFormData(prev => ({
            ...prev,
            id_solicitud: data.ID_SOLICITUD || data.id_solicitud || prev.id_solicitud,
            id_persona: data.ID_PERSONA || data.id_persona || prev.id_persona,
            id_estado: data.ID_ESTADO || data.id_estado || prev.id_estado,
            observaciones: data.OBSERVACIONES || data.observaciones || prev.observaciones,
            id_equipo: data.ID_EQUIPO || data.id_equipo || prev.id_equipo,
            fecha_creacion: data.FECHA_CREACION || data.fecha_creacion || prev.fecha_creacion,
            id_servicio: data.ID_SERVICIO || data.id_servicio || prev.id_servicio,
            id_tipous: data.ID_TIPOUS || data.id_tipous || prev.id_tipous
          }));
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Error cargando solicitud para editar:', err);
      }
    };

    loadSolicitud(editId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Ajustar id_tipous según el perfil del usuario (1 -> EMPLEADO, 2 -> CLIENTE)
  useEffect(() => {
    const perfil = auth?.user?.id_perfil;
    if (perfil) {
      const idTip = perfil === 1 ? 1 : perfil === 2 ? 2 : formData.id_tipous;
      setFormData(prev => ({ ...prev, id_tipous: idTip }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?.id_perfil]);

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
    if (!formData.id_equipo && !isEditing) newErrors.id_equipo = 'Debe seleccionar un equipo';
    if (!formData.id_servicio) newErrors.id_servicio = 'Debe seleccionar un servicio';
    if (formData.observaciones && formData.observaciones.length > 200) {
      newErrors.observaciones = 'Las observaciones no pueden exceder los 1000 caracteres';
    }
    if (!formData.id_tipous) newErrors.id_tipous = 'Debe seleccionar un tipo de usuario';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const url = isEditing && formData.id_solicitud
          ? `http://localhost:26001/api/solicitud/${formData.id_solicitud}`
          : 'http://localhost:26001/api/solicitud';
        console.log('Enviando', isEditing ? 'PUT' : 'POST', '->', url);
        console.log('Payload:', formData);

        let res;
        if (isEditing && formData.id_solicitud) {
          const payload = { ...formData };
          delete payload.id_equipo;
          res = await axios.put(url, payload, { headers: { ...getAuthHeader() } });
        } else {
          res = await axios.post(url, formData, { headers: { ...getAuthHeader() } });
        }
        console.log('Respuesta servidor:', res?.data);
        Swal.fire({
          title: "Exitoso",
          text: "Solicitud enviada exitosamente",
          icon: "success"
        });
        resetForm();
      } catch (err) {
        console.error('Error enviando solicitud:', err);
        console.error('Error response data:', err.response?.data);
        const serverMsg = err.response?.data?.error || err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
        Swal.fire({
          title: "Error",
          text: `Error al enviar la solicitud: ${serverMsg}`,
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
      id_persona: userId || '',
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
                      {isEditing ? (
                        (() => {
                          const selected = equipos.find(e => (e.ID_EQUIPO || e.id_equipo) == formData.id_equipo);
                          if (!selected) {
                            return (
                              <input type="text" value={formData.id_equipo || 'Equipo desconocido'} disabled className={`form-control shadow-sm ${errors.id_equipo ? 'is-invalid' : ''}`} />
                            );
                          }
                          const marcaObj = marcas.find(m => (m.ID_MARCA || m.id_marca) == (selected.ID_MARCA || selected.id_marca));
                          const marcaName = (marcaObj && (marcaObj.NOMBRE_MARCA || marcaObj.nombre_marca)) || (selected.ID_MARCA || selected.id_marca) || 'Marca desconocida';
                          const label = `${marcaName} - ${selected.EQUIPO_SERIAL || selected.equipo_serial}`;
                          return (
                            <input
                              type="text"
                              value={label}
                              disabled
                              className={`form-control shadow-sm ${errors.id_equipo ? 'is-invalid' : ''}`}
                            />
                          );
                        })()
                      ) : (
                        <>
                          <select
                            name="id_equipo"
                            value={formData.id_equipo}
                            onChange={handleChange}
                            className={`form-select shadow-sm ${errors.id_equipo ? 'is-invalid' : ''}`}
                          >
                            <option value="">Seleccione un equipo</option>
                            {equipos.length === 0 ? (
                              <option value="" disabled>No hay elementos</option>
                            ) : (
                              equipos.map(eq => (
                                <option key={eq.ID_EQUIPO || eq.id_equipo} value={eq.ID_EQUIPO || eq.id_equipo}>{(() => {
                                  const marca = marcas.find(m => (m.ID_MARCA || m.id_marca) == (eq.ID_MARCA || eq.id_marca));
                                  return (marca && (marca.NOMBRE_MARCA || marca.nombre_marca)) || (eq.ID_MARCA || eq.id_marca) || 'Marca desconocida';
                                })()} - {eq.EQUIPO_SERIAL || eq.equipo_serial}</option>
                              ))
                            )}
                          </select>
                          {errors.id_equipo && <div className="invalid-feedback">{errors.id_equipo}</div>}
                        </>
                      )}
                    </div>
                    <div className='w-50 ms-1'>
                      <label className="form-label fw-bold">
                        Tipo usuario <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={auth?.user?.id_perfil === 1 ? 'EMPLEADO' : auth?.user?.id_perfil === 2 ? 'CLIENTE' : ''}
                        disabled
                        className={`form-control shadow-sm ${errors.id_tipous ? 'is-invalid' : ''}`}
                      />
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
                    {isEditing ? (
                      <>
                        <button type="button" onClick={() => { resetForm(); setIsEditing(false); }} className="btn btn-secondary px-4 py-2">
                          Cancelar edición
                        </button>
                        <button type="submit" className="btn btn-warning px-4 py-2">
                          Actualizar Solicitud
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={resetForm} className="btn btn-secondary px-4 py-2">
                          Limpiar
                        </button>
                        <button type="submit" className="btn btn-primary px-4 py-2">
                          Enviar Solicitud
                        </button>
                      </>
                    )}
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
