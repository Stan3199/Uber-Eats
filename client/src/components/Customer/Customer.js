import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Checkout from "./pages/Checkout/Checkout";
import Favorites from "./pages/Favorites/Favorites";
import LandingPage from "./pages/LandingPage/Landing";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import RestaurantStore from "./pages/RestaurantStore/RestaurantStore";
import Sidebar from "./Sidebar/Sidebar";

function Customer() {
	return (
		<div>
			<Router>
				<Header />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route
						path="/RestaurantStore/:rid"
						component={RestaurantStore}
					/>
					<Route path="/Checkout" component={Checkout} />
					<Route path="/Orders" component={Orders} />
					<Route path="/Favorites" component={Favorites} />
					<Route path="/Profile" component={Profile} />
				</Switch>
				<Sidebar />
				{/* <Footer /> */}
			</Router>
		</div>
	);
}

export default Customer;
