import React from 'react';
import Button from '../atoms/Button';

const Cart = ({ items, onRemove, onCheckout, total }) => {
    return (
        <div className="bg-gray-100 p-6 rounded-lg h-full">
            <h2 className="text-2xl font-bold mb-4">Nueva Venta</h2>

            {items.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío</p>
            ) : (
                <ul className="space-y-3 mb-6">
                    {items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center bg-white p-2 rounded">
                            <div>
                                <span className="font-bold block">{item.nombre}</span>
                                <span className="text-sm text-gray-500">
                  {item.cantidad} x ${item.precio}
                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold">${item.cantidad * item.precio}</span>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                >
                                    X
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="border-t pt-4 mt-auto">
                <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span>${total}</span>
                </div>
                <Button variant="success" onClick={onCheckout} >
                    Confirmar Venta
                </Button>
            </div>
        </div>
    );
};

export default Cart;