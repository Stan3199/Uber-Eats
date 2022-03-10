import { Button, CardMedia, Divider, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu/Menu";
import "./RestaurantStore.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
	addItemTocart,
	clearCart,
	RemoveItemFromcart,
	setRestaurant,
} from "../../../../redux/actions/CustomerActions";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const RestaurantStore = () => {
	const customerData = useSelector((state) => state.customer);
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [modal, setmodal] = useState(false);
	const [newOrderModal, setnewOrderModal] = useState(false);
	const [dish, setDish] = useState({});
	const [quantity, setQuantity] = useState(1);
	const [dishPrice, setdishPrice] = useState(0);
	const [exquantity, setexQuantity] = useState(0);
	const handleModal = (Dish) => {
		// const existing
		let existingQuantity;
		customerData.cart.items?.map((item) => {
			if (item.name == Dish.name) {
				existingQuantity = item.quantity;
			}
		});
		// // ?.find((item) => item.name == Dish.name);
		setexQuantity(existingQuantity ? existingQuantity : 0);
		setdishPrice(Dish.price);
		console.log(Dish);
		setDish(Dish);
		setmodal(true);
	};
	const handleCart = () => {
		// dispatch(addItemTocard())
		if (
			Object.keys(customerData.cart).length != 0 &&
			customerData.currRestaurant?.name !=
				customerData.cart.restaurantName
		) {
			return setnewOrderModal(true);
		}
		let itemData = {
			restaurantName: customerData.currRestaurant?.name,
			item: {
				name: dish.name,
				quantity: exquantity + quantity,
				price: dish.price,
				id: dish._id,
			},
		};
		dispatch(addItemTocart(itemData));
		dispatch(RemoveItemFromcart(itemData));
		setQuantity(1);
		setdishPrice(0);
		setmodal(false);
	};

	const handleModalClose = () => {
		setQuantity(1);
		setmodal(false);
	};

	const hadleItemAdd = (dish) => {
		setdishPrice(((quantity + 1) * dish.price).toFixed(2));
		setQuantity(quantity + 1);
	};

	const hadleRemove = (dish) => {
		setdishPrice((quantity - 1) * dish.price);
		setQuantity(quantity - 1);
	};

	const handleNewCart = () => {
		dispatch(clearCart());
		setnewOrderModal(false);
	};

	const handleCategory = (category) => {
		dispatch({ type: "SET__USER__CATEGORY__SELECTED", value: category });
	};
	return (
		<div className="restaraunt-main">
			<Modal
				open={modal}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="modal-main">
					<CardMedia
						className="modal__image__container"
						component="img"
						height="194"
						image={dish.images && dish.images[0]}
						alt="Paella dish"
					/>
					<Typography
						className="modal__description"
						id="modal-modal-description"
						sx={{ mt: 0 }}
					>
						<h1>{dish.name}</h1>
						{dish.description}
					</Typography>
					<Typography className="modal__footer">
						<div className="modal__icons">
							<div className="icon__container">
								<RemoveIcon
									onClick={() =>
										quantity != 1 && hadleRemove(dish)
									}
								/>
							</div>
							{quantity}
							<div className="icon__container">
								<AddIcon onClick={() => hadleItemAdd(dish)} />
							</div>
						</div>
						<div
							className={`modal__select__add ${
								quantity == 0 ? `empty` : `notempty`
							}`}
							onClick={() => quantity >= 0 && handleCart()}
						>
							<div>Add {quantity} order</div>
							<div>${dishPrice}</div>
						</div>
					</Typography>
				</Box>
			</Modal>
			<Modal
				open={newOrderModal}
				onClose={() => setnewOrderModal(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="modal-main__new__order">
					<Typography
						className="modal__description__new__order"
						id="modal-modal-description"
						sx={{ mt: 0 }}
					>
						<h1>Create new order?</h1>
						Your order contains items from{" "}
						{customerData.cart.restaurantName}. Create a new order
						to add items from {customerData.currRestaurant?.name}
					</Typography>
					<div className="new__order__button" onClick={handleNewCart}>
						<div>New Order</div>
					</div>
				</Box>
			</Modal>
			<div className="poster-main">
				<img
					className="poster__image"
					src={customerData.currRestaurant?.details?.profilepic}
				/>
				<div className="restaurant__container">
					<div className="restaurant__name">
						{customerData.currRestaurant?.name}
					</div>
					<div className="restaurant__description">
						{customerData.currRestaurant?.details?.about}
					</div>
					<div className="restaurant__description">
						{customerData.currRestaurant?.details?.description}
					</div>
				</div>
			</div>

			<div className="menu__categories__restaurant">
				{userData.categories.map((category) => (
					<div
						className="category"
						onClick={() => handleCategory(category)}
					>
						{category}
					</div>
				))}
			</div>
			{console.log(customerData)}
			<Divider className="divider__restaurant" />
			<Menu modal={(item) => handleModal(item)} />
		</div>
	);
};

export default RestaurantStore;
