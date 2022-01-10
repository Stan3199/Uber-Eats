import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setRestaurant } from "../../../../redux/actions/CustomerActions";
import "./Favorites.css";

const Favorites = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user);
	const customerData = useSelector((state) => state.customer);
	const [restaurantData, setrestaurantData] = useState([]);
	const handleRestaurantSelect = (restaurant) => {
		dispatch(setRestaurant(restaurant));
	};
	useEffect(() => {
		if (customerData.restaurants != null)
			setrestaurantData(customerData.restaurants);
		console.log(customerData);
	}, [customerData]);
	return (
		<div className="favorites__main__container">
			<div className="header__favorites__container">Your Favorites</div>
			<div className="favorites__container">
				<div className="restaraunt__body">
					{restaurantData
						?.filter((restaurant) =>
							userData.fav.includes(restaurant._id)
						)
						.map((restaurant) => (
							<Link
								to={`/RestaurantStore/${restaurant._id}`}
								class="restarunt__main__body"
								onClick={() =>
									handleRestaurantSelect(restaurant)
								}
							>
								<Card className="card-main__restaraunt__page">
									<div className="image-container__restaraunt__page">
										<CardMedia
											className="image"
											component="img"
											height="194"
											loading="eager"
											image={
												restaurant.details.profilepic
											}
											alt="Paella dish"
										/>
									</div>
									<CardContent>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											<div>
												<p>{restaurant.name}</p>
											</div>
											<div>
												<p>{restaurant.rating}</p>
											</div>
										</Typography>
									</CardContent>
								</Card>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};

export default Favorites;
