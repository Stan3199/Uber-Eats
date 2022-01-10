import { Drawer, List, ListItem } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box } from "@mui/system";
import React from "react";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { SetAdminDrawer } from "../../../../redux/actions/AdminActions";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const Sidebar = () => {
	const dispatch = useDispatch();

	return (
		<div className="sidebar__main__container">
			<List className="sidebar__main">
				<ListItem className="sidebar__item">
					<Link className="uber__logo" to="/">
						<img
							className="menu--logo"
							src="https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg"
						></img>
					</Link>
				</ListItem>
				<ListItem>
					<Link className="sidebar__item" to="/">
						<div className="icon">
							<HomeIcon />
						</div>
						<div>Home</div>
					</Link>
				</ListItem>
				<ListItem>
					<Link className="sidebar__item" to="/Orders">
						<div className="icon">
							<FastfoodIcon />
						</div>
						<div>Orders</div>
					</Link>
				</ListItem>
				<ListItem>
					<Link className="sidebar__item" to="/Menu">
						<div className="icon">
							<MenuBookIcon />
						</div>
						<div>Menu</div>
					</Link>
				</ListItem>
			</List>
		</div>
	);
};

export default Sidebar;
