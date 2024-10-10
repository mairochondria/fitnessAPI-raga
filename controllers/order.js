const Cart = require("../models/Cart");
const Order = require('../models/Order');
const {errorHandler} = require("../auth");


module.exports.checkoutOrder = (req, res) => {
	const userId = req.user.id;

	Cart.findOne({ userId })
	    .then((cart) => {
		    if (!cart) {
		        return res.status(404).json({ error: 'No cart found for the user' });
		    }

		    if (cart.cartItems.length === 0) {
		        return res.status(400).json({ error: 'No items to checkout' });
		    }

		    const newOrder = new Order({
		        userId,
		        productsOrdered: cart.cartItems,
		        totalPrice: cart.totalPrice,
		        status: 'Pending',
		    });

		    return newOrder.save();
	    })
	    .then((savedOrder) => {
		    return res.status(201).json({
		        message: 'Ordered Successfully'
		    });
	    })
	    .catch((error) => errorHandler(error, req, res));
};

module.exports.getMyOrders = (req, res) => {
    
    const userId = req.user.id;

    Order.find({ userId })
        .then(orders => {
            
            if (!orders || orders.length === 0) {
                return res.status(404).send({
                    message: "No orders found for this user."
                });
            }

            return res.status(200).send({
            	orders: orders
            });
        })
        .catch((error) => errorHandler(error, req, res));
};

module.exports.getAllOrders = (req, res) => {
    
    Order.find()
        .then(orders => {
            
            if (!orders || orders.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "No orders found"
                });
            }

            return res.status(200).send({
                orders: orders
            });
        })
        .catch((error) => errorHandler(error, req, res));
};