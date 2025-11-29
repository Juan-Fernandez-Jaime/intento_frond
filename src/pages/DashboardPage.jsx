import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card'; // Asegúrate que el import coincida con el nombre del archivo
import Navbar from '../components/organisms/Navbar'; // Importamos el nuevo Navbar

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const navigate = useNavigate();

    const cargarProductos = async () => {
        try {
            const { data } = await api.get('/productos');
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar productos", error);
            if (error.response?.status === 401) navigate('/');
        }
    };

    useEffect(() => { cargarProductos(); }, []);

    const agregar = (prod) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id === prod.id);
            if (existe) {
                if (existe.cantidad >= prod.stock) return prev;
                return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...prod, cantidad: 1 }];
        });
    };

    const quitar = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    const finalizarVenta = async () => {
        if (carrito.length === 0) return;

        const datosVenta = {
            detalles: carrito.map(item => ({
                productoId: item.id,
                cantidad: item.cantidad
            }))
        };

        try {
            await api.post('/boletas', datosVenta);
            alert('¡Venta realizada con éxito!');
            setCarrito([]);
            cargarProductos();
        } catch (error) {
            alert('Error en la venta: ' + (error.response?.data?.message || 'Revisa el stock'));
        }
    };

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* 1. Usamos el nuevo Navbar */}
            <Navbar />

            <div className="container mx-auto p-6 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* 2. Columna Izquierda: Catálogo (Ocupa 8 de 12 columnas) */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Catálogo</h2>
                            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                        {productos.length} productos
                    </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {productos.map(prod => (
                                <ProductCard key={prod.id} producto={prod} onAddToCart={agregar} />
                            ))}
                        </div>
                    </div>

                    {/* 3. Columna Derecha: Carrito (Ocupa 4 de 12 columnas) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <Cart
                                items={carrito}
                                onRemove={quitar}
                                onCheckout={finalizarVenta}
                                total={total}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardPage;