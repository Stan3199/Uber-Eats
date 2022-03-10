import Axios from "axios";
var localAddress = "http://localhost:5000/";

export const addItemTocart = (item) => async (dispatch) => {
	try {
		await dispatch({ type: "ADD_ITEM", value: item });
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const RemoveItemFromcart = (item) => async (dispatch) => {
	try {
		await dispatch({ type: "REMOVE_ITEM", value: item });
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const SetDrawer = (value) => async (dispatch) => {
	try {
		await dispatch({ type: "SET_DRAWER", value: value });
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const setNavBarCheckout = (value) => async (dispatch) => {
	try {
		await dispatch({ type: "SET_CHECKOUT", value });
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const setUserCountry = (value) => async (dispatch) => {
	try {
		await dispatch({ type: "SET_COUNTRY", value });
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const addAddress = (value) => async (dispatch) => {
	try {
		await dispatch({ type: "ADD_ADDRESS", value });
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const deleteAddress = (value) => async (dispatch) => {
	try {
		await dispatch({ type: "DELETE_ADDRESS", value });
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const selectAddress = (value) => async (dispatch) => {
	console.log("selecting address");
	try {
		await dispatch({ type: "SELECT_ADDRESS", value });
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const setRestaurant = (restaurant) => async (dispatch) => {
	try {
		await dispatch({
			type: "SET__RESTAURANT",
			value: restaurant,
		});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const clearCart = () => async (dispatch) => {
	try {
		await dispatch({ type: "CLEAR__CART" });
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const updateCustomerData =
	(uid, userData, token) => async (dispatch) => {
		try {
			var instance = Axios.create();
			instance.defaults.headers.common = {};
			await instance
				.post(
					localAddress + "user/updateCustomerData",
					{ customerData: userData },
					{
						headers: { authorization: "Bearer " + token, uid: uid },
					}
				)
				.then((res) => dispatch({ type: "SET_USER", value: res.data }));
		} catch (err) {
			console.log(err);
			return false;
		}
	};

export const updateCountry = (uid, token, location) => async (dispatch) => {
	try {
		console.log(uid, token, location);
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance
			.post(
				localAddress + "user/updateCountry",
				{
					location,
					uid,
				},
				{ headers: { authorization: "Bearer " + token } }
			)
			.then((res) => {
				console.log(res);
				dispatch({ type: "SET_MENU", value: res.data });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const getMenu = (rid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance
			.post(
				localAddress + "restaurant/getMenu",
				{ rid: rid },
				{
					headers: { authorization: "Bearer " + token, rid: rid },
				}
			)
			.then((res) => dispatch({ type: "SET_MENU", value: res.data }));
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const addDishToMenu = (formData, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance
			.post(localAddress + "restaurant/addDish", formData, {
				headers: { authorization: "Bearer " + token },
			})
			.then((res) => {
				console.log(res);
				return true;
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const editDishToMenu = (formData, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance
			.post(localAddress + "restaurant/editDish", formData, {
				headers: { authorization: "Bearer " + token },
			})
			.then((res) => {
				console.log(res);
				return true;
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const setUserFav = (rid, uid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "user/setRestarauntFav",
				{},
				{
					headers: {
						authorization: "Bearer " + token,
						rid,
						uid,
					},
				}
			)
			.then((res) => {
				console.log(res);
				dispatch({ type: "SET_FAVORITES", value: res.data.favorites });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const orderAcceptStatus = (_id, status, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance
			.post(
				localAddress + "restaurant/newOrderStatus",
				{
					_id,
					restaurant_status: status,
				},
				{ headers: { authorization: "Bearer " + token } }
			)
			.then((res) => {
				console.log(res);
				return true;
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const addOrder = (order, token) => async (dispatch) => {
	try {
		console.log(order);
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance.post(
			localAddress + "restaurant/addOrder",
			{ order },
			{ headers: { authorization: "Bearer " + token } }
		);
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const getUserOrders = (uid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "restaurant/getCustomerOrders",
				{ uid: uid },
				{
					headers: { authorization: "Bearer " + token, uid },
				}
			)
			.then((res) => {
				console.log(res);
				dispatch({ type: "SET__USER__ORDERS", value: res.data });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const setServiceMode = (value) => async (dispatch) => {
	try {
		dispatch({ type: "SET__SERVICE__MODE", value });
		return true;
	} catch (err) {
		console.log(false);
		return false;
	}
};
