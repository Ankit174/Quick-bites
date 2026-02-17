import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

export default function MenuItemCard({ item }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 w-full overflow-hidden relative">
                <img
                    src={item.image_url || "https://via.placeholder.com/300"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.is_veg ? 'VEG' : 'NON-VEG'}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-1 rounded">★ {item.rating || 4.5}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                    <button
                        onClick={() => addToCart(item)}
                        className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full hover:bg-black transition-colors text-sm font-semibold"
                    >
                        <Plus size={16} /> ADD
                    </button>
                </div>
            </div>
        </div>
    );
}
