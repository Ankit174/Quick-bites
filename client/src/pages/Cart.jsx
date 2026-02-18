import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const orderData = {
                orderItems: cart.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    image_url: item.image_url,
                    price: item.price,
                    menu_item: item._id
                })),
                paymentMethod: paymentMethod,
                itemsPrice: cartTotal,
                taxPrice: 0,
                totalPrice: cartTotal
            };

            const res = await api.post('/orders', orderData);
            clearCart();
            alert('Order Placed Successfully! Token: ' + res.data.tokenNumber);
            navigate('/');
        } catch (error) {
            console.error("Order failed", error);
            alert('Order failed');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="mt-4 text-gray-600">Go add some delicious food!</p>
                <button onClick={() => navigate('/')} className="mt-8 bg-primary text-white px-6 py-2 rounded-full">
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {cart.map(item => (
                        <div key={item._id} className="flex gap-4 bg-white p-4 rounded-lg shadow mb-4">
                            <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                            <div className="flex-grow">
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-gray-600">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-200">-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-200">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="text-red-500 font-semibold self-center">Remove</button>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Items Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between mb-4 font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-3">Payment Method</h3>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Cash"
                                    checked={paymentMethod === 'Cash'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="accent-primary"
                                />
                                <span>Cash on Counter</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="accent-primary"
                                />
                                <span>Online (UPI)</span>
                            </label>
                        </div>

                        {paymentMethod === 'UPI' && (
                            <div className="mt-4 flex flex-col items-center p-4 bg-gray-50 rounded-lg border">
                                <img
                                    src={`/payment-qr.png?t=${Date.now()}`}
                                    alt="Payment QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                                <p className="text-sm text-gray-500 mt-2 text-center">Scan & Pay ₹{cartTotal}</p>
                                <p className="text-xs text-red-500 mt-1 font-bold">Enter amount manually!</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
                    >
                        Proceed to Pay
                    </button>
                </div>
            </div>
        </div>
    );
}
