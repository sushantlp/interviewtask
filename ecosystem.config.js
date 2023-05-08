module.exports = {
	apps: [
		{
			name: "api",
			script: "npm install && npm start",
			autorestart: false,
			log_date_format: "YYYY-MM-DD HH:mm:ss SSS",
			watch: false,
		},
	],
};
