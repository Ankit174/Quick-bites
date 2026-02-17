const MenuItem = require('../models/MenuItem');

const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin only
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image_url, is_veg } = req.body;
        const item = new MenuItem({
            name,
            description,
            price,
            category,
            image_url,
            is_veg
        });
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin only
const updateMenuItem = async (req, res) => {
    const { name, description, price, category, image_url, is_veg, is_available } = req.body;
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            item.name = name || item.name;
            item.description = description || item.description;
            item.price = price || item.price;
            item.category = category || item.category;
            item.image_url = image_url || item.image_url;
            item.is_veg = is_veg !== undefined ? is_veg : item.is_veg;
            item.is_available = is_available !== undefined ? is_available : item.is_available;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };
