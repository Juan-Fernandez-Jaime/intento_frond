import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card';
import Navbar from '../components/organisms/Navbar';

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const navigate = useNavigate();

    // Función auxiliar para saber si es Admin
    const checkAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role === 'admin';
        } catch { return false; }
    };
    const isAdmin = checkAdmin();

    // 1. Cargar productos
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

    // 2. FUNCIÓN DE ELIMINAR (Solo por ID)
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            await api.delete(`/productos/${id}`); // Llamada al backend
            alert('Producto eliminado correctamente');
            // Actualizamos la lista visualmente sin recargar
            setProductos(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'No tienes permisos'));
        }
    };

    // 3. Lógica del carrito (Agregar)
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

    // 4. Quitar del carrito
    const quitar = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    // 5. Finalizar Venta
    const finalizarVenta = async (metodoPago) => {
        if (carrito.length === 0) return;

        const datosVenta = {
            detalles: carrito.map(item => ({
                productoId: item.id,
                cantidad: item.cantidad
            })),
            metodoPago: metodoPago
        };

        try {
            await api.post('/boletas', datosVenta);
            alert(`✅ ¡Venta con ${metodoPago} registrada correctamente!`);
            setCarrito([]);
            cargarProductos();
        } catch (error) {
            alert('❌ Error en la venta: ' + (error.response?.data?.message || 'Revisa el stock disponible'));
        }
    };

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto p-6 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Catálogo */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h2>
                            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-semibold">
                        {productos.length} Disponibles
                    </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {productos.map(prod => (
                                <ProductCard
                                    key={prod.id}
                                    producto={prod}
                                    onAddToCart={agregar}
                                    // ⬇️ PASAMOS LAS NUEVAS PROPIEDADES
                                    onDelete={handleDeleteProduct}
                                    isAdmin={isAdmin}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Carrito */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden h-[calc(100vh-8rem)]">
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