import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { login, logout } from '../store/authSlice';
import { signInWithGoogle, logOut } from '../services/firebase';
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const fbUser = await signInWithGoogle();
            const token = await fbUser.getIdToken();

            // In a real app, send token to backend to verify and get DB user
            dispatch(login({
                id: fbUser.uid,
                name: fbUser.displayName || 'User',
                email: fbUser.email || '',
                token
            }));
        } catch (error) {
            console.error("Login failed:", error);
            // For local dev demonstration without real keys, mock login
            if (import.meta.env.VITE_FIREBASE_API_KEY === undefined) {
                dispatch(login({
                    id: 'mock_123',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    token: 'mock_token'
                }));
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (e) { /* ignore mock errors */ }
        finally {
            dispatch(logout());
        }
    };

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                            <span className="text-white font-serif font-bold text-xl">R</span>
                        </div>
                        <span className="font-semibold text-xl tracking-tight text-slate-900">Rajpal Steel</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/checkout" className="text-slate-600 hover:text-slate-900 relative">
                            <ShoppingBag className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-slate-900 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleLogin} className="btn-primary text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
