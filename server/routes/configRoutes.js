const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const { protect, admin } = require('../middleware/authMiddleware'); // Assuming these exist based on context

// @desc    Get config by key
// @route   GET /api/config/:key
// @access  Public
router.get('/:key', async (req, res) => {
    try {
        const config = await Config.findOne({ key: req.params.key });
        if (config) {
            res.json(config);
        } else {
            res.status(404).json({ message: 'Config not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update config
// @route   PUT /api/config
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    const { key, value } = req.body;

    // Check if key and value are provided using a simple check
    if (!key || value === undefined) {
        return res.status(400).json({ message: 'Key and value are required' });
    }


    try {
        const config = await Config.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true } // Create if not exists
        );
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
