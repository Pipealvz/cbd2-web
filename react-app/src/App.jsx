
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
                    <div className="container mt-5">
                        <h2>Bienvenido</h2>
                        <p>Haz clic en "Crear solicitud" para comenzar.</p>
                    </div>
                } />
                <Route path="/solicitud" element={<RequestForm />} />
            </Routes>
        </div>
    );
}

export default App;
