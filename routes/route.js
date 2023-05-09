const express = require("express");
const path = require("path");
const multer = require("multer");
const Authentication = require("../middleware/authentication");
const { candidateSchema } = require("../validator/validation");
const { keepCandidates, getCandidate } = require("../models/candidate.model");

const router = express.Router();

// Dir Resolve
const dir = path.resolve(path.join(__dirname, "../uploads"));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			`${file.fieldname}-${uniqueSuffix}.${file.mimetype.split("/")[1]}`,
		);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 100 * 1024 * 1024,
	},
});

router.post(
	"/candidates",
	// Authentication.checkJwtToken,
	upload.single("resume"),
	async (req, res) => {
		try {
			await candidateSchema.validateAsync(req.body);
			await keepCandidates(req);
			return res.status(201).send({
				status: "Success",
				message: "Candidate created successfully",
			});
		} catch (error) {
			console.log("Error in Register API: ", error);
			return res.status(500).send({
				status: "Error",
				message: error.message,
			});
		}
	},
);

router.get(
	"/candidates/:id",
	// Authentication.checkJwtToken,
	async (req, res) => {
		try {
			const candidate = await getCandidate(req.params.id);
			return res.status(200).send(candidate);
		} catch (error) {
			console.log("Error in Register API: ", error);
			return res.status(500).send({
				status: "Error",
				message: error.message,
			});
		}
	},
);

module.exports = router;
