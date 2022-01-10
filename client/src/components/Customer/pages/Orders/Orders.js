import {
	Button,
	Divider,
	Modal,
	TablePagination,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getUserOrders,
	orderAcceptStatus,
} from "../../../../redux/actions/CustomerActions";
import "./Orders.css";

const Orders = () => {
	const [showOrderModal, setshowOrderModal] = useState(false);
	const [currentOrder, setcurrOrder] = useState({});
	const [ordersPage, setordersPage] = useState([]);
	const [rowsPerPage, setrowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [totalCurrentOrders, settotalCurrentOrders] = useState(5);
	const [orderFilterSelected, setorderFilterSelected] = useState("New Order");
	const userData = useSelector((state) => state.user);
	const customerData = useSelector((state) => state.customer);
	const handleModal = (order) => {
		setshowOrderModal(true);
		setcurrOrder(order);
	};

	const dispatch = useDispatch();
	console.log(customerData);
	useEffect(() => {
		dispatch(getUserOrders(userData.userId, userData.token));
	}, []);

	useEffect(() => {
		console.log(customerData.orders, customerData.orders?.slice(0, 5));
		setordersPage(
			customerData.orders
				?.filter((order) => order.restaurant_status == "New Order")
				.slice(0, 5)
		);
		settotalCurrentOrders(
			customerData.orders?.filter(
				(order) => order.restaurant_status == "New Order"
			).length
		);
	}, [customerData]);

	const handleNewOrder = (status) => {
		dispatch(
			orderAcceptStatus(currentOrder._id, status, userData.token)
		).then(() => dispatch(getUserOrders(userData.userId, userData.token)));
	};

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
		console.log(
			newPage,
			newPage * rowsPerPage,
			newPage * rowsPerPage + rowsPerPage
		);
		if (orderFilterSelected == "New Order") {
			setordersPage(
				customerData.orders
					.filter((order) => order.restaurant_status == "New Order")
					.slice(
						newPage * rowsPerPage,
						newPage * rowsPerPage + rowsPerPage
					)
			);
			settotalCurrentOrders(
				customerData.orders.filter(
					(order) => order.restaurant_status == "New Order"
				).length
			);
		} else if (orderFilterSelected == "Order Cancelled") {
			settotalCurrentOrders(
				customerData.orders.filter(
					(order) => order.restaurant_status == "Order Cancelled"
				).length
			);
			setordersPage(
				customerData.orders
					.filter(
						(order) => order.restaurant_status == "Order Cancelled"
					)
					.slice(
						newPage * rowsPerPage,
						newPage * rowsPerPage + rowsPerPage
					)
			);
		} else {
			settotalCurrentOrders(
				customerData.orders.filter(
					(order) =>
						order.restaurant_status != "New Order" &&
						order.restaurant_status != "Order Cancelled"
				).length
			);
			setordersPage(
				customerData.orders
					.filter(
						(order) =>
							order.restaurant_status != "New Order" &&
							order.restaurant_status != "Order Cancelled"
					)
					.slice(
						newPage * rowsPerPage,
						newPage * rowsPerPage + rowsPerPage
					)
			);
		}
	};
	// console.log(
	// 	customerData.orders.filter(
	// 		(order) => order.restaurant_status == "Order Cancelled"
	// 	).length
	// );
	const handleChangeRowsPerPage = (event) => {
		setordersPage(
			customerData.orders.slice(0, parseInt(event.target.value, 10))
		);
		setrowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleOrderTypeFilter = (filter) => {
		setorderFilterSelected(filter);
		setPage(0);
		if (filter == "New Order") {
			setordersPage(
				customerData.orders
					.filter((order) => order.restaurant_status == "New Order")
					.slice(0, rowsPerPage)
			);
			settotalCurrentOrders(
				customerData.orders.filter(
					(order) => order.restaurant_status == "New Order"
				).length
			);
		} else if (filter == "Order Cancelled") {
			setordersPage(
				customerData.orders
					.filter(
						(order) => order.restaurant_status == "Order Cancelled"
					)
					.slice(0, rowsPerPage)
			);
			settotalCurrentOrders(
				customerData.orders.filter(
					(order) => order.restaurant_status == "Order Cancelled"
				).length
			);
		} else {
			settotalCurrentOrders(
				customerData.orders.filter(
					(order) =>
						order.restaurant_status != "New Order" &&
						order.restaurant_status != "Order Cancelled"
				).length
			);
			setordersPage(
				customerData.orders
					.filter(
						(order) =>
							order.restaurant_status != "New Order" &&
							order.restaurant_status != "Order Cancelled"
					)
					.slice(0, rowsPerPage)
			);
		}
		console.log(
			customerData.orders
				.filter((order) => order.restaurant_status == "New Order")
				.slice(0, rowsPerPage)
		);
		console.log(filter);
	};
	console.log(totalCurrentOrders);
	return (
		<div>
			<Modal
				open={showOrderModal}
				onClose={() => setshowOrderModal(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="modal-cart-main__restaurant">
					<div className="receipt">Receipt</div>
					<Divider />

					<div className="order__detail__main">
						<div className="total__order__bill">
							<div className="total">Total</div>
							<div className="bill">
								$
								{currentOrder.dishes?.reduce(
									(total, dish) =>
										parseInt(dish.price) *
											parseInt(dish.count) +
										total,
									0
								)}
							</div>
						</div>
						{currentOrder.dishes?.map((dish) => (
							<div className="order__items__main__container">
								<div className="order__quantity__name">
									<div className="order__quantity">
										{dish.count}
									</div>
									<div className="order__details__main">
										<div className="dish__name">
											{dish.dish_id.name}
										</div>
										<div className="dish__ingredients">
											<div>
												{dish.dish_id.name} comes with
											</div>
											{dish.dish_id.Ingredients.split(
												","
											).map((ingredient) => (
												<div className="ingredient">
													{ingredient}
												</div>
											))}
										</div>
									</div>
								</div>
								<div className="order__price">
									${dish.price * dish.count}
								</div>
							</div>
						))}
					</div>

					{currentOrder.restaurant_status == "New Order" && (
						<div className="order__accept__reject">
							<Button
								variant="contained"
								onClick={() => {
									setshowOrderModal(false);
									handleNewOrder("Order Cancelled");
								}}
								color="error"
							>
								Cancel
							</Button>
						</div>
					)}
				</Box>
			</Modal>
			<Divider />
			<div className="orders__main">
				<div>
					<h1>Your Orders</h1>
				</div>
				<div className="orders__categories">
					<div
						className={`category__item ${
							orderFilterSelected == "New Order" &&
							"selected__filter"
						}`}
						onClick={() => handleOrderTypeFilter("New Order")}
					>
						Pending
					</div>
					<div
						className={`category__item ${
							["Picked up", "Delivered"].some((el) =>
								orderFilterSelected.includes(el)
							) && "selected__filter"
						}`}
						onClick={() =>
							handleOrderTypeFilter(["Picked up", "Delivered"])
						}
					>
						Completed
					</div>
					<div
						className={`category__item ${
							orderFilterSelected == "Order Cancelled" &&
							"selected__filter"
						}`}
						onClick={() => handleOrderTypeFilter("Order Cancelled")}
					>
						Cancelled
					</div>
				</div>
				{ordersPage.map((order, key) => (
					<>
						{key != 0 && <Divider className="small__divider" />}
						<div
							className="order__body"
							onClick={() => handleModal(order)}
						>
							<h3>{order.restaurant_id.name}</h3>
							<p>
								{order.dishes.reduce(
									(total, dish) =>
										total + parseInt(dish.count),
									0
								)}{" "}
								items for $
								{order.dishes.reduce(
									(total, dish) =>
										total +
										parseInt(dish.count) *
											parseInt(dish.price),
									0
								)}{" "}
								• Order Status: {order.restaurant_status}
							</p>
						</div>
					</>
				))}
			</div>
			<div className="pagination__main__container">
				<TablePagination
					component="div"
					count={totalCurrentOrders}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					rowsPerPageOptions={[2, 5, 10]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</div>
		</div>
	);
};

export default Orders;
