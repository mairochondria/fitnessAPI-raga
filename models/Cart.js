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
    },
    orderedOn: { 
        type: Date, 
        default: Date.now 
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
    }
});

module.exports = mongoose.model('Cart', cartSchema);