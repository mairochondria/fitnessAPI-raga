const User = require("../models/User");

const bcrypt = require("bcryptjs");
const auth = require("../auth");

const {errorHandler} = require("../auth");

module.exports.registerUser = (req, res) => {
	if (req.body.mobileNo.length !== 11) {
		return res.status(400).send({error: "Mobile number is invalid"});
	}

	if (!req.body.email.includes("@")) {
		return res.status(400).send({error: "Email invalid"});
	}

	if (req.body.password.length < 8) {
		return res
			.status(400)
			.send({error: "Password must be at least 8 characters long"});
	}

	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		mobileNo: req.body.mobileNo,
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


module.exports.getDetails = (req, res) => {
	return User.findById(req.user.id)
		.then((result) => {
			if (result) {
				result.password = "";
				return res.status(200).send( {user: result} );
			} else {
				return res.status(404).send({error: "User not found"});
			}
		})
		.catch((error) => errorHandler(error, req, res));
};

module.exports.resetPassword = (req, res) => {
	const { newPassword } = req.body;
	const { id } = req.user;

	bcrypt.hash(newPassword, 10)
	    .then((hashedPassword) => {
	        return User.findByIdAndUpdate(id, { password: hashedPassword });
	    })
	    .then(() => {
	        res.status(200).json({ message: 'Password reset successfully' });
	    })
	    .catch((error) => errorHandler(error, req, res));
};


module.exports.updateUserToAdmin = (req, res) => {
	const { id } = req.params;

	User.findById(id)
	.then((user) => {
	    if (!user) {
	        return res.status(404).send({ message: 'User not found' });
	    }

	    user.isAdmin = true;

	    return user.save();
	    })
	    .then((updatedUser) => {
	    	res.status(200).send({
	        updatedUser: updatedUser,
	      });
	    })
	    .catch((error) => {
	    	if (error.name === 'CastError') {
	        return res.status(400).send({
	            error: "Failed in Find",
			        details: {
			            stringValue: error.stringValue,
			            valueType: typeof error.value,
			            kind: error.kind,
			            value: error.value,
			            path: error.path,
			            reason: error.reason || {},
			            name: error.name,
			            message: error.message
	          		}
	         	});
	    	} else {
	    		errorHandler(error, req, res);
	    	}
	    });
};