import {
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import "./Sidebar.css";
import { Box } from "@mui/system";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { SetDrawer } from "../../../redux/actions/CustomerActions";

const Sidebar = () => {
	const dispatch = useDispatch();
	const customerData = useSelector((state) => state.customer);
	const userData = useSelector((state) => state.user);

	const toggleDrawer = (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		dispatch(SetDrawer(false));
	};
	return (
		<div>
			<React.Fragment>
				<Drawer
					anchor={"left"}
					open={customerData.drawer}
					onClose={toggleDrawer}
					className="sidebar__container"
				>
					<Box
						role="presentation"
						onClick={toggleDrawer}
						onKeyDown={toggleDrawer}
						className="sidebar__box"
					>
						<List>
							<ListItem>
								<div>
									<AccountCircleIcon className="account_icon" />
								</div>
								<div className="sidebar__user">
									<div>{userData.userName}</div>
									<Link to="/Profile">
										{" "}
										<div>View Account</div>
									</Link>
								</div>
							</ListItem>
							<Link to="/Orders">
								<ListItem button key={"Orders"}>
									<ListItemIcon>
										<AssignmentReturnIcon />
									</ListItemIcon>
									<ListItemText primary={"Orders"} />
								</ListItem>
							</Link>
							<Link to="/Favorites">
								<ListItem
									button
									key={"Favorites"}
									className="sidebar__row"
								>
									<ListItemIcon>
										<FavoriteIcon />
									</ListItemIcon>
									<ListItemText primary={"Favorites"} />
								</ListItem>
							</Link>
						</List>
						<Divider />
						<List>
							{/* {["All mail", "Trash", "Spam"].map(
								(text, index) => (
									<ListItem button key={text}>
										<ListItemIcon>
											{index % 2 === 0 ? (
												<InboxIcon />
											) : (
												<MailIcon />
											)}
										</ListItemIcon>
										<ListItemText primary={text} />
									</ListItem>
								)
							)} */}
						</List>
					</Box>
				</Drawer>
			</React.Fragment>
		</div>
	);
};

export default Sidebar;
