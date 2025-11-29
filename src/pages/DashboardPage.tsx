import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './/LoginPage';
import DashboardPage from './DashboardPage';

// Protegemos la ruta para que solo entre quien tenga token
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
export default App;