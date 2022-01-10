import React, { useState, useEffect } from "react";
import "./Restaurant.css";
import Card from "@mui/material/Card";
import {
	CardActions,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	setRestaurant,
	setUserFav,
} from "../../../../../../../redux/actions/CustomerActions";
const Restaurants = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user);
	const customerData = useSelector((state) => state.customer);
	const [restaurantData, setrestaurantData] = useState([]);

	useEffect(() => {
		if (customerData.restaurants != null)
			setrestaurantData(customerData.restaurants);
		console.log(userData);
	}, [customerData]);

	const handleFav = (e, restaurant) => {
		e.preventDefault();
		dispatch(setUserFav(restaurant._id, userData.userId, userData.token));
	};

	const handleRestaurantSelect = (restaurant) => {
		dispatch(setRestaurant(restaurant));
	};

	return (
		<div>
			<div className="restaraunt__body">
				{restaurantData
					?.filter((restaurant) =>
						restaurant.details?.services.includes(
							customerData.serviceMode
						)
					)
					.map((restaurant) => (
						<Link
							to={`/RestaurantStore/${restaurant._id}`}
							class="restarunt__main__body"
							onClick={() => handleRestaurantSelect(restaurant)}
						>
							<Card className="card-main__restaraunt__page">
								<div className="image-container__restaraunt__page">
									<CardMedia
										className="image"
										component="img"
										height="194"
										loading="eager"
										image={restaurant.details.profilepic}
										alt="Paella dish"
									/>
									<CardActions disableSpacing>
										<IconButton
											className="fav-icon"
											aria-label="add to favorites"
											onClick={(e) =>
												handleFav(e, restaurant)
											}
										>
											{userData.fav?.includes(
												restaurant._id
											) ? (
												<FavoriteIcon className="fav-fill" />
											) : (
												<FavoriteBorderIcon className="fav-border" />
											)}
										</IconButton>
									</CardActions>
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
	);
};

export default Restaurants;
