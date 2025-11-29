import React, { useEffect, useState } from 'react';
import api from '../services/api'; //
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

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">ID Boleta</th>
                            <th className="p-4 font-semibold text-gray-600">Fecha</th>
                            <th className="p-4 font-semibold text-gray-600">Vendedor</th>
                            <th className="p-4 font-semibold text-gray-600">Detalles (Productos)</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Total</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {boletas.map((boleta) => (
                            <tr key={boleta.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-blue-600">#{boleta.id}</td>
                                <td className="p-4 text-gray-600">
                                    {new Date(boleta.fecha).toLocaleString()}
                                </td>
                                <td className="p-4 text-gray-700">
                                    {boleta.usuario?.nombre || 'Desconocido'}
                                </td>
                                <td className="p-4">
                                    <ul className="text-sm text-gray-500 list-disc list-inside">
                                        {boleta.detalles.map((detalle) => (
                                            <li key={detalle.id}>
                                                {detalle.cantidad} x {detalle.producto?.nombre}
                                                <span className="text-xs text-gray-400 ml-1">
                             (${parseInt(detalle.subtotal).toLocaleString()})
                           </span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-4 text-right font-bold text-green-600">
                                    ${parseInt(boleta.total).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {boletas.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
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