import { useState, useEffect } from 'react';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';
import { Search } from 'lucide-react';

export default function Home() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, veg, non-veg

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                setMenuItems(res.data);
            } catch (error) {
                console.error("Failed to fetch menu", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'veg' ? item.is_veg
                : !item.is_veg;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero / Search Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order form Canteen</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
                            placeholder="Search for food..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full border ${filter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('veg')}
                            className={`px-4 py-2 rounded-full border ${filter === 'veg' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                            Veg
                        </button>
                        <button
                            onClick={() => setFilter('non-veg')}
                            className={`px-4 py-2 rounded-full border ${filter === 'non-veg' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                            Non-Veg
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading menu...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <MenuItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No items found matching your filters.
                </div>
            )}
        </div>
    );
}
