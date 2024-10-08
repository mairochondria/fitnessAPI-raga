const express = require("express");
const productController = require("../controllers/product");
const {verify, verifyAdmin} = require("../auth");

const router = express.Router();

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.post("/", verify, verifyAdmin, productController.addProduct);

router.post("/active", productController.getAllACtive);

router.get("/:productid", productController.getProduct);

router.patch(
	"/:productId/activate",
	verify,
	verifyAdmin,
	productController.activateProduct
);

router.patch(
	"/:productId/archive",
	verify,
	verifyAdmin,
	productController.archiveProduct
);

router.patch(
	"/:productId/update",
	verify,
	verifyAdmin,
	productController.updateProduct
);

module.exports = router;
