import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path
        ? "text-indigo-600 bg-indigo-50 font-bold"
        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-medium";

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                        T
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">Tienda<span className="text-indigo-600">App</span></span>
                </div>

                {/* Links de Navegación */}
                <div className="hidden md:flex gap-2 bg-slate-100/50 p-1 rounded-xl">
                    <Link to="/dashboard" className={`px-4 py-2 rounded-lg transition-all ${isActive('/dashboard')}`}>
                        Punto de Venta
                    </Link>
                    <Link to="/ventas" className={`px-4 py-2 rounded-lg transition-all ${isActive('/ventas')}`}>
                        Historial
                    </Link>
                </div>

                {/* Botón Salir */}
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;