import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage'; // Importar nueva página

// Componente para proteger la ruta
const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta Pública */}
                <Route path="/" element={<LoginPage />} />

                {/* Rutas Privadas */}
                <Route
                    path="/dashboard"
                    element={
                        <RutaPrivada>
                            <DashboardPage />
                        </RutaPrivada>
                    }
                />
                <Route
                    path="/ventas"
                    element={
                        <RutaPrivada>
                            <SalesPage />
                        </RutaPrivada>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;