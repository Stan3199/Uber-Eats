import {
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orderAcceptStatus } from "../../../../redux/actions/CustomerActions";
import { getRestaurantOrders } from "../../../../redux/actions/UserActions";
import "./Orders.css";

const Orders = () => {
  const [orders, setorders] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const adminData = useSelector((state) => state.admin);
  const [showOrderModal, setshowOrderModal] = useState(false);
  const [showOrderStatusModal, setshowOrderStatusModal] = useState(false);
  const [currentOrder, setcurrentOrder] = useState({});
  const [orderFilterSelected, setorderFilterSelected] = useState("New Order");

  useEffect(() => {
    dispatch(getRestaurantOrders(userData.userId, userData.token));
  }, []);

  useEffect(() => {
    console.log(adminData);
    if (adminData) {
      setorders(adminData.orders);
    }
  }, [adminData]);
  console.log(orders);

  const handleOrderViewModal = (order) => {
    setshowOrderModal(true);
    setcurrentOrder(order);
  };

  const handleNewOrder = async (status) => {
    dispatch(orderAcceptStatus(currentOrder._id, status, userData.token)).then(
      () => dispatch(getRestaurantOrders(userData.userId, userData.token))
    );
  };

  const handleOrderTypeFilter = (filter) => {
    setorderFilterSelected(filter);
    console.log(filter);
  };

  return (
    <div className="orders__main">
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
                    parseInt(dish.price) * parseInt(dish.count) + total,
                  0
                )}
              </div>
            </div>
            {currentOrder.dishes?.map((dish) => (
              <div className="order__items__main__container">
                <div className="order__quantity__name">
                  <div className="order__quantity">{dish.count}</div>
                  <div className="order__details__main">
                    <div className="dish__name">{dish.dish_id.name}</div>
                    <div className="dish__ingredients">
                      <div>{dish.dish_id.name} comes with</div>
                      {dish.dish_id.Ingredients.split(",").map((ingredient) => (
                        <div className="ingredient">{ingredient}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="order__price">${dish.price * dish.count}</div>
              </div>
            ))}
          </div>
          {currentOrder.restaurant_status == "New Order" && (
            <div className="order__accept__reject">
              <Button
                variant="contained"
                onClick={() => {
                  setshowOrderModal(false);
                  handleNewOrder("Preparing");
                }}
              >
                Preparing
              </Button>
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
          {currentOrder.restaurant_status == "Preparing" && (
            <div className="order__update">
              <Button
                variant="contained"
                onClick={() => {
                  setshowOrderModal(false);
                  handleNewOrder(
                    currentOrder.delivery_type == "pickup"
                      ? "On the way"
                      : "Pick up Ready"
                  );
                }}
              >
                {currentOrder.delivery_type == "pickup"
                  ? "On the way"
                  : "Pick up Ready"}
              </Button>
            </div>
          )}
          {["On the way", "Pick up Ready"].includes(
            currentOrder.restaurant_status
          ) && (
            <div className="order__update">
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setshowOrderModal(false);
                  handleNewOrder(
                    currentOrder.delivery_type == "pickup"
                      ? "Picked up"
                      : "Delivered"
                  );
                }}
              >
                {currentOrder.delivery_type == "pickup"
                  ? "Picked up"
                  : "Delivered"}
              </Button>
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={showOrderStatusModal}
        onClose={() => setshowOrderStatusModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-cart-main__restaurant">
          <div className="order__status__container">
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // value={props.user.country}
              // label="Country"
              // onChange={(e) =>
              // 	dispatch(setUserCountry(e.target.value))
              // }
            >
              {/* {locations.country.map((country) => (
								<MenuItem value={country}>{country}</MenuItem>
							))} */}
            </Select>
          </div>
        </Box>
      </Modal>
      <div className="orders__container">
        <div className="orders__heading">Orders</div>
        <div className="orders__categories">
          <div
            className={`category__item ${
              orderFilterSelected == "New Order" && "selected__filter"
            }`}
            onClick={() => handleOrderTypeFilter("New Order")}
          >
            Pending
          </div>
          <div
            className={`category__item ${
              ["On the way", "Pick up Ready", "Preparing"].some((el) =>
                orderFilterSelected.includes(el)
              ) && "selected__filter"
            }`}
            onClick={() =>
              handleOrderTypeFilter([
                "On the way",
                "Pick up Ready",
                "Preparing",
              ])
            }
          >
            Confirmed
          </div>
          <div
            className={`category__item ${
              ["Picked up", "Delivered"].some((el) =>
                orderFilterSelected.includes(el)
              ) && "selected__filter"
            }`}
            onClick={() => handleOrderTypeFilter(["Picked up", "Delivered"])}
          >
            Completed
          </div>
          <div
            className={`category__item ${
              orderFilterSelected == "Order Cancelled" && "selected__filter"
            }`}
            onClick={() => handleOrderTypeFilter("Order Cancelled")}
          >
            Cancelled
          </div>
        </div>
        <Divider />
        <div className="orders">
          {orders
            ?.filter((order) =>
              orderFilterSelected.includes(order.restaurant_status)
            )
            .map((order) => (
              <div className="order__main__container">
                <div className="order__container">
                  <div className="order__information">
                    <div className="user__name">{order.customer_id.name}</div>
                    <div className="order__description__container">
                      {order.dishes.reduce(
                        (total, val) => parseInt(val.count) + total,
                        0
                      )}{" "}
                      items for $
                      {order.dishes.reduce(
                        (total, val) =>
                          parseInt(val.price) * parseInt(val.count) + total,
                        0
                      )}
                    </div>
                  </div>
                  <div className="order__options">
                    <div
                      className="option view__order"
                      onClick={() => handleOrderViewModal(order)}
                    >
                      View Order
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
