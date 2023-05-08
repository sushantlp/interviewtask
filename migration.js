const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { exit } = require("process");

// Load environment variables from .env file
dotenv.config();

const pool = mysql.createPool({
	connectionLimit: 1,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

pool.getConnection(function (error, connection) {
	if (error) throw error;

	const fileName = process.argv[2] ? process.argv[2] : "migration_v1.sql";

	const migrationData = fs
		.readFileSync(path.join(__dirname, `./migrations/${fileName}`))
		.toString();

	// Do something with the connection
	connection.query(migrationData, (err, result) => {
		if (err) throw err;

		console.log("Query run successfully");

		// Don't forget to release the connection when finished!
		pool.releaseConnection(connection);
		exit();
	});
});
