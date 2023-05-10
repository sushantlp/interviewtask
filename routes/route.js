const express = require("express");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const Authentication = require("../middleware/authentication");
const { isSecure } = require("../middleware/secure");
const { candidateSchema } = require("../validator/validation");
const {
	keepCandidates,
	getCandidate,
	getCandidates,
	getCandidatesSearch,
} = require("../models/candidate.model");

const router = express.Router();

// Load environment variables from .env file
dotenv.config();

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

router.get("/token", isSecure, async (req, res) => {
	try {
		const token = await Authentication.getJwtToken();
		return res.status(200).send(token);
	} catch (error) {
		console.log("Error in Register API: ", error);
		return res.status(500).send({
			status: "Error",
			message: error.message,
		});
	}
});

router.post(
	"/candidates",
	Authentication.checkJwtToken,
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
	"/candidates/search",
	Authentication.checkJwtToken,
	async (req, res) => {
		try {
			const page = parseInt(req.query.page, 10) || 1; // default to page 1 if not specified
			const limit = parseInt(req.query.limit, 10) || 10; // limit of 10 rows per page
			const offset = (page - 1) * limit; // calculate the offset based on the current page
			const q = req.query.q || "";

			const candidate = await getCandidatesSearch(q, limit, offset);

			const paylaod = {
				current_page: page,
				first_page_url: `${process.env.BASE_URL}/candidates/search?q=${q}&page=1&limit=${limit}`,
				next_page_url:
					candidate.length !== 0
						? `${process.env.BASE_URL}/candidates/search?q=${q}&page=${
								page + 1
						  }&limit=${limit}`
						: null,
				path: `${process.env.BASE_URL}/candidates/search`,
				per_page: candidate.length,
				prev_page_url:
					page === 1
						? null
						: `${process.env.BASE_URL}/candidates?q=${q}&page=${
								page - 1
						  }&limit=${limit}`,
				data: candidate,
			};

			return res.status(200).send(paylaod);
		} catch (error) {
			console.log("Error in Register API: ", error);
			return res.status(500).send({
				status: "Error",
				message: error.message,
			});
		}
	},
);

router.get("/candidates", Authentication.checkJwtToken, async (req, res) => {
	try {
		const page = parseInt(req.query.page, 10) || 1; // default to page 1 if not specified
		const limit = parseInt(req.query.limit, 10) || 10; // limit of 10 rows per page
		const offset = (page - 1) * limit; // calculate the offset based on the current page

		const candidate = await getCandidates(limit, offset);

		const paylaod = {
			current_page: page,
			first_page_url: `${process.env.BASE_URL}/candidates?page=1&limit=${limit}`,
			next_page_url:
				candidate.length !== 0
					? `${process.env.BASE_URL}/candidates?page=${page + 1}&limit=${limit}`
					: null,
			path: `${process.env.BASE_URL}/candidates`,
			per_page: candidate.length,
			prev_page_url:
				page === 1
					? null
					: `${process.env.BASE_URL}/candidates?page=${
							page - 1
					  }&limit=${limit}`,
			data: candidate,
		};

		return res.status(200).send(paylaod);
	} catch (error) {
		console.log("Error in Register API: ", error);
		return res.status(500).send({
			status: "Error",
			message: error.message,
		});
	}
});

router.get(
	"/candidates/:id",
	Authentication.checkJwtToken,
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
