import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RequestForm from './request-form';
import Navbar from './navbar';
import './App.css';
import LeerSolicitud from './leerSolicitud';
import { AuthProvider } from './auth/AuthProvider.jsx';
import Login from './Login.jsx';
import RegisterClient from './RegisterClient.jsx';
import FormEquipo from './form-equipo.jsx';
import MarcaView from './MarcaView.jsx';
import FormMarca from './form-marca.jsx';
import TipoRepView from './TipoRepView.jsx';
import FormTipoRep from './form-tipoRep.jsx';
import LeerEquipo from './leerEquipo.jsx';
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import EstadoPedidosView from './DetalleSolicitudView.jsx';
import EditarSolicitud from './editarSolicitud.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const navigate = useNavigate();
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <div className="app-wrapper">
                            <div className="hero-fluid">
                                <div className="hero-content">
                                    <h1 className="hero-title">
                                        Bienvenidos a CBD2
                                    </h1>
                                    <p className="hero-subtitle">
                                        Soluciones tecnológicas profesionales
                                    </p>

                                    <div className="services-grid">
                                        <div className="service-card">
                                            <div className="service-icon">⚙️</div>
                                            <h3>Mantenimiento</h3>
                                            <p>Limpieza, actualización y optimización de equipos</p>
                                        </div>

                                        <div className="service-card">
                                            <div className="service-icon">🔧</div>
                                            <h3>Reparación</h3>
                                            <p>Diagnóstico y reparación de portátiles y servidores</p>
                                        </div>

                                        <div className="service-card">
                                            <div className="service-icon">🛡️</div>
                                            <h3>Soporte Técnico</h3>
                                            <p>Asistencia especializada y soporte continuo</p>
                                        </div>
                                    </div>

                                    <div className="hero-description">
                                        <p>Ofrecemos servicios profesionales de mantenimiento y reparación de portátiles y servidores. Con diagnóstico experto, actualización de componentes y soporte técnico especializado.</p>
                                        <p className="highlight">Tu tecnología en las mejores manos.</p>
                                    </div>

                                    <button
                                        className="cta-button"
                                        onClick={() => navigate('/solicitud')}
                                    >
                                        Solicitar Servicio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/solicitud" element={<ProtectedRoute><RequestForm /></ProtectedRoute>} />
                <Route path="/solicitudes" element={<ProtectedRoute><LeerSolicitud /></ProtectedRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="*" element={<div className="text-center mt-5"><h2>Página no encontrada</h2></div>} />
                <Route path="/register" element={<PublicRoute><RegisterClient /></PublicRoute>} />
                <Route path="/form-equipo" element={<ProtectedRoute><FormEquipo /></ProtectedRoute>} />
                <Route path="/marcas" element={<ProtectedRoute><MarcaView /></ProtectedRoute>} />
                <Route path="/tipos-rep" element={<ProtectedRoute><TipoRepView /></ProtectedRoute>} />
                <Route path="/form-marca" element={<ProtectedRoute><FormMarca /></ProtectedRoute>} />
                <Route path="/form-tipo-rep" element={<ProtectedRoute><FormTipoRep /></ProtectedRoute>} />
                <Route path="/equipos" element={<ProtectedRoute><LeerEquipo /></ProtectedRoute>} />
                <Route path="/estado-pedidos" element={<ProtectedRoute><EstadoPedidosView /></ProtectedRoute>} />
                <Route path="/editar-solicitud" element={<ProtectedRoute><EditarSolicitud /></ProtectedRoute>} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
