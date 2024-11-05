const User = require("../models/User");

const bcrypt = require("bcryptjs");
const auth = require("../auth");

const {errorHandler} = require("../auth");

module.exports.registerUser = (req, res) => {
	if (req.body.password.length < 8) {
		return res
			.status(400)
			.send({error: "Password must be at least 8 characters long"});
	}

	let newUser = new User({
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10)
	});

	newUser
		.save()
		.then((result) => {
			return res.status(201).send({
				message: "Registered successfully"
			});
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.loginUser = (req, res) => {
	if (req.body.email.includes("@")) {
		return User.findOne({email: req.body.email})
			.then((result) => {
				console.log("Login Result:", result); // Check this output
				if (result === null) {
					return res.status(404).send({error: "No email found"});
				} else {
					const isPasswordCorrect = bcrypt.compareSync(
						req.body.password,
						result.password
					);
					if (isPasswordCorrect) {
						return res.status(200).send({
							access: auth.createAccessToken(result),
						});

					} else {
						return res
							.status(401)
							.send({error: "Email and password do not match"});
					}
				}
			})
			.catch((error) => errorHandler(error, req, res));
	} else {
		return res.status(400).send({error: "Invalid email"});
	}

};