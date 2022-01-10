const handleTopicRequest = require("./kafka/handle-request");
const {
	getRestaurantsforUser,
	getMenuConsumer,
	getOrdersConsumer,
	getCustomerOrdersConsumer,
	setNewOrderStatusConsumer,
	editDishConsumer,
	addDishToMenuConsumer,
	addOrderConsumer,
	updateBasicRestConsumer,
	updateContactInfoConsumer,
	getAllDishesConsumer,
} = require("./services/restaurant-services");
const {
	userLoginConsumer,
	signUpConsumer,
	setRestarauntFavConsumer,
	updateCountryConsumer,
	getUserConsumer,
	editProfilePhotoConsumer,
	updateCustomerDataConsumer,
} = require("./services/user-services");
handleTopicRequest("userLoginConsumer", userLoginConsumer);
handleTopicRequest("signUpConsumer", signUpConsumer);
handleTopicRequest("setRestarauntFavConsumer", setRestarauntFavConsumer);
handleTopicRequest("updateCountryConsumer", updateCountryConsumer);
handleTopicRequest("updateCustomerDataConsumer", updateCustomerDataConsumer);
handleTopicRequest("getUserConsumer", getUserConsumer);
handleTopicRequest("editProfilePhotoConsumer", editProfilePhotoConsumer);

handleTopicRequest("getRestaurantsForOwner", getRestaurantsforUser);
handleTopicRequest("getAllDishesConsumer", getAllDishesConsumer);
handleTopicRequest("getMenuConsumer", getMenuConsumer);
handleTopicRequest("getOrdersConsumer", getOrdersConsumer);
handleTopicRequest("getCustomerOrdersConsumer", getCustomerOrdersConsumer);
handleTopicRequest("setNewOrderStatusConsumer", setNewOrderStatusConsumer);
handleTopicRequest("editDishConsumer", editDishConsumer);
handleTopicRequest("addDishToMenuConsumer", addDishToMenuConsumer);
handleTopicRequest("addOrderConsumer", addOrderConsumer);
handleTopicRequest("updateBasicRestConsumer", updateBasicRestConsumer);
handleTopicRequest("updateContactInfoConsumer", updateContactInfoConsumer);
