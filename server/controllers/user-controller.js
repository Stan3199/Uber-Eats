require("dotenv").config();
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const fs = require("fs");
const User = require("../models/User");
const {
	firebaseUploadFile,
	firebaseDeleteFromFileName,
} = require("../firebase");

const login = async (req, res, next) => {
	console.log("node logging..", req.body.email.toLowerCase());
	try {
		let userAuthenticated = await User.findOne({
			emailId: req.body.email.toLowerCase(),
		});
		var token = jwt.sign(
			{
				userid: userAuthenticated.id,
				email: userAuthenticated.email,
			},
			process.env.ACCESS_SECRET,
			{ expiresIn: "12h" }
		);
		res.send({
			userId: userAuthenticated.id,
			name: userAuthenticated.name,
			email: userAuthenticated.email,
			token,
			details: userAuthenticated.details,
			fav: userAuthenticated.favorites,
			role: userAuthenticated.role,
		});
	} catch (err) {
		const error = new HttpError(
			"Error while logging user, please try again. Error: " + err.message,
			500
		);
		return next(error);
	}
};

const signUp = async (req, res, next) => {
	try {
		var { name, emailId, password, role, location } = req.body;
		if (!name || !emailId || !password || !role) {
			const error = new HttpError("Data Missing, please try again.", 500);
			return next(error);
		}
		var existingUser = await User.findOne({
			emailId: emailId.toLowerCase(),
		});
		console.log(existingUser);
		if (existingUser) {
			const error = new HttpError(
				"User exists aready, please login instead.",
				500
			);
			return next(error);
		}
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);
		const newUser = new User({
			emailId: emailId.toLowerCase(),
			password,
			name,
			role,
			details: {
				services: role == "owner" ? ["Delivery"] : [],
				dob: "",
				profilepic: "",
				city: "",
				state: "",
				country: "United States of America",
				nickname: "",
				contact: "",
				About: "",
				rating: 4.2,
				deliveryFee:12
			},
		});
		var createdUser = await newUser.save();
		console.log(createdUser);
		var token = jwt.sign(
			{ email: emailId, userId: createdUser._id },
			process.env.ACCESS_SECRET,
			{ expiresIn: "12h" }
		);
		return res.send({
			userId: createdUser.id,
			email: createdUser.emailId,
			token,
			details: createdUser.details,
			fav: createdUser.favorites,
			role: createdUser.role,
		});
	} catch (err) {
		const error = new HttpError(
			"Error while creating user, please try again. Error: " +
				err.message,
			500
		);
		return next(error);
	}
};

const setRestarauntFav = async (req, res, next) => {
	try {
		const rid = req.headers.rid;
		const uid = req.headers.uid;
		let user = await User.findOne({ _id: uid });
		if (!user.favorites.includes(rid))
			user.favorites = [...user.favorites, rid];
		else user.favorites = user.favorites.filter((restId) => restId != rid);
		await user.save();
		return res.send(user);
	} catch (err) {
		const error = new HttpError(
			"Error while saving favorite, please try again. Error: " +
				err.message,
			500
		);
		return next(error);
	}
};

const updateCountry = async (req, res, next) => {
	try {
		const { location, uid } = req.body;
		var UserExists = await User.findOne({ _id: uid });
		if (!UserExists) throw Error("No user exists");
		UserExists.details.country = location;
		await UserExists.save();
		return res.send(200);
	} catch (err) {
		const error = new HttpError(
			"Error while saving favorite, please try again. Error: " +
				err.message,
			500
		);
		return next(error);
	}
};

const updateCustomerData = async (req, res, next) => {
	try {
		const customerData = req.body.customerData;
		const uid = customerData.userId;

		let userExists = await User.findOne({ _id: uid });
		console.log("userexist before", userExists, uid);

		if (!userExists) throw Error("No user Exists");
		userExists.userName = customerData.userName;
		userExists.details.dob = customerData.details.dob;
		userExists.details.city = customerData.details.city;
		userExists.details.state = customerData.details.state;
		userExists.details.country = customerData.details.country;
		userExists.details.nickname = customerData.details.nickname;
		await userExists.save();
		console.log("userexist", userExists);
		return res.send({
			userId: userExists.id,
			name: userExists.name,
			email: userExists.email,
			token: "",
			details: userExists.details,
			fav: userExists.favorites,
			role: userExists.role,
		});
	} catch (err) {
		const error = new HttpError(
			"Error while saving favorite, please try again. Error: " +
				err.message,
			500
		);
		return next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const uid = req.body.uid;
		const token = req.headers.authorization.split(" ")[1];
		var UserExists = await User.findOne({ _id: uid });
		if (!UserExists) throw Error("No user exists");
		return res.send({
			userId: UserExists.id,
			name: UserExists.name,
			email: UserExists.email,
			token,
			details: UserExists.details,
			fav: UserExists.favorites,
			role: UserExists.role,
		});
	} catch (err) {
		const error = new HttpError(
			"Error while getting user, please try again. Error: " + err.message,
			500
		);
		return next(error);
	}
};

const editProfilePhoto = async (req, res, next) => {
	try {
		const userData = req.body;

		let existingUser = await User.findOne({ _id: userData._id });
		if (!existingUser) throw new Error("No user found");
		if (userData.imageKey != "undefined" && userData.imageKey != "") {
			await firebaseDeleteFromFileName("Restaurant/" + existingUser.id);
		}
		firebaseUploadFile(
			req.file.path,
			"Restaurant/" + existingUser.id,
			async (file) => {
				existingUser.details.profilepic = file[0].metadata.mediaLink;
				existingUser.details.imageKey = file[0].metadata.id;
				console.log("existing user....>>>", existingUser);
				await existingUser.save();
				return res.send(existingUser);
			}
		);
	} catch (err) {
		const error = new HttpError(
			"Error while getting user, please try again. Error: " + err.message,
			500
		);
		return next(error);
	}
};

exports.editProfilePhoto = editProfilePhoto;
exports.updateCustomerData = updateCustomerData;
exports.setRestarauntFav = setRestarauntFav;
exports.login = login;
exports.signup = signUp;
exports.updateCountry = updateCountry;
exports.getUser = getUser;
