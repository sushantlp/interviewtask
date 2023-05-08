const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = users.find(
		(u) => u.username === username && u.password === password,
	);

	if (!user) {
		return res.status(401).json({ message: "Invalid username or password." });
	}

	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

	res.json({ token });
});

module.exports = router;
