const express = require("express")
const orderController = require("../controllers/order")

const { verify, verifyAdmin, verifyToken, isLoggedIn } = require("../auth")

const router = express.Router()

router.post('/checkout', verify, orderController.checkoutOrder);

router.get('/my-orders', verify, orderController.getMyOrders);

router.get('/all-orders', verify, verifyToken, verifyAdmin, orderController.getAllOrders);

module.exports = router;