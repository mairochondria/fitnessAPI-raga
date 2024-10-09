const Cart = require("../models/Cart");
const {errorHandler} = require("../auth");


module.exports.addToCart = (req, res) => {
    const userId = req.user.id;
    const { productId, productName, price, quantity, subtotal } = req.body;

    if (!productId || !productName || !price || !quantity || !subtotal) {
        return res.status(400).json({ message: 'Product ID, Product name, price, quantity, and subtotal are required.' });
    }

    Cart.findOne({ userId })
        .then((cart) => {
            if (!cart) {
                cart = new Cart({
                    userId,
                    cartItems: [],
                    totalPrice: 0
                });
            }

            const existingProductIndex = cart.cartItems.findIndex(item => item.productId === productId);

            if (existingProductIndex > -1) {

                cart.cartItems[existingProductIndex].quantity += quantity;
                cart.cartItems[existingProductIndex].subtotal += subtotal;
            } else {

                cart.cartItems.push({ productId, quantity, subtotal });
            }

            cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

            return cart.save();
        })
        .then((updatedCart) => {

        	const responseCart = {
                _id: updatedCart._id, // Move _id first
                userId: updatedCart.userId,
                cartItems: updatedCart.cartItems,
                totalPrice: updatedCart.totalPrice,
                orderedOn: updatedCart.orderedOn,
                __v: updatedCart.__v
            };

            return res.status(200).json({
                message: 'Item added to cart successfully',
                cart: responseCart
            });
        })
        .catch((error) => errorHandler(error, req, res));
};