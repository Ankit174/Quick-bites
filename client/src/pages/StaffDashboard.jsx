import { useState, useEffect } from 'react';
import api from '../services/api';

export default function StaffDashboard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        // In a real app, socket.on('new_order') while polling fallback
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            // Filter out delivered orders to clear the board
            setOrders(res.data.filter(o => o.status !== 'Delivered'));
        } catch (error) {
            console.error("Failed to fetch orders");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (error) {
            console.error("Failed to update status");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Kitchen / Staff Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">Order #{order.tokenNumber}</h3>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Ready' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="space-y-2 mb-4">
                            {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.qty} x {item.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            {order.status === 'Received' && (
                                <button
                                    onClick={() => updateStatus(order._id, 'Preparing')}
                                    className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                                >
                                    Start Preparing
                                </button>
                            )}
                            {order.status === 'Preparing' && (
                                <button
                                    onClick={() => updateStatus(order._id, 'Ready')}
                                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                                >
                                    Mark Ready
                                </button>
                            )}
                            {order.status === 'Ready' && (
                                <button
                                    onClick={() => updateStatus(order._id, 'Delivered')}
                                    className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {orders.length === 0 && <div className="text-center text-gray-500">No active orders</div>}
        </div>
    );
}
