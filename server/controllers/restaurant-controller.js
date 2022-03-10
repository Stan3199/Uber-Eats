if (process.env.NODE_ENV != "prod") require("dotenv").config();
const fs = require("fs");
const { firebaseUploadFile } = require("../firebase");
const Dishes = require("../models/Dishes");
const HttpError = require("../models/http-error");
const User = require("../models/User");
const Orders = require("../models/Orders");

const getRestaurants = async (req, res, next) => {
	try {
		let uid = req.body.uid;
		let RestForUser = await User.findOne({ _id: uid });
		let Restaurants = await User.find({
			role: "owner",
			"details.country": RestForUser.details.country,
		});
		console.log("restaurants", Restaurants);
		if (!Restaurants) throw new Error("No restarunts found");
		return res.send(Restaurants);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch restarnuts. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const getAllDishes = async (req, res, next) => {
	try {
		let AllDishes = await Dishes.find({});
		if (!AllDishes) throw new Error("No restarunts found");
		return res.send(AllDishes);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch restarnuts. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const getMenu = async (req, res, next) => {
	try {
		const rid = req.body.rid;
		let dishes = await Dishes.find({ restaurant_id: rid });
		if (!dishes) throw new Error("No restarunts found");
		return res.send(dishes);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch menu. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const getOrders = async (req, res, next) => {
	try {
		const rid = req.body.rid;
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
		return res.send(orders);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch orders. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const getCustomerOrders = async (req, res, next) => {
	try {
		const uid = req.body.uid;
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
		return res.send(orders);
	} catch (err) {
		const error = new HttpError(
			"Couldn't fetch orders. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const setNewOrderStatus = async (req, res, next) => {
	try {
		const { _id, restaurant_status } = req.body;
		let orderExists = await Orders.findOne({ _id: _id });
		if (!orderExists) {
			throw new Error("No restarunts found");
		}
		orderExists.restaurant_status = restaurant_status;
		await orderExists.save();
		res.send(200);
	} catch (err) {
		const error = new HttpError(
			"Couldn't set order state. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const editDish = async (req, res, next) => {
	try {
		const dish = req.body;
		console.log("dish>>>", dish);
		let dishExists = await Dishes.findOne({ _id: dish._id });
		if (!dishExists) {
			throw new Error("No dish found");
		}
		Object.assign(dishExists, dish);
		console.log(req.file);
		req.file?.path &&
			(await firebaseUploadFile(
				req.file.path,
				"Dishes/" + dish.restaurant_id + dish.name,
				async (file) => {
					dishExists.images = [];
					dishExists.images.push(file[0].metadata.mediaLink);
					dishExists.imageKey = file[0].metadata.id;
				}
			));
		await dishExists.save();
		return res.send(200);
	} catch (err) {
		const error = new HttpError(
			"Couldn't set order state. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const addDishToMenu = async (req, res, next) => {
	try {
		const dish = req.body;
		let dishExists = await Dishes.findOne({ name: dish.name });
		if (dishExists) {
			throw new Error("Dish already exists with same name");
		}
		firebaseUploadFile(
			req.file.path,
			"Dishes/" + dish.restaurant_id + dish.name,
			async (file) => {
				console.log("inside controler.>>>>>>>>>>>>", file);
				dish.images = [];
				dish.images.push(file[0].metadata.mediaLink);
				dish.imageKey = file[0].metadata.id;
				const newDish = new Dishes(dish);
				await newDish.save();
				return res.send(200);
			}
		);
	} catch (err) {
		const error = new HttpError(
			"Couldn't set order state. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const addOrder = async (req, res, next) => {
	const order = req.body.order;
	try {
		let newOrder = new Orders(order);
		console.log("before", newOrder);
		let addedOrder = await newOrder.save();
		console.log("after", addedOrder);
		res.send(addedOrder);
	} catch (err) {
		const error = new HttpError(
			"Couldn't add order. Please try again Error: " + err.message,
			500
		);
		return next(error);
	}
};

const updateBasicRest = async (req, res, next) => {
	console.log(req.body.basicDetails, req.headers.rid);
	console.log(
		req.body.basicDetails.timeFrom + "||" + req.body.basicDetails.timeTo
	);
	try {
		const basicDetails = req.body.basicDetails;
		const rid = req.headers.rid;
		let existingRest = await User.findOne({ _id: rid });
		if (!existingRest) throw new Error("No restaurant found");
		existingRest.name = basicDetails.name;
		existingRest.details.about = basicDetails.description;
		existingRest.details.timings =
			basicDetails.timeFrom + "||" + basicDetails.timeTo;
		console.log(basicDetails.timeFrom + "||" + basicDetails.timeTo);
		let savedRest = await existingRest.save();
		return res.send(savedRest);
	} catch (err) {
		const error = new HttpError(
			"Couldn't change basic details. Please try again Error: " +
				err.message,
			500
		);
		return next(error);
	}
};

const updateContactInfo = async (req, res, next) => {
	try {
		const contactDetails = req.body.contactDetails;
		const rid = req.headers.rid;
		let existingRest = await User.findOne({ _id: rid });
		if (!existingRest) throw new Error("No restaurant found");
		existingRest.details.contact = contactDetails.contact;
		existingRest.details.country = contactDetails.country;
		existingRest.details.deliveryFee = contactDetails.deliveryFee;
		console.log("change user..>>>>.", existingRest);
		let savedRest = await existingRest.save();
		return res.send(savedRest);
	} catch (err) {
		const error = new HttpError(
			"Couldn't change contact details. Please try again Error: " +
				err.message,
			500
		);
		return next(error);
	}
};

exports.getRestaurant = getRestaurants;
exports.getAllDishes = getAllDishes;
exports.getMenu = getMenu;
exports.getOrders = getOrders;
exports.setNewOrderStatus = setNewOrderStatus;
exports.editDish = editDish;
exports.addDishToMenu = addDishToMenu;
exports.addOrder = addOrder;
exports.getCustomerOrders = getCustomerOrders;
exports.updateBasicRest = updateBasicRest;
exports.updateContactInfo = updateContactInfo;
