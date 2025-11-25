
import { Routes, Route, useNavigate } from 'react-router-dom';
import RequestForm from './request-form';
import Navbar from './navbar';

function App() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar onCreateRequest={() => navigate('/solicitud')} />
            <Routes>
                <Route path="/" element={
                    <div className="container-fluid text-white">
                        <h1 className='text-uppercase text-fs-1 align-items-center justify-content-center d-flex text-primary my-4'
                            style={{
                                fontWeight: 'bold',
                                fontFamily: 'Comic Sans MS, cursive',
                            }}>
                            Bienvenidos
                        </h1>
                        <p className='text-dark fs-5 justify-content-center d-flex text-center'
                            style={{
                                fontWeight: 'light',
                                fontFamily: 'Comic Sans MS, cursive',
                            }}>
                            Ofrecemos servicios profesionales de mantenimiento y reparación de portátiles y servidores.
                            Diagnóstico, limpieza, actualización de componentes y soporte técnico especializado.
                            Tu tecnología en las mejores manos.
                        </p>
                    </div>
                } />
                <Route path="/solicitud" element={<RequestForm />} />
            </Routes>
        </div>
    );
}

export default App;
