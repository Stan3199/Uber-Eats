require('dotenv').config()
const jwt = require("jsonwebtoken");
// const User = require("../models/User.js");
const HttpError = require("../models/http-error.js");

module.exports = async (req, res, next) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	try {
		const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error("Authentication failed!");
		}
		const decodedToken = await jwt.verify(token, process.env.ACCESS_SECRET);
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError(
			"Authentication failed! Error:" + err.message,
			403
		);
		return next(error);
	}
};
