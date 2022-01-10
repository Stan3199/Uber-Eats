const mongoose = require("mongoose");
// const options = {
//  maxpoolSize: 100
// };
mongoose.Promise = global.Promise;
//"mongodb://localhost:27017/HomeAway",
// "mongodb://sojanmathew:sojanm28@ds133920.mlab.com:33920/homeaway",
mongoose
 .connect(
   "mongodb+srv://Ubereats:CMPE273lab2@cluster0.akluu.mongodb.net/Ubereats?retryWrites=true&w=majority",

 )
 .then(console.log("mlabs connected"));

module.exports = mongoose;