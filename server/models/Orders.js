const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		restaurant_id: { type: String, ref: "User" },
		customer_id: { type: Schema.Types.ObjectId, ref: "User" },
		dishes: { type: Array, required: true },
		delivery_type: { type: String, required: true },
		customer_status: { type: String, required: true },
		restaurant_status: { type: String, required: true },
		order_instructions: { type: String },
		// List of items included
		//should have restaurant id and customer_id
	},
	// { _id: false },
	{ collection: "Orders" }
);

module.exports = mongoose.model("Orders", OrdersSchema);
