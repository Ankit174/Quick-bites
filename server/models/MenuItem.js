const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., 'Breakfast', 'Lunch', 'Snacks', 'Beverages'
    image_url: { type: String, required: true },
    is_veg: { type: Boolean, required: true, default: true },
    result: { type: Number, default: 0 }, // Rating
    reviews_count: { type: Number, default: 0 },
    is_available: { type: Boolean, default: true }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
