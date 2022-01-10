import React, { useState, useEffect } from "react";
import './OrderContent.css'
import Filter from "./Filter/Filter";
import Content from "./Content/Content";

const OrderContent = () => {
	return (
		<div className="orderContent-main">
			<div className="filter__section"><Filter/></div>
			<div className="orderContent__content"><Content /> </div>
		</div>
	);
};

export default OrderContent;
