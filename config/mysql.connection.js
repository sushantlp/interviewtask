const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: process.env.DB_CONNECTION_LIMIT,
	maxIdle: process.env.DB_CONNECTION_LIMIT, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
});

module.exports = pool;
