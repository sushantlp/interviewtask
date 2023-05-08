const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
// const mysql = require("mysql2");
const fs = require("fs");

const indexRouter = require("./routes/route");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Dir Resolve
const dir = path.resolve(path.join(__dirname, "uploads"));

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

// Create a connection to the MySQL database using environment variables
// const connection = mysql.createPool({
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_NAME,
// 	connectionLimit: process.env.DB_CONNECTION_LIMIT,
// });

// Connect to the database
// connection.connect((err) => {
// 	if (err) {
// 		console.error("Error connecting to database: ", err);
// 		return;
// 	}
// 	console.log("Connected to database.");
// });

app.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});

module.exports = app;
