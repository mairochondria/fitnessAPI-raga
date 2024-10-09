const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {errorHandler} = require("../auth");


module.exports.addToCart = (req, res) => {
    const userId = req.user.id;
    const { productId, quantity, subtotal } = req.body;

    if (!productId || !quantity || !subtotal) {
        const missingFields = [];
        if (!productId) missingFields.push('productId');
        if (!quantity) missingFields.push('quantity');
        if (!subtotal) missingFields.push('subtotal');

        return res.status(400).json({ 
            message: 'The following fields are required: ' + missingFields.join(', ') 
        });
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
                _id: updatedCart._id,
                userId: updatedCart.userId,
                cartItems: updatedCart.cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    _id: item._id // Include the item ID if needed
                })),
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

module.exports.getCart = (req, res) => {
  const userId = req.user.id;

  Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({
          message: 'No cart found for the current user',
        });
      }

      return res.status(200).send( {cart} );
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.updateCartQuantity = (req, res) => {
    const userId = req.user.id;

    Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: "Cart not found." });
            }

            const { productId, newQuantity } = req.body;

            const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

            if (productIndex !== -1) {
                const item = cart.cartItems[productIndex];

                // Fetch the current price of the product
                return Product.findById(productId).then(product => {
                    if (!product || typeof product.price !== 'number' || isNaN(product.price)) {
                        return res.status(400).json({ message: "Item price is not valid." });
                    }

                    // Use the fetched price to calculate the new subtotal
                    const newPrice = product.price; // Fetch the latest price from the product
                    item.quantity = newQuantity;
                    const newSubtotal = newPrice * newQuantity;
                    
                    if (newSubtotal < 0) {
                        return res.status(400).json({ message: "Subtotal cannot be negative." });
                    }
                    
                    item.subtotal = newSubtotal;

                    // Update total price of the cart
                    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
                    return cart.save();
                });
            } else {
                return res.status(404).json({ message: "Item not found in cart." });
            }
        })
        .then(updatedCart => {
            res.status(200).json({ message: "Item quantity updated successfully", updatedCart });
        })
        .catch((error) => errorHandler(error, req, res));
};

module.exports.removeFromCart = (req, res) => {

    const productId = req.params.productid;
    const userId = req.user.id;

    Cart.findOne({ userId })
        .then(cart => {

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found for the current user.' });
            }

            const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

            if (productIndex === -1) {
            	return res.status(404).json({ message: 'Item not found in cart.' });
            }

            cart.cartItems.splice(productIndex, 1);

        	return Product.findById(productId)
                .then(product => {
                    if (!product) {
                        return res.status(404).json({ message: 'Item not found.' });
                    }

                    // Map the cart items to promises that get the product prices
                    const productPricePromises = cart.cartItems.map(item => 
                        Product.findById(item.productId)
                            .then(prod => (prod ? item.quantity * prod.price : 0))
                    );

                    // Resolve all promises and calculate the total price
                    return Promise.all(productPricePromises)
                        .then(prices => {
                            cart.totalPrice = prices.reduce((total, price) => total + price, 0);
                            return cart.save();
                        });
                });
        })
        .then(updatedCart => {

            if (updatedCart) {
                res.status(200).json({
                    message: 'Item removed from cart successfully.',
                    updatedCart: updatedCart
                });
            }
        })
        .catch((error) => errorHandler(error, req, res));
};

module.exports.clearCart = (req, res) => {
    const userId = req.user.id; 


    Cart.findOne({ userId })
        .then((cart) => {

            if (!cart) {
                return res.status(404).json({
                    message: 'No cart found for the current user',
                });
            }


            if (cart.cartItems.length > 0) {

                cart.cartItems = [];
                cart.totalPrice = 0; 


                return cart.save();
            } else {

                return res.status(400).json({
                    message: 'The cart is already empty.',
                });
            }
        })
        .then((updatedCart) => {

            return res.status(200).json({
                message: 'Cart cleared successfully.',
                cart: updatedCart,
            });
        })
        .catch((error) => {

            return errorHandler(error, req, res);
        });
};