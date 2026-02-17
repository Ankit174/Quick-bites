import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center text-primary font-bold text-xl gap-2 font-sans">
                            <img src="/logo_qb.svg" alt="Quick Bites Logo" className="h-12 w-12 object-contain" />
                            <span className="tracking-wide">Quick Bites</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="relative text-gray-600 hover:text-primary">
                            <ShoppingBag className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-primary font-medium">Admin</Link>
                                )}
                                {(user.role === 'staff' || user.role === 'admin') && (
                                    <Link to="/staff" className="text-gray-600 hover:text-primary font-medium">Staff</Link>
                                )}
                                <span>{user.name}</span>
                                <button onClick={logout} className="text-gray-600 hover:text-gray-900">Logout</button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>
                                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-600">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
