const joi = require("joi");

module.exports.candidateSchema = joi.object({
	first_name: joi.string().min(1).max(40).required(),
	last_name: joi.string().max(40),
	email: joi.string().max(100),
	phone_number: joi.string().max(100),
	gender: joi.string().valid("Male", "Female"),
	specialisation: joi.string().max(200),
	experience: joi.string().max(30),
	dob: joi.date().raw(),
	address: joi.string().max(500),
});
