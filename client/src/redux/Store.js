import { createStore, combineReducers, compose, applyMiddleware } from "redux";

import ReduxThunk from "redux-thunk";
import { adminReducer } from "./reducers/Admin";
import { customerReducer } from "./reducers/Customer";
import { userReducer } from "./reducers/User";

const createStoreWithMiddleware = compose(applyMiddleware(ReduxThunk))(
	createStore
);

const rootReducer = combineReducers({
	customer: customerReducer,
	admin: adminReducer,
	user: userReducer,
});
function configureStore(initialState = {}) {
	return createStoreWithMiddleware(rootReducer, initialState);
}

const store = configureStore(window.__REDUX_STATE__ || {});

export default store;
