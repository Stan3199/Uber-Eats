const Dishes = require("../models/Dishes");
const HttpError = require("../../server/models/http-error");
const User = require("../models/User.js");
const AWS = require("aws-sdk");
const Orders = require("../models/Orders");
const fs = require("fs");
const bcrypt = require("bcrypt");

const getRestaurantsforUser = async (message, callback) => {
	try {
	//	console.log(message);
		//console.log(message.headers.uid);
		let uid = message.body.uid;
		let RestForUser = await User.findOne({ _id: uid });
		let Restaurants = await User.find({
			role: "owner",
			"details.country": RestForUser.details.country,
		});
		console.log("restaurants", Restaurants);
		if (!Restaurants) throw new Error("No restarunts found");
		return callback(null, Restaurants);
	} catch (err) {
		console.log("error", err.message);
		const error = new HttpError(
			"Couldn't fetch restarnuts. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const getAllDishesConsumer = async (message, callback) => {
	const uid = message.body.uid;
	try {
		let AllDishes = await Dishes.find({});
		if (!AllDishes) throw new Error("No restarunts found");
		return callback(null, AllDishes);
	} catch (err) {
		console.log("error", err.message);
		const error = new HttpError(
			"Couldn't fetch restarnuts. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

const getMenuConsumer = async (message, callback) => {
	const rid = message.body.rid;
	try {
		let dishes = await Dishes.find({ restaurant_id: rid });
		if (!dishes) throw new Error("No restarunts found");
		return callback(null, dishes);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const getOrdersConsumer = async (message, callback) => {
	const rid = message.body.rid;
	try {
		let orders = await Orders.find({ restaurant_id: rid })
			.populate("customer_id")
			.populate({
				path: "dishes",
				populate: {
					path: "dish_id",
					model: "Dishes",
				},
			});
		if (!orders) callback("No orders found", null);
		return callback(null, orders);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const getCustomerOrdersConsumer = async (message, callback) => {
	const uid = message.body.uid;
	try {
		let orders = await Orders.find({ customer_id: uid })
			.populate("restaurant_id")
			.populate({
				path: "dishes",
				populate: {
					path: "dish_id",
					model: "Dishes",
				},
			});
		if (!orders) throw new Error("No orders found");
		return callback(null, orders);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const setNewOrderStatusConsumer = async (message, callback) => {
	const { _id, restaurant_status } = message.body;
	try {
		let orderExists = await Orders.findOne({ _id: _id });
		if (!orderExists) {
			throw new Error("No restarunts found");
		}
		orderExists.restaurant_status = restaurant_status;
		await orderExists.save();
		callback(null, 200);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const editDishConsumer = async (message, callback) => {
	const dish = message.body;
	try {
		let dishExists = await Dishes.findOne({ _id: dish._id });
		if (!dishExists) {
			throw new Error("No dish found");
		}
		Object.assign(dishExists, dish);
		console.log(dishExists);
		const s3 = new AWS.S3({
			accessKeyId: "AKIA5AIAYSS4JYC7UMMB",
			secretAccessKey: "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",
		});
		let deleteParams = {
			Bucket: "ubereatsapp",
			Key: dishExists.imageKey,
		};
		await s3.deleteObject(deleteParams, async (err, data) => {
			console.log("after deleting......", data, err);
		});
		const fileContent = fs.readFileSync(message.file.path);
		let addParams = {
			Bucket: "ubereatsapp",
			Key: "ubereats/Images/dishes/dish" + dishExists.name + ".jpg",
			Body: fileContent,
		};
		await s3.upload(addParams, async (err, data) => {
			console.log("adter deleting......", data, err);
			dishExists.images = [];
			dishExists.images.push(data.Location);
			dishExists.imageKey = data.key;
			await dishExists.save();
			return callback(null, 200);
		});
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const addDishToMenuConsumer = async (message, callback) => {
	const dish = message.body;
	try {
		let dishExists = await Dishes.findOne({ name: dish.name });
		if (dishExists) {
			throw new Error("Dish already exists with same name");
		}
		const s3 = new AWS.S3({
			accessKeyId: "AKIA5AIAYSS4JYC7UMMB",
			secretAccessKey: "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",
		});
		console.log(dish);
		const fileContent = fs.readFileSync(message.file.path);
		const params = {
			Bucket: "ubereatsapp",
			Key: "ubereats/Images/dishes/dish" + dish.name + ".jpg",
			Body: fileContent,
		};
		console.log(params);
		await s3.upload(params, async (err, data) => {
			console.log("after trying to upload...", data, err);
			if (err) throw new Error(err);
			dish.images = [];
			dish.images.push(data.Location);
			dish.imageKey = data.key;
			const newDish = new Dishes(dish);
			console.log(newDish);
			await newDish.save();
			return callback(null, 200);
		});
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const addOrderConsumer = async (message, callback) => {
	const order = message.body.order;
	try {
		let newOrder = new Orders(order);
		console.log("before", newOrder);
		let addedOrder = await newOrder.save();
		console.log("after", addedOrder);
		callback(null, addedOrder);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const updateBasicRestConsumer = async (message, callback) => {
	const basicDetails = message.body.basicDetails;
	const rid = message.headers.rid;
	try {
		let existingRest = await User.findOne({ _id: rid });
		if (!existingRest) throw new Error("No restaurant found");
		existingRest.name = basicDetails.name;
		existingRest.details.about = basicDetails.description;
		existingRest.details.timings =
			basicDetails.timeFrom + "||" + basicDetails.timeTo;
		console.log(basicDetails.timeFrom + "||" + basicDetails.timeTo);
		let savedRest = await existingRest.save();
		return callback(null, savedRest);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};
const updateContactInfoConsumer = async (message, callback) => {
	const contactDetails = message.body.contactDetails;
	const rid = message.headers.rid;
	try {
		let existingRest = await User.findOne({ _id: rid });
		if (!existingRest) throw new Error("No restaurant found");
		existingRest.details.contact = contactDetails.contact;
		existingRest.details.country = contactDetails.country;

		let savedRest = await existingRest.save();
		return callback(null, savedRest);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return callback(error, null);
	}
};

exports.getRestaurantsforUser = getRestaurantsforUser;
exports.getAllDishesConsumer = getAllDishesConsumer;
exports.getMenuConsumer = getMenuConsumer;
exports.getOrdersConsumer = getOrdersConsumer;
exports.getCustomerOrdersConsumer = getCustomerOrdersConsumer;
exports.setNewOrderStatusConsumer = setNewOrderStatusConsumer;
exports.editDishConsumer = editDishConsumer;
exports.addDishToMenuConsumer = addDishToMenuConsumer;
exports.addOrderConsumer = addOrderConsumer;
exports.updateBasicRestConsumer = updateBasicRestConsumer;
exports.updateContactInfoConsumer = updateContactInfoConsumer;
