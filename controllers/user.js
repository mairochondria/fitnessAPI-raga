module.exports.registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, mobileNo, password, isAdmin } = req.body;
		
		// Validations
		if (mobileNo.length !== 11) return res.status(400).send({ error: "Mobile number is invalid" });
		if (!email.includes("@")) return res.status(400).send({ error: "Email invalid" });
		if (password.length < 8) return res.status(400).send({ error: "Password must be at least 8 characters long" });

		// Create new user
		const hashedPassword = bcrypt.hashSync(password, 10);
		const newUser = new User({ firstName, lastName, email, mobileNo, password: hashedPassword, isAdmin });

		await newUser.save();
		return res.status(201).send({ message: "Registered successfully" });
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email.includes("@")) return res.status(400).send({ error: "Invalid email" });

		const user = await User.findOne({ email });
		if (!user) return res.status(404).send({ error: "No email found" });

		const isPasswordCorrect = bcrypt.compareSync(password, user.password);
		if (!isPasswordCorrect) return res.status(401).send({ error: "Email and password do not match" });

		const accessToken = auth.createAccessToken(user);
		return res.status(200).send({ access: accessToken });
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).send({ error: "User not found" });

		user.password = undefined; // Remove password from response
		return res.status(200).send({ user: user });
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.resetPassword = async (req, res) => {
	try {
		const { newPassword } = req.body;
		const { id } = req.user;

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await User.findByIdAndUpdate(id, { password: hashedPassword });

		return res.status(200).json({ message: 'Password reset successfully' });
	} catch (error) {
		return errorHandler(error, req, res);
	}
};

module.exports.updateUserToAdmin = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id);
		if (!user) return res.status(404).send({ message: 'User not found' });

		user.isAdmin = true;
		const updatedUser = await user.save();

		return res.status(200).send({ updatedUser: updatedUser });
	} catch (error) {
		return errorHandler(error, req, res);
	}
};