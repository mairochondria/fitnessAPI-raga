const express = require("express")
const cartController = require("../controllers/cart")

const { verify, verifyAdmin, verifyToken, isLoggedIn } = require("../auth")

const router = express.Router()

router.post('/add-to-cart', verifyToken, cartController.addToCart);

router.get('/retrieve', verifyToken, cartController.getCart);

router.patch('/update-cart-quantity', verifyToken, cartController.updateCartQuantity);

module.exports = router;