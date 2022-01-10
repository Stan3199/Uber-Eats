import React, { useEffect } from "react";
import "./Landing.css";
import Categories from "./Categoreis/Categories";
import OrderContent from "./OrderContent/OrderContent";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "@mui/material";
import {
	getAllDishes,
	getRestarunts,
} from "../../../../redux/actions/UserActions";

const LandingPage = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user);
	const customerData = useSelector((state) => state.customer);

	useEffect(() => {
		if (customerData.restaurants.length == 0) {
			dispatch(getRestarunts(userData.userId, userData.token)).then(() =>
				dispatch(getAllDishes(userData.userId, userData.token))
			);
		}
	}, []);

	return (
		<div className="landing-main">
			{/*<Categories />*/}
			<Divider />
			<OrderContent />
		</div>
	);
};

export default LandingPage;
