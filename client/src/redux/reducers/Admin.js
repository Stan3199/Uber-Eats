const initialAuthState = {
	name: "",
	menu: [],
	photos: [],
	order: [],
	address: "",
	drawer: false,
};
export const adminReducer = (state = initialAuthState, action) => {
	switch (action.type) {
		case "SET__RESTAURANT__ORDERS": {
			console.log(action)
			return {
				...state,
				orders: action.value,
			};
		}
		default:
			return state;
	}
};
