import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { clearCart, removeFromCart } from '../store/cartSlice';
import { Trash2, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';

const Checkout = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { items, total } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        shippingAddress: '',
        customEngraving: '',
    });

    const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Auto-populate logic when user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user) return;

        if (items.length === 0) {
            setErrorMessage("Your cart is empty.");
            return;
        }

        setOrderStatus('submitting');
        setErrorMessage('');

        const orderPayload = {
            items,
            mobileNumber: formData.mobileNumber,
            shippingAddress: formData.shippingAddress,
            customEngraving: formData.customEngraving,
            totalAmount: total,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                throw new Error('Order submission failed');
            }

            setOrderStatus('success');
            dispatch(clearCart());

            // Reset form after a few seconds or allow navigating away
            setTimeout(() => navigate('/'), 4000);

        } catch (err: any) {
            setOrderStatus('error');
            setErrorMessage(err.message || 'An error occurred while placing your order.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
                <p className="text-slate-600 mb-6">You must be logged in with Google to place a customized order.</p>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/')}
                >
                    Return to Catalog
                </button>
            </div>
        );
    }

    if (orderStatus === 'success') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                <h2 className="text-3xl font-serif font-medium text-slate-900 mb-4">Order Received</h2>
                <p className="text-lg text-slate-600 mb-8">
                    Thank you, {formData.name}. Your minimal utensils are being prepared.
                </p>
                <button onClick={() => navigate('/')} className="btn-secondary">
                    Continue Browsing
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-serif font-medium text-slate-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Order Summary Form */}
                <div className="lg:col-span-7">
                    <div className="card-minimal p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">Shipping & Customization</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        readOnly
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg p-2.5 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Auto-populated from Google</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg p-2.5 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-slate-900 focus:border-slate-900 p-2.5 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    placeholder="123 Minimalist Way, Suite 4B..."
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-slate-900 focus:border-slate-900 p-2.5 transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                                    <span>Custom Engraving / Text</span>
                                    <span className="text-xs text-slate-400 font-normal">Optional</span>
                                </label>
                                <textarea
                                    name="customEngraving"
                                    value={formData.customEngraving}
                                    onChange={handleInputChange}
                                    rows={2}
                                    maxLength={50}
                                    placeholder="e.g. 'Smith Family' or initials"
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-slate-900 focus:border-slate-900 p-2.5 transition-colors resize-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">Max 50 characters. Engraved on the base of compatible items.</p>
                            </div>

                            {orderStatus === 'error' && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-start gap-2 border border-red-100">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={orderStatus === 'submitting' || items.length === 0}
                                className="btn-primary w-full py-3 text-base flex justify-center items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                {orderStatus === 'submitting' ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Items */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 rounded-xl p-6 sm:p-8 border border-slate-200 h-full">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex justify-between items-center">
                            <span>Order Summary</span>
                            <span className="text-sm font-normal text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                            </span>
                        </h2>

                        {items.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p>Your cart is empty.</p>
                                <button onClick={() => navigate('/')} className="text-slate-900 underline mt-2 text-sm">
                                    Browse Catalog
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.size}`} className="flex justify-between items-start bg-white p-4 rounded-lg border border-slate-100 shadow-sm relative group">
                                        <div>
                                            <h4 className="font-medium text-slate-900">{item.name}</h4>
                                            <div className="text-sm text-slate-500 mt-1 flex gap-3">
                                                <span>Qty: {item.quantity}</span>
                                                {item.size !== 'Standard' && <span>Size: {item.size}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => dispatch(removeFromCart({ productId: item.productId, size: item.size }))}
                                                className="text-slate-300 hover:text-red-500 mt-2 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {items.length > 0 && (
                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Shipping</span>
                                    <span>Complimentary</span>
                                </div>
                                <div className="flex justify-between font-medium text-lg text-slate-900 pt-2 border-t border-slate-200">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
