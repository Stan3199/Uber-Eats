const initialAuthState = {
	isAuthenticated: false,
	userRole: -1,
	userName: "",
	userEmail: "",
	userId: "",
	token: "",
	fav: [],
	details: [],
	categories: ["All", "Vegeterian", "Non Vegeterian", "Vegan"],
	cuisine: ["Appetizer", "Dessert", "Main Course", "Salad", "Beverage"],
	filter: "All",
	locations: ["United States of America"],
	userFound: true,
};
export const userReducer = (state = initialAuthState, action) => {
	switch (action.type) {
		case "SET_USER": {
			return {
				...state,
				isAuthenticated: true,
				userName: action.value.name,
				token: action.value.token,
				fav: action.value.fav,
				details: action.value.details,
				userId: action.value.userId,
				userRole: action.value.role == "customer" ? 0 : 1,
				userFound: true,
			};
		}
		case "RESET_USER": {
			return { ...initialAuthState };
		}
		case "SET_FAVORITES": {
			return {
				...state,
				fav: action.value,
			};
		}
		case "SET__FILTER": {
			return {
				...state,
				filter: action.value,
			};
		}
		case "SET__USER__FOUND": {
			return {
				...state,
				userFound: false,
			};
		}
		default:
			return state;
	}
};
