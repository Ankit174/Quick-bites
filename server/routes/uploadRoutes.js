const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../../client/public/'));
    },
    filename(req, file, cb) {
        // Always overwrite the same file
        cb(null, 'payment-qr.png');
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Images only!');
        }
    }
});

router.post('/', protect, admin, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ message: err.message || err });
        }
        if (!req.file) {
            console.error('No file received');
            return res.status(400).json({ message: 'No file received' });
        }
        console.log('File uploaded to:', req.file.path);
        res.send(`/${req.file.path}`);
    });
});

module.exports = router;
