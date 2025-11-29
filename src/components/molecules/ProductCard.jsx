import React from 'react';
import Button from '../atoms/Button';

const ProductCard = ({ producto, onAddToCart }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-lg">{producto.nombre}</h3>
                <p className="text-gray-600">Stock: {producto.stock}</p>
                <p className="text-xl text-blue-600 font-bold">${producto.precio}</p>
            </div>
            <div className="mt-4">
                <Button
                    onClick={() => onAddToCart(producto)}
                    variant={producto.stock > 0 ? 'primary' : 'danger'}
                >
                    {producto.stock > 0 ? 'Agregar' : 'Sin Stock'}
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;