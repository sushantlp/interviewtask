const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const pool = require("./config/mysql.connection.js");

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
