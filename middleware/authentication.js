const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

module.exports.checkJwtToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).send({
			statuCode: 401,
			message: "Your JWT token is missing",
		});
	}
	const token = authHeader.split(" ")[1];
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err) => {
			if (err) {
				return res.status(401).send({
					statuCode: 401,
					message: "Your JWT token is expired",
					data: { isTokenExpired: true },
				});
			} else {
				next();
			}
		});
	} else {
		return res.status(401).send({
			statuCode: "401",
			message: "Invalid Request : Authentication Error",
		});
	}
};

module.exports.getJwtToken = async (req) => {
	const token = jwt.sign(
		{
			email: "admin@recruitcrm",
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRE_TIME },
	);

	return token;
};
