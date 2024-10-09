const express = require("express")
const cartController = require("../controllers/cart")

const { verify, verifyAdmin, verifyToken, isLoggedIn } = require("../auth")

const router = express.Router()

router.post('/add-to-cart', verify, cartController.addToCart);

router.get('/get-cart', verify, cartController.getCart);

router.patch('/update-cart-quantity', verify, cartController.updateCartQuantity);

router.patch('/:productid/remove-from-cart', verify, cartController.removeFromCart);

router.put('/clear-cart', verify, cartController.clearCart);

module.exports = router;