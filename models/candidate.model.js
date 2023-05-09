const dotenv = require("dotenv");
const pool = require("../config/mysql.connection.js");

// Load environment variables from .env file
dotenv.config();

module.exports.keepCandidates = async (req) => {
	try {
		const promisePool = pool.promise();

		// Query
		const query =
			"INSERT INTO `candidates` (`first_name`,`last_name`,`email`,`phone_number`,`gender`,`specialisation`,`experience`,`dob`,`address`,`resume`) VALUES (?,?,?,?,?,?,?,?,?,?)";

		// query database using promises
		const [rows, fields] = await promisePool.query(query, [
			req.body.first_name,
			req.body.last_name || null,
			req.body.email || null,
			req.body.phone_number || null,
			req.body.gender ? (req.body.gender === "Male" ? 1 : 2) : null,
			req.body.specialisation || null,
			req.body.experience || null,
			req.body.dob ? Math.floor(new Date(req.body.dob).getTime() / 1000) : null,
			req.body.address || null,
			req.file ? req.file.filename : null,
		]);
		return rows;
	} catch (error) {
		throw new Error(error);
	}
};

module.exports.getCandidate = async (id) => {
	try {
		const promisePool = pool.promise();

		// Query
		const query = `SELECT first_name, last_name, email, phone_number, gender, specialisation, experience, dob, address, CONCAT('${process.env.BASE_URL}','/uploads/', resume) AS resume, created_at, updated_at FROM candidates WHERE id = ${id}`;

		// query database using promises
		const [rows, fields] = await promisePool.query(query);
		return rows;
	} catch (error) {
		throw new Error(error);
	}
};

module.exports.getCandidates = async (limit, offset) => {
	try {
		const promisePool = pool.promise();

		// Query
		const query = `SELECT first_name, last_name, email, phone_number, gender, specialisation, experience, dob, address, CONCAT('${process.env.BASE_URL}','/uploads/', resume) AS resume, created_at, updated_at FROM candidates LIMIT ${limit} OFFSET ${offset}`;

		// query database using promises
		const [rows, fields] = await promisePool.query(query);
		return rows;
	} catch (error) {
		throw new Error(error);
	}
};
