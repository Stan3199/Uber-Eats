const userController = require("../controllers/user-controller.js");
const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth.js");
const router = express.Router();
const methodOverride = require("method-override");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const fileUpload = require("../middleware/file-upload.js");
router.post(
	"/login",
	//  [
	// 	check("email").normalizeEmail().isEmail(),
	// 	check("password").isLength({ min: 6 }),
	// ],
	async (req, res, next) =>
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				console.log(err);
				throw err;
			}
			console.log("routess...." + user);
			if (!user) res.send("No user exists");
			else {
				req.logIn(user, (err) => {
					if (err) throw err;
					return next();
				});
			}
		})(req, res, next),
	userController.login
);
router.post("/signUp", userController.signup);
router.use(checkAuth);
router.post("/setRestarauntFav", userController.setRestarauntFav);
router.post("/updateCustomerData", userController.updateCustomerData);
router.post(
	"/editProfilePhoto",
	fileUpload.single("image"),
	userController.editProfilePhoto
);
router.use(methodOverride("_method"));

router.delete("/logout", (req, res, next) => {
	req.logOut();
	return res.send(200);
});

router.post("/getUser", userController.getUser);

router.post("/updateCountry", userController.updateCountry);

module.exports = router;
