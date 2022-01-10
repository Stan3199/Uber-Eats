import {
	Avatar,
	Button,
	Card,
	CardContent,
	CardMedia,
	Checkbox,
	Divider,
	FormControl,
	Input,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
	Search,
	SearchIconWrapper,
	StyledInputBase,
} from "../../../../util/Search/Search";
import SearchIcon from "@mui/icons-material/Search";
import "./Menu.css";
import AddIcon from "@mui/icons-material/Add";

import { AddMenuModal, EditDishModal } from "../../Modals/Modals";
import { useDispatch, useSelector } from "react-redux";
import { getMenu } from "../../../../redux/actions/CustomerActions";

const Menu = (props) => {
	const userData = useSelector((state) => state.user);
	const customerData = useSelector((state) => state.customer);

	const [allMenu, setAllMenu] = useState([]);
	const [menuCategory, setmenuCategory] = useState([]);
	const [addModal, setaddModal] = useState(false);
	const [editModal, seteditModal] = useState(false);
	const [editDish, seteditDish] = useState({});

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getMenu(userData.userId, userData.token));
	}, []);

	useEffect(() => {
		if (customerData.menu.length != 0) {
			setAllMenu(customerData.menu);
			setmenuCategory(customerData.menu);
		}
		console.log(customerData.menu);
	}, [customerData]);

	const handleCategory = (cat) => {
		if (cat == "All") return setmenuCategory(allMenu);
		setmenuCategory(allMenu.filter((menu) => menu["dish type"] == cat));
	};

	const handleEditModal = (dish) => {
		console.log(dish);
		seteditDish(dish);
		seteditModal(true);
	};

	const handleSearch = (e) => {
		if (e.target.value == "") setmenuCategory(allMenu);
		setmenuCategory(
			allMenu.filter(
				(menu) =>
					menu.name
						.toLowerCase()
						.indexOf(e.target.value.toLowerCase()) != -1
			)
		);
	};

	return (
		<div className="menu__main__container">
			<AddMenuModal
				modal={addModal}
				updateModal={(value) => setaddModal(value)}
				token={userData.token}
			/>
			<EditDishModal
				modal={editModal}
				updateModal={(value) => seteditModal(value)}
				dish={editDish}
				token={userData.token}
			/>
			<div className="menu__top__container">
				<div className="item menu__header">Menu</div>
				<div className="item menu__options__container">
					<div className="menu__search__container">
						{" "}
						<Search onChange={handleSearch}>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								className="search__menu"
								placeholder="What are you craving?"
								inputProps={{
									"aria-label": "What are you craving?",
								}}
							/>
						</Search>
					</div>
					<div
						className="menu__add__container"
						onClick={() => setaddModal(true)}
					>
						<AddIcon />
						Add
					</div>
				</div>
			</div>

			<div className="menu__bottom__container">
				<div className="menu__categories">
					{userData.categories.map((category) => (
						<div
							className="category__menu"
							onClick={() => handleCategory(category)}
						>
							{category}
						</div>
					))}
				</div>
				<Divider className="divider" />
				<div className="menu__container">
					{menuCategory?.map((dish) => (
						<Card
							className="card_main"
							onClick={() => handleEditModal(dish)}
						>
							<CardContent>
								<div className="card__container">
									<Typography
										variant="body2"
										color="text.secondary"
										className="card__content__container"
									>
										<div className="card_content__body">
											<div>
												<p>{dish.name}</p>
											</div>
											<div>
												<div className="card__description">
													{dish.description}
												</div>
											</div>
											<div>
												<p>{dish.price}</p>
											</div>
										</div>
									</Typography>

									<CardMedia
										className="card__image__owner"
										component="img"
										height="194"
										image={dish.images[0]}
										alt="Paella dish"
									/>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default Menu;
