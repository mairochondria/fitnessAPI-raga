const express = require("express")
const userController = require("../controllers/user")

const { verify, verifyToken, verifyAdmin, isLoggedIn } = require("../auth")

const router = express.Router()

router.post("/login", userController.loginUser)

router.post("/register", userController.registerUser)

router.get("/details", verify, userController.getDetails)

router.patch('/:id/set-as-admin', verifyToken, verifyAdmin, userController.updateUserToAdmin);

router.patch('/update-password', verify, userController.resetPassword);

module.exports = router;