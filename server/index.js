if (process.env.NODE_ENV != "prod") require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrpt = require("bcrypt");
const User = require("./models/User");
const HttpError = require("./models/http-error");
const flash = require("express-flash");
const session = require("express-session");
const override = require("method-override");
const userRoutes = require("./routes/user-routes.js");
const restaurantRoutes = require("./routes/restaurant-routes.js");
const path = require("path");
const passport = require("passport");
const initializePassport = require("./passport-config.js");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,content-type,authorization,rid,uid"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

initializePassport(
  passport,
  async (emailId) => {
    console.log(emailId);
    const user = await User.findOne({ emailId });
    console.log(user)
    return user;
  },
  (id) => {
    return User.find({ id });
  }
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(override("_method"));

app.delete("/logout", (req, res) => {
  req.logOut();
  req.redirect("/login");
});

app.use("/user", userRoutes);
app.use("/restaurant", restaurantRoutes);

const Connection_URL =
  "mongodb+srv://FoodUser:Hungry@cluster0.r0vpr.mongodb.net/UberEats?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;


if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

mongoose
  .connect(Connection_URL)
  .then(() => {
    console.log("mongoose estabilished");
    // app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => console.log(err));

  module.exports = app;
