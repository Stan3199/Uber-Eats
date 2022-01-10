import {
	Button,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addItemTocart,
	addOrder,
	clearCart,
	RemoveItemFromcart,
	setNavBarCheckout,
	setUserCountry,
} from "../../../../redux/actions/CustomerActions";
import RoomIcon from "@mui/icons-material/Room";
import HouseIcon from "@mui/icons-material/House";
import "./Checkout.css";
import swal from "sweetalert";
import { Box } from "@mui/system";
import { CountryModal, DeliveryModal } from "./Modals/Modals";
import { useHistory } from "react-router";

const Checkout = () => {
	const customerData = useSelector((state) => state.customer);
	const userData = useSelector((state) => state.user);
	const [countryModal, setCountryModal] = useState(false);
	const [addressModal, setaddressModal] = useState(false);
	const [userUpdated, setUserUpdated] = useState({});
	const [totalPrice, settotalPrice] = useState(0);
	const [orderInstructions, setorderInstructions] = useState("");
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(setNavBarCheckout(true));
		return () => {
			dispatch(setNavBarCheckout(false));
		};
	}, []);

	useEffect(() => {
		console.log("updating...", customerData);
		customerData != {} && setUserUpdated(customerData);

		settotalPrice(
			customerData.cart.items?.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			)
		);
	}, [customerData]);

	const updateCountryModal = (value) => {
		setCountryModal(value);
	};

	const updatedeliveryModal = (value) => {
		setaddressModal(value);
	};

	const handleQuantityChange = (dish, quantity, price) => {
		console.log(dish, quantity);
		let itemData = {
			restaurantName: customerData.cart.restaurantName,
			item: { name: dish, quantity, price },
		};
		dispatch(addItemTocart(itemData));
		dispatch(RemoveItemFromcart(itemData));
	};

	const handleCart = () => {
		if (userUpdated.currentDelivery == "")
			return swal(
				"Data missing",
				"No delivery address added or selected"
			);
		let order = {
			restaurant_id: customerData.currRestaurant._id,
			customer_id: userData.userId,
			dishes: customerData.cart.items.map((item) => ({
				dish_id: item.id,
				count: item.quantity,
				price: item.price,
			})),
			delivery_type: customerData.deliveryType,
			customer_status: "New Order",
			restaurant_status: "New Order",
			order_instructions: orderInstructions,
		};

		dispatch(addOrder(order, userData.token)).then(() =>
			swal({
				title: "Order added!",
				type: "success",
			}).then(function () {
				dispatch(clearCart())
				history.push("/Orders");
			})
		);
		console.log(order, customerData, userData);
	};
	return (
		<div className="checkout__main">
			<CountryModal
				user={userUpdated}
				modal={countryModal}
				updateModal={updateCountryModal}
			/>
			<DeliveryModal
				user={userUpdated}
				modal={addressModal}
				updateModal={updatedeliveryModal}
			/>
			<div className="order__description">
				<div className="delivery__container__main">
					<div className="delivery__item">
						<div className="delivery__icon">
							<RoomIcon />
						</div>
						<div className="delivery__container">
							<div className="location__name">
								{userUpdated.country}
							</div>
							<div
								className="delivery__edit__container"
								onClick={() => updateCountryModal(true)}
							>
								Edit
							</div>
						</div>
					</div>
					<Divider
						variant="fullWidth"
						className="payment__item divider"
					/>
					<div className="delivery__item">
						<div className="delivery__icon">
							<HouseIcon />
						</div>
						<div className="delivery__container">
							<div className="location__name">
								Delivery Address
								<div className="address">
									{userUpdated.currentDelivery}
								</div>
							</div>
							<div
								className="delivery__edit__container"
								onClick={() => updatedeliveryModal(true)}
							>
								Edit
							</div>
						</div>
					</div>
					<Divider
						variant="fullWidth"
						className="payment__item divider"
					/>
				</div>
				<div className="order__container__checkout">
					<div className="order__heading">
						<h3>Your items</h3>
					</div>
					<div className="order__items__container">
						{customerData.cart.items ? (
							customerData.cart.items.map((item, key) => (
								<div className="order__item">
									<div className="order__item__container">
										<div className="order__item__quantity">
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
												<MenuItem value={0}>
													Remove
												</MenuItem>
												{Array.from(
													{ length: 10 },
													(_, i) => i + 1
												).map((quan) => (
													<MenuItem value={quan}>
														{quan}
													</MenuItem>
												))}
											</Select>
										</div>
										<div className="item__right__container">
											<div>{item.name}</div>
											<div>
												${item.price * item.quantity}
											</div>
										</div>
									</div>
									{key !=
										customerData.cart.items.length - 1 && (
										<Divider className="payment__item divider" />
									)}
								</div>
							))
						) : (
							<div>Your Cart is Empty!!!</div>
						)}
						{customerData.cart.items && (
							<div className="order__instruction">
								{" "}
								<TextField
									id="filled-basic"
									label="Add a note for the store"
									variant="filled"
									value={orderInstructions}
									onChange={(e) =>
										setorderInstructions(e.target.value)
									}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="order__payment__container">
				<div className="order__payment">
					<div
						className="payment__item place__order__container"
						onClick={() => handleCart()}
					>
						<div>Place Order</div>
					</div>
					<div className="payment__item delivery__guideline">
						If you’re not around when the delivery person arrives,
						they’ll leave your order at the door. By placing your
						order, you agree to take full responsibility for it once
						it’s delivered.
					</div>
					<Divider
						variant="fullWidth"
						className="payment__item divider"
					/>
					<div className="payment__item payment__bill__container">
						<div className="payment__item bill__item">
							<div className="item__name">Subtotal</div>
							<div className="item__price">${totalPrice}</div>
						</div>
						<div className="payment__item bill__item">
							<div className="item__name">Service</div>
							<div className="item__price">$0.00</div>
						</div>
						<div className="payment__item bill__item">
							<div className="item__name">Delivery</div>
							<div className="item__price">$0.00</div>
						</div>
					</div>
					<Divider
						variant="fullWidth"
						className="payment__item divider"
					/>
					{orderInstructions != "" && (
						<div className="payment__order__instructions__container">
							<div className="instructions__heading">
								Instructions:
							</div>
							<div className="payment__order__instructions">
								{orderInstructions}
							</div>
							<Divider
								variant="fullWidth"
								className="payment__item divider"
							/>
						</div>
					)}

					<div className="payment__item total__container">
						<div className="total__title">Total</div>
						<div className="total__price">${totalPrice}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
