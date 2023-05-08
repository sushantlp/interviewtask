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
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(401).send({
					statuCode: 401,
					message: "Your JWT token is expired",
					data: { isTokenExpired: true },
				});
			} else {
				req.user = user;
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
			email: req.email,
			userRole: req.userRole,
			mobile: req.mobile,
			userId: req._id,
		},
		process.env.JWT_TOKEN_SECRET_KEY,
		{ expiresIn: process.env.JWT_EXPIRE_TIME },
	);
	const Obj = {
		token: token,
		userId: req._id,
	};
	return token;
};
