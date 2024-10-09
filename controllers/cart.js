const Cart = require("../models/Cart");
const {errorHandler} = require("../auth");


module.exports.addToCart = (req, res) => {
    const userId = req.user.id;
    const { productId, productName, price, quantity, subtotal } = req.body;

    if (!productId || !productName || !price || !quantity || !subtotal) {
        if (!productId || !productName || !price || !quantity || !subtotal) {
        const missingFields = [];
        if (!productId) missingFields.push('productId');
        if (!productName) missingFields.push('productName');
        if (!price) missingFields.push('price');
        if (!quantity) missingFields.push('quantity');
        if (!subtotal) missingFields.push('subtotal');

        return res.status(400).json({ 
            message: 'The following fields are required: ' + missingFields.join(', ') 
        });
    }
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
                cart.cartItems[existingProductIndex].price = price;
            } else {

                cart.cartItems.push({ productId, quantity, price, subtotal });
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

                if (typeof item.price !== 'number' || isNaN(item.price)) {
                    return res.status(400).json({ message: "Item price is not valid." });
                }

                // Log values for debugging
                console.log('Price:', item.price);
                item.quantity = newQuantity;
                const newSubtotal = item.price * newQuantity;
                if (newSubtotal < 0) {
                    return res.status(400).json({ message: "Subtotal cannot be negative." });
                }
                item.subtotal = newSubtotal; 
            } else {
                return res.status(404).json({ message: "Product not found in cart." });
            }

            cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
            
            return cart.save();
        })
        .then(updatedCart => {

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


            res.status(200).json({ message: "Item quantity updated successfully", updatedCart: responseCart });
        })
        .catch(err => {
            res.status(500).json({ message: "An error occurred while updating the cart.", error: err.message });
        });
};