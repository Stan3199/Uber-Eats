const initialAuthState = {
	isAuthenticated: false,
	restaurants: [],
	currRestaurant: "",
	allDishes: [],
	menu: [],
	checkout: false,
	drawer: false,
	country: "CountryA",
	deliveryType: "delivery",
	currentDelivery: "",
	addresses: [],
	cart: {},
	orders: [],
	serviceMode: "Delivery",
	categorySelected:"All"
};
export const customerReducer = (state = initialAuthState, action) => {
	console.log(action);
	switch (action.type) {
		case "ADD_ITEM": {
			const newCart = Object.assign(state.cart);
			if (Object.keys(newCart).length == 0) {
				return {
					...state,
					cart: {
						restaurantName: action.value.restaurantName,
						items: [
							{
								name: action.value.item.name,
								quantity: action.value.item.quantity,
								price: action.value.item.price,
								id: action.value.item.id,
							},
						],
					},
				};
			}
			const existingItem = newCart.items.find(
				(item) => item.name == action.value.item.name
			);
			if (existingItem) {
				existingItem.quantity = action.value.item.quantity;
				return {
					...state,
					cart: newCart,
				};
			}
			newCart.items.push({
				name: action.value.item.name,
				quantity: action.value.item.quantity,
				price: action.value.item.price,
				id: action.value.item.id,
			});
			return {
				...state,
				cart: newCart,
			};
		}
		case "REMOVE_ITEM": {
			let newCart = Object.assign(state.cart);
			if (Object.keys(newCart).length == 0 || newCart.items.length == 0)
				return { ...state };
			newCart.items = newCart?.items.filter((item) => item.quantity != 0);
			if (newCart.items?.length == 0) newCart = {};
			return {
				...state,
				cart: newCart,
			};
		}
		case "SET__All__RESTAURANTS": {
			return {
				...state,
				restaurants: action.value,
			};
		}
		case "SET_DRAWER":
			return {
				...state,
				drawer: action.value,
			};
		case "SET_CHECKOUT":
			return {
				...state,
				checkout: action.value,
			};
		case "SET_COUNTRY": {
			return {
				...state,
				country: action.value,
			};
		}
		case "ADD_ADDRESS": {
			return {
				...state,
				addresses: [...state.addresses, action.value],
			};
		}
		case "SET__USER__CATEGORY__SELECTED": {
			return {
				...state,
				categorySelected: action.value,
			};
		}
		case "DELETE_ADDRESS": {
			return {
				...state,
				currentDelivery:
					state.currentDelivery == state.addresses[action.value] ||
					state.currentDelivery == ""
						? ""
						: state.currentDelivery,
				addresses: state.addresses.filter(
					(address, key) => key != action.value
				),
			};
		}
		case "SELECT_ADDRESS": {
			return {
				...state,
				currentDelivery: action.value,
			};
		}
		case "SET_MENU": {
			return {
				...state,
				menu: action.value,
			};
		}
		case "SET__RESTAURANT": {
			return {
				...state,
				currRestaurant: action.value,
			};
		}
		case "CLEAR__CART": {
			return {
				...state,
				cart: {},
			};
		}
		case "SET__USER__ORDERS": {
			return {
				...state,
				orders: action.value,
			};
		}
		case "SET__SERVICE__MODE": {
			return {
				...state,
				serviceMode: action.value,
			};
		}

		case "SET_RESTAURANTS_DISHES": {
			return {
				...state,
				allDishes: action.value,
			};
		}

		default:
			return state;
	}
};
