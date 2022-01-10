import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import MenuIcon from "@mui/icons-material/Menu";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
	Search,
	SearchIconWrapper,
	StyledInputBase,
} from "../../../util/Search/Search";
import SearchIcon from "@mui/icons-material/Search";
import {
	Divider,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box } from "@mui/system";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
	addItemTocart,
	RemoveItemFromcart,
	SetDrawer,
	setRestaurant,
	getMenu,
	setServiceMode,
	updateCountry,
} from "../../../redux/actions/CustomerActions";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Header.css";
import {
	getAllDishes,
	getRestarunts,
	getRestaurantOrders,
	getUser,
	logOutUser,
} from "../../../redux/actions/UserActions";
import OutsideAlerter from "../../../util/OutsideAlerter/OutsideAlerter";

const Header = () => {
	const dispatch = useDispatch();
	const customerData = useSelector((state) => state.customer);
	const userData = useSelector((state) => state.user);
	const [radioValue, setradioValue] = useState(0);
	const [showCart, setshowCart] = useState(false);
	const [showDeliveryModal, setshowDeliveryModal] = useState(false);
	const [quantity, setquantity] = useState(0);
	const [price, setPrice] = useState(0);
	const [searchContent, setsearchContent] = useState([]);
	const [searchResult, setsearchResult] = useState([]);
	const [searchOpen, setsearchOpen] = useState(false);
	const history = useHistory();
	useEffect(() => {
		let count = 0,
			price = 0;
		customerData.cart.items?.map((item) => {
			count += item.quantity;
			price += item.price * item.quantity;
		});
		let searchData = [];
		// customerData.allDishes.map((dish) => {
		// 	searchData.push({
		// 		type: "Dish",
		// 		name: dish.name,
		// 		image: dish.images[0],
		// 		desc: dish.description,
		// 		linkto: dish.restaurant_id,
		// 		location: "",
		// 	});
		// });
		customerData.restaurants
			.filter((rest) =>
				rest.details.services.includes(customerData.serviceMode)
			)
			.map((restaurant) =>
				searchData.push({
					type: "Restaurant",
					name: restaurant.name,
					image: restaurant.details.profilepic,
					desc: restaurant.details.about,
					linkto: restaurant._id,
					location: restaurant.details.city,
				})
			);
		setsearchContent(searchData);
		setquantity(count);
		setPrice(price);
	}, [customerData]);
	const handleMenu = () => {
		console.log("set draweerrr....");
		dispatch(SetDrawer(true));
	};

	const handleCartClose = () => {
		setshowCart(false);
		history.push("/Checkout");
	};

	const handleQuantityChange = (dish, quantity, price) => {
		let itemData = {
			restaurantName: customerData.currRestaurant.name,
			item: { name: dish, quantity, price },
		};
		dispatch(addItemTocart(itemData));
		dispatch(RemoveItemFromcart(itemData));
	};

	const handleLogOut = () => {
		dispatch(logOutUser(userData.token));
	};

	const updateUserCountry = (e) => {
		dispatch(
			updateCountry(userData.userId, userData.token, e.target.value)
		).then(async () => {
			await dispatch(getUser(userData.userId, userData.token));
			await dispatch(getRestarunts(userData.userId, userData.token));
			await dispatch(getAllDishes(userData.userId, userData.token));
		});
	};

	const handleDeliveryModeChange = (e) => {
		dispatch(setServiceMode(e.target.value));
	};

	const handleSearch = (e) => {
		setsearchOpen(true);
		console.log(e.target.value);
		setsearchResult(
			searchContent.filter(
				(item) =>
					item.name
						.toLowerCase()
						.includes(e.target.value.toLowerCase()) ||
					item.location
						?.toLowerCase()
						.includes(e.target.value.toLowerCase())
			)
		);
	};

	const handleRedirect = (res) => {
		console.log(
			customerData.restaurants,
			res,
			customerData.restaurants.filter((rest) => rest._id == res.linkto)
		);
		dispatch(
			setRestaurant(
				customerData.restaurants.filter(
					(rest) => rest._id == res.linkto
				)[0]
			)
		).then(()=>{
			let fetchRest =  customerData.restaurants.filter(
                                        (rest) => rest._id == res.linkto
                                )[0]
			dispatch(getMenu(fetchRest._id, userData.token))
		});
		history.push("/RestaurantStore/" + res.linkto);
		setsearchOpen(false);
	};

	return (
		<div className="main-header">
			<Modal
				open={showCart}
				onClose={() => setshowCart(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				{quantity != 0 ? (
					<Box className="modal-cart-main">
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2"
						>
							<h1>Your order</h1>
							<div>From {customerData.cart.restaurantName}</div>
						</Typography>
						<Typography
							className="modal__description__cart"
							id="modal-modal-description"
							sx={{ mt: 0 }}
						>
							{customerData.cart.items?.map((item) => (
								<div className="checkout__item">
									<Select
										labelId="demo-simple-select-label"
										// id="demo-simple-select"
										value={item.quantity}
										label="City"
										className="item__quantity__dropdown"
										onChange={(e) =>
											handleQuantityChange(
												item.name,
												e.target.value,
												item.price
											)
										}
									>
										<MenuItem value={0}>Remove</MenuItem>
										{Array.from(
											{ length: 10 },
											(_, i) => i + 1
										).map((quan) => (
											<MenuItem value={quan}>
												{quan}
											</MenuItem>
										))}
									</Select>
									<div>{item.name}</div>
								</div>
							))}
						</Typography>
						<Typography className="modal__cart__footer">
							<div
								className="modal__footer__checkout"
								onClick={handleCartClose}
							>
								<div>{quantity}</div>
								<div>Next: Checkout</div>
								<div>${price.toFixed(2)}</div>
							</div>
						</Typography>
					</Box>
				) : (
					<Box className="modal-cart-main">
						<div>
							<div>Add some items</div>
						</div>
					</Box>
				)}
			</Modal>
			<Modal
				open={showDeliveryModal}
				onClose={() => setshowDeliveryModal(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="modal-delivery-main">
					<div className="delivery__heading">Delivery Details</div>
					<div className="location__change__container">
						<FormControl className="country__select__container">
							<Select
								labelId="demo-simple-select-standard-label"
								id="demo-simple-select-standard"
								className="country__select__dropdown"
								value={userData.details?.country}
								onChange={updateUserCountry}
								label="Age"
							>
								{userData.locations?.map((location) => (
									<MenuItem value={location}>
										{location}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</Box>
			</Modal>
			<div className="header__section-1">
				<IconButton
					aria-label="add to favorites"
					className="menu__container"
					onClick={() => handleMenu()}
				>
					<MenuIcon className="menu-icon" />
				</IconButton>
				<Link className="logo__container" to="/">
					<img
						className="menu--logo"
						src="https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg"
						alt="Uber Eats Logo"
					></img>
				</Link>
			</div>
			{!customerData.checkout && (
				<>
					<div>
						<FormControl component="fieldset">
							<RadioGroup
								className="toggle__mode"
								aria-label="gender"
								defaultValue="Delivery"
								name="radio-buttons-group"
								value={customerData.serviceMode}
								onChange={handleDeliveryModeChange}
							>
								<div className="toggle__button__container">
									<FormControlLabel
										className={`toggle__button ${
											customerData.serviceMode ==
												"Delivery" && "activeService"
										}`}
										value="Delivery"
										control={<Radio />}
										label="Delivery"
									/>
								</div>
								<div className="toggle__button__container">
									<FormControlLabel
										className={`toggle__button ${
											customerData.serviceMode ==
												"Pickup" && "activeService"
										}`}
										value="Pickup"
										control={<Radio />}
										label="Pickup"
									/>
								</div>
							</RadioGroup>
						</FormControl>
					</div>
					<div className="toggle__mode">
						<div
							className="toggle__button__container"
							style={{ padding: "10px" }}
						>
							<div
								className="location__container"
								onClick={() => setshowDeliveryModal(true)}
							>
								<LocationOnIcon /> Location
							</div>
						</div>
					</div>
					<div>
						<Form className="d-flex">
							<Search className="search">
								<SearchIconWrapper>
									<SearchIcon />
								</SearchIconWrapper>
								<StyledInputBase
									placeholder="What are you craving?"
									inputProps={{
										"aria-label": "What are you craving?",
									}}
									className="search__box__container"
									onChange={handleSearch}
								/>
							</Search>
						</Form>
						<OutsideAlerter
							handleSearchClose={() => setsearchOpen(false)}
						>
							<div
								className="search__results__container"
								style={{
									display: searchOpen ? "block" : "none",
								}}
							>
								{searchResult.slice(0, 6).map((res) => (
									<>
										<div
											className="search__item"
											onClick={() => handleRedirect(res)}
										>
											<div className="search__item__image">
												<img src={res.image} alt="" />
											</div>
											<div className="search__item__main__info">
												<div className="item__name">
													{res.name} • {res.type} {res.location && "•"}{" "} {res.location} 
												</div>
												<div className="item__description">
													{res.desc}
												</div>
	
											</div>
										</div>
										<div className="search__divider">
											<Divider className="" />
										</div>
									</>
								))}
							</div>
						</OutsideAlerter>
					</div>
					<div className="toggle__mode">
						<div
							className="cart__container-main"
							style={{ padding: "10px" }}
						>
							<div
								className="cart_container"
								onClick={() => setshowCart(true)}
							>
								<ShoppingCartIcon className="cart__icons" />{" "}
								<div className="cart__description">
									Cart • {quantity}
								</div>
							</div>
						</div>
					</div>
					<div className="toggle__mode">
						<div
							className="toggle__button__container"
							style={{ padding: "20px", fontSize: "16px" }}
							onClick={handleLogOut}
						>
							<div className=""> Log out</div>
						</div>
					</div>{" "}
				</>
			)}
		</div>
	);
};

export default Header;
