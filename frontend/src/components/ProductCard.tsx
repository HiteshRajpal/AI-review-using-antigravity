import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Plus } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    sizes: string[];
    price: number;
    imageUrl: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    const dispatch = useDispatch();
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                size: selectedSize,
                quantity: 1,
            })
        );
    };

    return (
        <div className="card-minimal group flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg text-slate-900 leading-tight">{product.name}</h3>
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">{product.category}</span>
                    </div>
                    <span className="font-medium text-lg text-slate-900">${product.price.toFixed(2)}</span>
                </div>

                <p className="text-sm text-slate-600 mb-6 flex-grow">{product.description}</p>

                <div className="mt-auto space-y-4">
                    {product.sizes.length > 1 ? (
                        <div className="flex flex-col space-y-2">
                            <label htmlFor={`size-${product._id}`} className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                Size Selection
                            </label>
                            <select
                                id={`size-${product._id}`}
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-slate-900 focus:border-slate-900 block p-2.5 transition-colors"
                            >
                                {product.sizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 flex items-center h-[62px]">
                            <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium">Standard Size</span>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="btn-primary w-full flex items-center justify-center gap-2 group/btn"
                    >
                        <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                        Add to Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
