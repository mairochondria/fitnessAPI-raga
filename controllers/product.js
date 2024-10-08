const Product = require("../models/Product");
const {errorHandler} = require("../auth");

module.exports.addProduct = (req, res) => {
	let newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
	});

	Product.findOne({name: req.body.name})
		.then((existingProduct) => {
			if (existingProduct) {
				return res.status(409).send({message: "Course already exists"});
			} else {
				return newProduct
					.save()
					.then((result) =>
						res.status(201).send(
							result,
						)
					)
					.catch((error) => errorHandler(error, req, res));
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.getAllProducts = (req, res) => {
	return Product.find({})
		.then((result) => {
			if (result.length === 0) {
				return res.status(404).send({message: "No courses found"});
			}

			return res.status(200).send(result);
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {
	return Product.find({isActive: true})
		.then((products) => {
			if (products.length > 0) {
				return res.status(200).send(products);
			} else {
				return res
					.status(404)
					.send({message: "No active courses found"});
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.getProduct = (req, res) => {
	return Product.findById(req.params.productId)
		.then((product) => {
			if (!product) {
				return res.status(404).send({message: "Course not found"});
			} else {
				return res.status(200).send(product);
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.updateProduct = (req, res) => {
	const {productId} = req.params;
	const updateData = req.body;

	return Product.findByIdAndUpdate(productId, updateData, {new: true})
		.then((updatedProduct) => {
			if (!updatedProduct) {
				return res.status(404).send({message: "Product not found"});
			} else {
				return res.status(200).send({
					success: true,
					message: "Product updated successfully",
				});
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.archiveProduct = (req, res) => {
	const {productId} = req.params;

	return Product.findByIdAndUpdate(productId, {isActive: false})
		.then((product) => {
			if (product) {
				if (!product.isActive) {
					return res
						.status(200)
						.send({message: "Product already archived", archivedProduct: product});
				}

				return res.status(200).send({
					success: true,
					message: "Product archived successfully",
				});
			} else {
				res.status(404).send({message: "Product not found"});
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.activateProduct = (req, res) => {
	const {productId} = req.params;

	return Product.findByIdAndUpdate(productId, {isActive: true})
		.then((product) => {
			if (product) {
				if (product.isActive) {
					return res
						.status(200)
						.send({message: "Product already active", activateProduct: product});
				}
				res.status(200).send({
					success: true,
					message: "Product activated successfully",
				});
			} else {
				res.status(404).send({message: "Product not found"});
			}
		})
		.catch((error) => errorHandler(error, req, res));
};