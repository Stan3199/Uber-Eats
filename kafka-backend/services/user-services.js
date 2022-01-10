require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk");
const fs = require("fs");
const HttpError = require("../../server/models/http-error");
const jwt = require("jsonwebtoken");

const userLoginConsumer = async (message, callback) => {
	let userAuthenticated = await User.findOne({ emailId: message.body.email });
	console.log("user found..>>>>>>>", userAuthenticated);
	if (userAuthenticated) {
		var token;
		try {
			token = jwt.sign(
				{
					userid: userAuthenticated.id,
					email: userAuthenticated.email,
				},
				process.env.ACCESS_SECRET,
				{ expiresIn: "12h" }
			);
			callback(null, {
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
				"Logging in failed, please try again. Error: " + err.message,
				500
			);
			return callback(error, null);
		}
	}
};
const signUpConsumer = async (message, callback) => {
	var { name, emailId, password, role, location } = message.body;

	try {
		if (!name || !emailId || !password || !role) {
			const error = new HttpError("Data Missing, please try again.", 500);
			return callback(error, null);
		}
		var existingUser = await User.findOne({ emailId: emailId });
		console.log(existingUser);
		if (existingUser) {
			const error = new HttpError(
				"User exists aready, please login instead.",
				500
			);
			return callback(error, null);
		}
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);
		const newUser = new User({
			emailId,
			password,
			name,
			role,
			details: {
				dob: "",
				profilepic: "",
				city: "",
				state: "",
				country: "",
				nickname: "",
				contact: location != "" ? location : "US",
				About: "",
			},
		});
		var createdUser = await newUser.save();
		console.log(createdUser);
		var token = jwt.sign(
			{ email: emailId, userId: createdUser._id },
			process.env.ACCESS_SECRET,
			{ expiresIn: "12h" }
		);
		return callback(null, {
			userId: createdUser.id,
			email: createdUser.emailId,
			token,
			details: createdUser.details,
			fav: createdUser.favorites,
			role: createdUser.role,
		});
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again. Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

const setRestarauntFavConsumer = async (message, callback) => {
	const rid = message.headers.rid;
	const uid = message.headers.uid;
	try {
		let user = await User.findOne({ _id: uid });
		if (!user.favorites.includes(rid))
			user.favorites = [...user.favorites, rid];
		else user.favorites = user.favorites.filter((restId) => restId != rid);
		await user.save();
		return callback(null, user);
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again. Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

const updateCountryConsumer = async (message, callback) => {
	const { location, uid } = message.body;

	try {
		var UserExists = await User.findOne({ _id: uid });
		if (!UserExists) throw Error("No user exists");
		UserExists.details.country = location;
		await UserExists.save();
		return callback(null, 200);
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again. Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

const updateCustomerDataConsumer = async (message, callback) => {
	const customerData = message.body.customerData;
	const uid = customerData.userId;
	try {
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
		return callback(null, {
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
			"Logging in failed, please try again. Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

const getUserConsumer = async (message, callback) => {
	const uid = message.body.uid;
	const token = message.headers.authorization.split(" ")[1];
	try {
		var UserExists = await User.findOne({ _id: uid });
		if (!UserExists) throw Error("No user exists");
		return callback(null, {
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
			"Logging in failed, please try again. Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

const editProfilePhotoConsumer = async (message, callback) => {
	const userData = message.body;

	try {
		let existingUser = await User.findOne({ _id: userData._id });
		if (!existingUser) throw new Error("No user found");
		const s3 = new AWS.S3({
			accessKeyId: "AKIA5AIAYSS4JYC7UMMB",
			secretAccessKey: "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",
		});

		const fileContent = fs.readFileSync(message.file.path);
		if (userData.imageKey != "undefined" && userData.imageKey != "") {
			console.log("<<<<<<...........previous pic exists....>>>>");
			let deleteParams = {
				Bucket: "ubereatsapp",
				Key: userData.imageKey,
			};
			await s3.deleteObject(deleteParams, async (err, data) => {
				console.log("after deleting......", data, err);
			});
		}
		let addParams = {
			Bucket: "ubereatsapp",
			Key: "ubereats/Images/User/user" + existingUser?.name + ".jpg",
			Body: fileContent,
		};
		await s3.upload(addParams, async (err, data) => {
			console.log("adter uploadingg......", data, err);
			existingUser.details.profilepic = data.Location;
			existingUser.details.imageKey = data.key;
			await existingUser.save();
			return callback(null, existingUser);
		});
	} catch (err) {
		const error = new HttpError(
			"Logging in failed, please try again. Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

exports.userLoginConsumer = userLoginConsumer;
exports.updateCustomerDataConsumer = updateCustomerDataConsumer;
exports.signUpConsumer = signUpConsumer;
exports.setRestarauntFavConsumer = setRestarauntFavConsumer;
exports.updateCountryConsumer = updateCountryConsumer;
exports.getUserConsumer = getUserConsumer;
exports.editProfilePhotoConsumer = editProfilePhotoConsumer;
