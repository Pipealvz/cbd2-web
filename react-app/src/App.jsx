import { Routes, Route, useNavigate } from 'react-router-dom';
import RequestForm from './request-form';
import Navbar from './navbar';
import './App.css';

function App() {
    const navigate = useNavigate();
    return (
        <div className="app-wrapper">
            <Navbar onCreateRequest={() => navigate('/solicitud')} />
            <Routes>
                <Route path="/" element={
                    <div className="hero-section">
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
                } />
                <Route path="/solicitud" element={<RequestForm />} />
            </Routes>
        </div>
    );
}

export default App;
