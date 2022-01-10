const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    name: { type: String, required: true },
    dob: { type: String, required: true },
    nickname : { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country : { type: String, required: true },
    profilepic: { type: String, required: true },
    emailid: { type: String, required: true },
    contact: { type: String, required: true },
    about : { type: String, required: true },
    images: { type: Array },
    favourites: { type: {} },
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    // should have user_id
  },
  { _id: false },
  { collection: "Customer" }
);

const createModel = function () {
  return mongoose.model("Customer", CustomerSchema);
};

module.exports.createModel = createModel;
