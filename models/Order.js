const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productsOrdered: [
        {
          productId: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          subtotal: {
            type: Number,
            required: true,
          },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
    type: String,
    default: 'Pending'
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);