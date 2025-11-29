import React from 'react';

const ProductCard = ({ producto, onAddToCart }) => {
    const sinStock = producto.stock <= 0;

    return (
        <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            {/* Indicador de Stock */}
            <div className="absolute top-4 right-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${sinStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {sinStock ? 'Agotado' : `${producto.stock} un.`}
                </span>
            </div>

            {/* Icono / Imagen Placeholder */}
            <div className="h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-4xl">📦</span>
            </div>

            <div className="flex-grow">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{producto.nombre}</h3>
                <p className="text-slate-400 text-sm">Código: #{producto.id.toString().padStart(4, '0')}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <span className="block text-xs text-slate-400">Precio</span>
                    <span className="text-xl font-extrabold text-indigo-600">
                        ${parseInt(producto.precio).toLocaleString()}
                    </span>
                </div>

                <button
                    onClick={() => onAddToCart(producto)}
                    disabled={sinStock}
                    className={`
                        w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-90
                        ${sinStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-1 shadow-indigo-500/30'
                    }
                    `}
                >
                    <span className="text-xl font-bold">+</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;