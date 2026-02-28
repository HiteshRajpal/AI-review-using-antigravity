import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    sizes: string[];
    price: number;
    imageUrl: string;
}

const Catalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const response = await fetch(`${apiUrl}/api/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 text-center max-w-md">
                <h3 className="font-semibold mb-1">Error Loading Catalog</h3>
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-xs text-red-500 mt-4 uppercase tracking-wider font-semibold">Make sure the backend is running</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-serif font-medium text-slate-900 tracking-tight sm:text-5xl mb-4">
                    Rajpal Steel Collection
                </h1>
                <p className="text-lg text-slate-600">
                    Minimalist kitchen utensils designed for everyday functionality and timeless aesthetics.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {products.length === 0 && !loading && (
                <div className="text-center text-slate-500 py-12">No products found. Did you run the seed script?</div>
            )}
        </div>
    );
};

export default Catalog;
