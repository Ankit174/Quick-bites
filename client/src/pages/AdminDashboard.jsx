import { useState } from 'react';
import api from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Breakfast',
        image_url: '',
        is_veg: true
    });

    // Mock Data for Analytics
    const data = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/menu', formData);
            toast.success('Item added successfully!');
            setFormData({ name: '', description: '', price: '', category: 'Breakfast', image_url: '', is_veg: true });
        } catch (error) {
            toast.error('Failed to add item');
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Sales Analytics */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Weekly Sales Analytics</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#ff4d4d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* QR Code Generator */}
                <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Table Ordering QR Code</h2>
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                        <QRCodeCanvas value="http://localhost:5173" size={200} />
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Scan to open the Digital Menu</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Add New Menu Item</h2>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹)</label>
                            <input
                                type="number"
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Snacks</option>
                                <option>Beverages</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                        <input
                            type="text"
                            required
                            placeholder="https://example.com/image.jpg"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2 leading-tight"
                                checked={formData.is_veg}
                                onChange={(e) => setFormData({ ...formData, is_veg: e.target.checked })}
                            />
                            <span className="text-gray-700 font-bold text-sm">Is Vegetarian?</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
