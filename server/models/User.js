const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		name: { type: String, required: true },
		emailId: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		accessToken: { type: String, unique: true },
		role: { type: String, required: true },
		location: { type: String },
		favorites: { type: Array },
		details: {
			type: {
				services: { type: Array },
				dob: {
					type: String,
				},
				timings: {
					type: String,
				},
				profilepic: {
					type: String,
				},
				imageKey: {
					type: String,
				},
				city: {
					type: String,
				},
				state: {
					type: String,
				},
				country: {
					type: String,
				},
				nickname: {
					type: String,
				},
				contact: {
					type: String,
				},
				about: {
					type: String,
				},
			},
			require: false,
		},
	},
	// { _id: false },
	{ collection: "User" }
);

module.exports = mongoose.model("User", userSchema);
