const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    subtotal: { 
        type: Number, 
        required: true 
    }
});

const cartSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    cartItems: [cartItemSchema],
    totalPrice: { 
        type: Number, 
        default: 0 
    },
    orderedOn: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Cart', cartSchema);