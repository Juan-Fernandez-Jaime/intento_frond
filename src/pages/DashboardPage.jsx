import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card';
import Button from '../components/atoms/Button';

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const navigate = useNavigate();

    // 1. Cargar productos al entrar
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

    // Lógica del carrito
    const agregar = (prod) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id === prod.id);
            if (existe) {
                // CORRECCIÓN AQUÍ: Quitamos el "Tl" que sobraba
                if (existe.cantidad >= prod.stock) return prev;
                return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...prod, cantidad: 1 }];
        });
    };

    const quitar = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    // 2. Enviar venta
    const finalizarVenta = async () => {
        if (carrito.length === 0) return;

        // Formato DTO para NestJS
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

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold">Sistema de Ventas</h1>
                <Button onClick={logout} variant="danger" className="text-sm">Cerrar Sesión</Button>
            </header>

            <div className="container mx-auto p-4 flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Catálogo */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Productos Disponibles</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {productos.map(prod => (
                            <ProductCard key={prod.id} producto={prod} onAddToCart={agregar} />
                        ))}
                    </div>
                </div>

                {/* Carrito */}
                <div className="md:col-span-1">
                    <Cart items={carrito} onRemove={quitar} onCheckout={finalizarVenta} total={total} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;