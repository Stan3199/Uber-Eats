import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

import Customer from "./components/Customer/Customer";
import Admin from "./components/Admin/Admin";
import Login from "./components/Login/Login";
import { resetUser } from "./redux/actions/UserActions";

const App = () => {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetUser);
	}, []);
	console.log(userData);

	return (
		<div className="app-main">
			{userData.userRole == -1 ? (
				<Login />
			) : userData.userRole == 0 ? (
				<Customer />
			) : (
				<Admin />
			)}
		</div>
	);
};

export default App;
