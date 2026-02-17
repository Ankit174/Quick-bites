const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image_url: { type: String, required: true },
        price: { type: Number, required: true },
        menu_item: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'MenuItem' }
    }],
    paymentMethod: { type: String, required: true }, // 'Razorpay', 'Cash'
    paymentResult: { // from Razorpay
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: { type: String, required: true, default: 'Received' }, // Received, Preparing, Ready, Delivered
    tokenNumber: { type: Number }, // Simple incrementing token
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
