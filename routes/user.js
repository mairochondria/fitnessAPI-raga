const express = require("express")
const userController = require("../controllers/user")

const { verify, verifyAdmin, verifyToken, isLoggedIn } = require("../auth")

const router = express.Router()

router.post("/register", userController.registerUser)

router.post("/login", userController.loginUser)

router.get("/details", verify, userController.getProfile)

router.patch('/:id/set-as-admin', verifyToken, verifyAdmin, userController.updateUserToAdmin);

router.patch('/update-password', verify, userController.resetPassword);

module.exports = router