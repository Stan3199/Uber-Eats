const {
	getRestaurant,
	getMenu,
	getOrders,
	setNewOrderStatus,
	editDish,
	addDishToMenu,
	addOrder,
	updateBasicRest,
	updateContactInfo,
	getCustomerOrders,
	getAllDishes,
} = require("../controllers/restaurant-controller.js");
const checkAuth = require("../middleware/check-auth.js");
const fileUpload = require("../middleware/file-upload.js");
const router = require("express").Router();

// router.use(checkAuth);
router.post("/getRestaurants", getRestaurant);
router.post("/getAllDishes", getAllDishes);
router.post("/getMenu", getMenu);
router.post("/getOrders", getOrders);
router.post("/getCustomerOrders", getCustomerOrders);
router.post("/newOrderStatus", setNewOrderStatus);
router.post("/editDish", fileUpload.single("image"), editDish);
router.post("/addDish", fileUpload.single("image"), addDishToMenu);
router.post("/addOrder", addOrder);
router.post("/updateBasicInfo", updateBasicRest);
router.post("/updateContactInfo", updateContactInfo);

module.exports = router;
