const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

const DishesSchema = new Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			auto: true,
		},
		name: { type: String, required: true },
		Ingredients: { type: String, required: true },
		description: { type: String, required: true },
		"dish category": { type: String, required: true },
		"dish type": { type: String, required: true },
		price: { type: Number, required: true },
		images: { type: Array },
		imageKey: { type: String },
		details: { type: {} },
		restaurant_id: { type: Schema.Types.ObjectId, ref: "User" },
		//should have restaurant id
	},
	{ collection: "Dishes" }
);

module.exports = mongoose.model("Dishes", DishesSchema);
