import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';

const SalesPage = () => {
    const [boletas, setBoletas] = useState([]);

    useEffect(() => {
        const fetchBoletas = async () => {
            try {
                const { data } = await api.get('/boletas');
                setBoletas(data);
            } catch (error) {
                console.error('Error al cargar boletas', error);
            }
        };
        fetchBoletas();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Historial de Ventas</h2>

                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">ID Boleta</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Fecha</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Vendedor</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Método Pago</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Detalles</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Total</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {boletas.map((boleta) => (
                            <tr key={boleta.id} className="hover:bg-indigo-50/30 transition-colors">

                                {/* ID */}
                                <td className="p-4 font-bold text-indigo-600">
                                    #{boleta.id.toString().padStart(4, '0')}
                                </td>

                                {/* Fecha */}
                                <td className="p-4 text-slate-600 text-sm">
                                    {new Date(boleta.fecha).toLocaleString()}
                                </td>

                                {/* Vendedor */}
                                <td className="p-4 text-slate-700 font-medium">
                                    {boleta.usuario?.nombre || 'Desconocido'}
                                </td>

                                {/* Método de Pago (Etiqueta de Color) */}
                                <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        boleta.metodoPago === 'TARJETA'
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                        {boleta.metodoPago || 'EFECTIVO'}
                    </span>
                                </td>

                                {/* Detalles de Productos */}
                                <td className="p-4">
                                    <ul className="text-sm text-slate-500 space-y-1">
                                        {boletas.length > 0 && boleta.detalles ? (
                                            boleta.detalles.map((detalle) => (
                                                <li key={detalle.id} className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                    <span className="font-semibold text-slate-700">{detalle.cantidad}</span>
                                                    <span>{detalle.producto?.nombre}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">Sin detalles</span>
                                        )}
                                    </ul>
                                </td>

                                {/* Total */}
                                <td className="p-4 text-right font-extrabold text-slate-800 text-lg">
                                    ${parseInt(boleta.total).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {/* Mensaje si no hay datos */}
                        {boletas.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                                    <span className="text-4xl mb-2">📭</span>
                                    No hay ventas registradas aún.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;