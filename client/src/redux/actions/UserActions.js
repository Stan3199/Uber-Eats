import Axios from "axios";
var localAddress = "http://localhost:5000/";

export const loginUser = (ususerEmail, userPassworder) => async (dispatch) => {
	try {
		console.log("loggingin....");
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance
			.post(
				localAddress + "user/login",
				{
					email: ususerEmail,
					password: userPassworder,
				},
				{
					"Content-Type": "application/json",
				}
			)
			.then((res) => dispatch({ type: "SET_USER", value: res.data }));
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const getUser = (uid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "user/getUser",
				{ uid: uid },
				{
					headers: { authorization: "Bearer " + token, uid },
				}
			)
			.then((res) => {
				dispatch({ type: "SET_USER", value: res.data });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const logOutUser = (token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "user/logout?_method=DELETE",
				{},
				{ headers: { authorization: "Bearer " + token } }
			)
			.then((res) => {
				dispatch({ type: "RESET_USER" });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};
export const registerUser =
	(name, emailId, password, role, location) => async (dispatch) => {
		try {
			var instance = Axios.create();
			instance.defaults.headers.common = {};
			instance
				.post(localAddress + "user/signUp ", {
					emailId,
					password,
					name,
					role,
					location,
				})
				.then((res) => {
					console.log(res);
					dispatch({ type: "SET_USER", value: res.data });
				});
		} catch (err) {
			console.log(err);
			return false;
		}
	};

export const getRestarunts = (uid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "restaurant/getRestaurants",
				{ uid: uid },
				{
					headers: { authorization: "Bearer " + token, uid },
				}
			)
			.then((res) => {
				console.log(res);
				dispatch({ type: "SET__All__RESTAURANTS", value: res.data });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const getAllDishes = (uid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "restaurant/getAllDishes",
				{ uid: uid },
				{
					headers: { authorization: "Bearer " + token, uid },
				}
			)
			.then((res) => {
				console.log(res);
				dispatch({ type: "SET_RESTAURANTS_DISHES", value: res.data });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const resetUser = () => async (dispatch) => {
	try {
		dispatch({ type: "RESET_USER" });
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const getRestaurantOrders = (rid, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		instance
			.post(
				localAddress + "restaurant/getOrders",
				{ rid: rid },
				{
					headers: { authorization: "Bearer " + token, rid },
				}
			)
			.then((res) => {
				console.log(res);
				dispatch({ type: "SET__RESTAURANT__ORDERS", value: res.data });
			});
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const setFilter = (filter) => async (dispatch) => {
	try {
		dispatch({ type: "SET__FILTER", value: filter });
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const updateUserPhoto = (formData, token) => async (dispatch) => {
	try {
		var instance = Axios.create();
		instance.defaults.headers.common = {};
		await instance.post(localAddress + "user/editProfilePhoto", formData, {
			headers: { authorization: "Bearer " + token },
		});
	} catch (err) {
		console.log(err);
		return false;
	}
};
