import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Menu from "./pages/Menu/Menu";
import Sidebar from './pages/Sidebar/Sidebar'
import './Admin.css'
import Orders from "./pages/Orders/Orders";

const Admin = () => {
	return (
		<div className="admin__main">
			<Router>
            <Sidebar />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route path="/Menu" component={Menu} />
					<Route path="/Orders" component={Orders} />
				</Switch>
			</Router>
		</div>
	);
};

export default Admin;
