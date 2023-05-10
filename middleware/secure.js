module.exports.isSecure = async (req, res, next) => {
	if (req.protocol === "https") {
		next();
	} else {
		return res.status(505).send({
			message: "Accept only secure request",
		});
	}
};
