import Axios from "axios";
var localAddress = "http://localhost:5000/";

export const SetAdminDrawer = (value) => async (dispatch) => {
	try {
		await dispatch({ type: "SET_DRAWER", value: value });
	} catch (err) {
		console.log(err);
		return err;
	}
};
export const updateBasicDetailsRest =
	(binf, rid, token) => async (dispatch) => {
		try {
			var instance = Axios.create();
			instance.defaults.headers.common = {};
			await instance
				.post(
					localAddress + "restaurant/updateBasicInfo",
					{
						basicDetails: binf,
					},
					{ headers: { authorization: "Bearer " + token, rid } }
				)
				.then((res) => console.log(res));
		} catch (err) {
			console.log(err);
			return false;
		}
	};

export const updateContactDetailsRest =
	(cinf, rid, token) => async (dispatch) => {
		try {
			var instance = Axios.create();
			instance.defaults.headers.common = {};

			instance
				.post(
					localAddress + "restaurant/updateContactInfo",
					{
						contactDetails: cinf,
					},
					{
						headers: {
							authorization: "Bearer " + token,
							rid,
						},
					}
				)
				.then((res) => {
					console.log(res);
					return true;
				});

			// await Axios({
			// 	method: "POST",
			// 	withCredentials: true,
			// 	headers: {
			// 		authorization: "Bearer " + token,
			// 		rid,
			// 	},
			// 	data: {
			// 		contactDetails: cinf,
			// 	},
			// 	url: localAddress + "restaurant/updateContactInfo",
			// }).then((res) => {
			// 	console.log(res);
			// 	return true;
			// });
		} catch (err) {
			console.log(err);
			return false;
		}
	};
