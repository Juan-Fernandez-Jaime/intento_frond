import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.js';

// Componente para proteger la ruta (solo entra si hay token)
const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <RutaPrivada>
                            <DashboardPage />
                        </RutaPrivada>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

// ⚠️ ¡ESTA LÍNEA ES LA QUE TE FALTA!
export default App;