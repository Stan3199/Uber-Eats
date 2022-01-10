import {
	Avatar,
	Button,
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { useDispatch, useSelector } from "react-redux";
import {
	addDishToMenu,
	editDishToMenu,
	getMenu,
} from "../../../redux/actions/CustomerActions";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import {
	updateBasicDetailsRest,
	updateContactDetailsRest,
} from "../../../redux/actions/AdminActions";
import { getUser } from "../../../redux/actions/UserActions";
import { validateDateRange } from "@mui/lab/internal/pickers/date-utils";
export const AddMenuModal = (props) => {
	const [newDish, setnewDish] = useState({});
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const fileChangedHandler = (event) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];

			var reader = new FileReader();

			reader.onloadend = function (e) {
				setnewDish({
					...newDish,
					images: [reader.result],
					imageFile: file,
				});
			};

			reader.readAsDataURL(file);
		}
	};

	const handlePrice = (e) => {
		if (e.target.value.length > 1 && e.target.value[0] == "0")
			return setnewDish({ ...newDish, price: 0 });
		e.target.value >= 0 &&
			e.target.value < 100 &&
			setnewDish({
				...newDish,
				price: e.target.value,
			});
	};

	const handleSubmit = async () => {
		newDish.restaurant_id = userData.userId;
		console.log(newDish);
		const formData = new FormData();
		formData.append("Ingredients", newDish.Ingredients);
		formData.append("description", newDish.description);
		formData.append("dish category", newDish["dish category"]);
		formData.append("dish type", newDish["dish type"]);
		formData.append("name", newDish.name);
		formData.append("price", newDish.price);
		formData.append("restaurant_id", newDish.restaurant_id);
		formData.append("image", newDish.imageFile);

		await dispatch(addDishToMenu(formData, userData.token)).then(() => {
			props.updateModal(false);
			dispatch(getMenu(userData.userId, userData.token));
		});
	};

	const handleCategoryChange = (cat) => {
		let updateCategory = newDish["dish type"];
		updateCategory = updateCategory == cat ? "" : cat;
		setnewDish({
			...newDish,
			["dish type"]: updateCategory,
		});
	};
	const handleCuisineChange = (cat) => {
		let updateCuisine = newDish["dish category"];
		updateCuisine = updateCuisine == cat ? "" : cat;
		setnewDish({
			...newDish,
			["dish category"]: updateCuisine,
		});
	};

	return (
		<div>
			<Modal
				open={props.modal}
				onClose={() => {
					props.updateModal(false);
					setnewDish({});
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="menu__add__main">
					<div className="upload__container">
						{newDish.images && newDish.images?.length != 0 ? (
							<img
								style={{ objectFit: "cover" }}
								src={newDish?.images[0]}
							/>
						) : (
							<Avatar>
								<ImageIcon />
							</Avatar>
						)}
						<label htmlFor="contained-button-file">
							<input
								accept="image/*"
								id="contained-button-file"
								multiple
								type="file"
								accept="image/*"
								hidden
								onChange={fileChangedHandler}
							/>
							<Button variant="contained" component="span">
								Upload
							</Button>
						</label>
					</div>
					<TextField
						color="primary"
						variant="filled"
						label="Name"
						value={newDish.name}
						onChange={(e) =>
							setnewDish({
								...newDish,
								name: e.target.value,
							})
						}
						focused
					/>

					<TextField
						color="primary"
						variant="filled"
						label="Description"
						value={newDish.description}
						onChange={(e) =>
							setnewDish({
								...newDish,
								description: e.target.value,
							})
						}
						focused
					/>
					<TextField
						color="primary"
						variant="filled"
						label="Ingredients"
						value={newDish.Ingredients}
						onChange={(e) =>
							setnewDish({
								...newDish,
								Ingredients: e.target.value,
							})
						}
						focused
					/>

					<TextField
						type="number"
						color="primary"
						variant="filled"
						label="Price ($)"
						placeholder="MAX $100.00"
						value={newDish.price}
						onChange={handlePrice}
						focused
					/>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<InputLabel id="demo-simple-select-label">
							Category
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={
								newDish["dish type"] ? newDish["dish type"] : ""
							}
							label="Category"
							renderValue={(selected) => selected}
							onChange={(e) =>
								handleCategoryChange(e.target.value)
							}
						>
							{userData.categories
								.slice(1, userData.categories.length)
								.map((category) => (
									<MenuItem key={category} value={category}>
										<Checkbox
											checked={
												newDish["dish type"] == category
											}
										/>
										<ListItemText primary={category} />
									</MenuItem>
								))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<InputLabel id="demo-simple-select-label">
							Cuisine
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={
								newDish["dish category"]
									? newDish["dish category"]
									: ""
							}
							label="Cuisine"
							renderValue={(selected) => selected}
							onChange={(e) =>
								handleCuisineChange(e.target.value)
							}
						>
							{userData.cuisine.map((category) => (
								<MenuItem key={category} value={category}>
									<Checkbox
										checked={
											newDish["dish category"] == category
										}
									/>
									<ListItemText primary={category} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						variant="contained"
						style={{ paddingTop: "10px" }}
						onClick={handleSubmit}
					>
						Save Details
					</Button>
				</Box>
			</Modal>
		</div>
	);
};

export const EditDishModal = (props) => {
	const [updateDish, setupdateDish] = useState(props.dish);
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (props.dish != {}) setupdateDish(props.dish);
	}, [props]);

	const fileChangedHandler = (event) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];

			var reader = new FileReader();

			reader.onloadend = function (e) {
				setupdateDish({
					...updateDish,
					images: [reader.result],
					imageFile: file,
				});
			};

			reader.readAsDataURL(file);
		}
	};

	const handlePrice = (e) => {
		if (e.target.value.length > 1 && e.target.value[0] == "0")
			return setupdateDish({ ...updateDish, price: 0 });
		e.target.value >= 0 &&
			e.target.value < 100 &&
			setupdateDish({
				...updateDish,
				price: e.target.value,
			});
	};
	const handleSubmit = () => {
		console.log(updateDish);
		const formData = new FormData();
		formData.append("Ingredients", updateDish.Ingredients);
		formData.append("description", updateDish.description);
		formData.append("dish category", updateDish["dish category"]);
		formData.append("dish type", updateDish["dish type"]);
		formData.append("name", updateDish.name);
		formData.append("price", updateDish.price);
		formData.append("restaurant_id", updateDish.restaurant_id);
		formData.append("image", updateDish.imageFile);
		formData.append("imageKey", updateDish.imageKey);
		formData.append("_id", updateDish._id);
		dispatch(editDishToMenu(formData, userData.token)).then(() => {
			props.updateModal(false);
			dispatch(getMenu(userData.userId, userData.token));
		});
	};
	const handleCategoryChange = (cat) => {
		let updateCategory = updateDish["dish type"];
		updateCategory = updateCategory == cat ? "" : cat;
		setupdateDish({
			...updateDish,
			["dish type"]: updateCategory,
		});
	};
	const handleCuisineChange = (cat) => {
		let updateCuisine = updateDish["dish category"];
		updateCuisine = updateCuisine == cat ? "" : cat;
		setupdateDish({
			...updateDish,
			["dish category"]: updateCuisine,
		});
	};
	console.log(updateDish);
	return (
		<div>
			<Modal
				open={props.modal}
				onClose={() => {
					props.updateModal(false);
					setupdateDish({});
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="menu__add__main">
					<div className="upload__container">
						{updateDish.images && updateDish.images?.length != 0 ? (
							<img
								style={{ objectFit: "cover" }}
								src={updateDish?.images[0]}
							/>
						) : (
							<Avatar>
								<ImageIcon />
							</Avatar>
						)}
						<label htmlFor="contained-button-file">
							<input
								accept="image/*"
								id="contained-button-file"
								multiple
								type="file"
								accept="image/*"
								hidden
								onChange={fileChangedHandler}
							/>

							<Button variant="contained" component="span">
								Upload
							</Button>
						</label>
					</div>
					<TextField
						color="primary"
						variant="filled"
						label="Name"
						value={updateDish.name}
						onChange={(e) =>
							setupdateDish({
								...updateDish,
								name: e.target.value,
							})
						}
						focused
					/>

					<TextField
						color="primary"
						variant="filled"
						label="Description"
						value={updateDish.description}
						onChange={(e) =>
							setupdateDish({
								...updateDish,
								description: e.target.value,
							})
						}
						focused
					/>

					<TextField
						color="primary"
						variant="filled"
						label="Ingredients"
						value={updateDish.Ingredients}
						onChange={(e) =>
							setupdateDish({
								...updateDish,
								Ingredients: e.target.value,
							})
						}
						focused
					/>

					<TextField
						type="number"
						color="primary"
						variant="filled"
						label="Price ($)"
						placeholder="MAX $100.00"
						value={updateDish.price}
						onChange={handlePrice}
						focused
					/>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<InputLabel id="demo-simple-select-label">
							Category
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={
								updateDish["dish type"]
									? updateDish["dish type"]
									: ""
							}
							label="Category"
							renderValue={(selected) => selected}
							onChange={(e) =>
								handleCategoryChange(e.target.value)
							}
						>
							{userData.categories
								.slice(1, userData.categories.length)
								.map((category) => (
									<MenuItem key={category} value={category}>
										<Checkbox
											checked={
												updateDish["dish type"] ==
												category
											}
										/>
										<ListItemText primary={category} />
									</MenuItem>
								))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<InputLabel id="demo-simple-select-label">
							Cuisine
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={
								updateDish["dish category"]
									? updateDish["dish category"]
									: ""
							}
							label="Cuisine"
							renderValue={(selected) => selected}
							onChange={(e) =>
								handleCuisineChange(e.target.value)
							}
						>
							{userData.cuisine.map((category) => (
								<MenuItem key={category} value={category}>
									<Checkbox
										checked={
											updateDish["dish category"] ==
											category
										}
									/>
									<ListItemText primary={category} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						variant="contained"
						style={{ paddingTop: "10px" }}
						onClick={handleSubmit}
					>
						Save Details
					</Button>
				</Box>
			</Modal>
		</div>
	);
};

export const BasicDetailsModal = (props) => {
	const [updatedBasicDetails, setupdatedBasicDetails] = useState(
		props.basicDetails
	);
	const userData = useSelector((state) => state.user);
	console.log(updatedBasicDetails);
	const dispatch = useDispatch();

	const handleSubmit = () => {
		console.log(updatedBasicDetails);
		dispatch(
			updateBasicDetailsRest(
				updatedBasicDetails,
				userData.userId,
				userData.token
			)
		).then(async () => {
			await dispatch(getUser(userData.userId, userData.token));
			props.updateModal(false);
		});
	};

	return (
		<Modal
			open={props.modal}
			onClose={() => {
				props.updateModal(false);
				setupdatedBasicDetails({});
			}}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box className="menu__basic__main">
				<div className="rest__basic__item rest__name__container">
					<InputLabel id="demo-simple-select-label">
						Restaurant Name
					</InputLabel>
					<TextField
						color="primary"
						variant="filled"
						placeholder="Enter name"
						value={updatedBasicDetails?.name}
						onChange={(e) =>
							setupdatedBasicDetails({
								...updatedBasicDetails,
								name: e.target.value,
							})
						}
						focused
					/>
				</div>
				<div className="rest__basic__item rest__timings__container">
					<InputLabel id="demo-simple-select-label">
						Restaurant Timings
					</InputLabel>
					<div className="time__to__from">
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								label="From"
								value={updatedBasicDetails.timeFrom}
								onChange={(newValue) => {
									setupdatedBasicDetails({
										...updatedBasicDetails,
										timeFrom: new Date(
											newValue
										).toISOString(),
									});
								}}
								renderInput={(params) => (
									<TextField {...params} />
								)}
							/>
						</LocalizationProvider>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<TimePicker
								label="To"
								value={new Date(updatedBasicDetails?.timeTo)}
								onChange={(newValue) => {
									setupdatedBasicDetails({
										...updatedBasicDetails,
										timeTo: new Date(
											newValue
										).toISOString(),
									});
								}}
								renderInput={(params) => (
									<TextField {...params} />
								)}
							/>
						</LocalizationProvider>
					</div>
				</div>
				<div className="rest__basic__item rest__description__container">
					<InputLabel id="demo-simple-select-label">
						Restaurant Description
					</InputLabel>
					<TextField
						color="primary"
						variant="filled"
						placeholder="Enter description"
						value={updatedBasicDetails?.description}
						onChange={(e) =>
							setupdatedBasicDetails({
								...updatedBasicDetails,
								description: e.target.value,
							})
						}
						focused
					/>
				</div>
				<Button
					variant="contained"
					style={{ paddingTop: "10px" }}
					onClick={handleSubmit}
				>
					Save Details
				</Button>
			</Box>
		</Modal>
	);
};

export const ContactDetailsModal = (props) => {
	const [updatedContactDetails, setupdatedContactDetails] = useState(
		props.contactDetails
	);
	const userData = useSelector((state) => state.user);
	console.log(updatedContactDetails);
	const dispatch = useDispatch();
	const handleContactNumber = (value) => {
		if (value.length <= 10)
			setupdatedContactDetails({
				...updatedContactDetails,
				contact: value,
			});
	};

	const handleSubmit = () => {
		dispatch(
			updateContactDetailsRest(
				updatedContactDetails,
				userData.userId,
				userData.token
			)
		).then(async () => {
			await dispatch(getUser(userData.userId, userData.token));
			props.updateModal(false);
		});
	};

	return (
		<Modal
			open={props.modal}
			onClose={() => {
				props.updateModal(false);
				setupdatedContactDetails({});
			}}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box className="menu__basic__main">
				<div className="contact__main__container">
					<InputLabel id="demo-simple-select-label">
						Contact number
					</InputLabel>
					<TextField
						type="number"
						color="primary"
						variant="filled"
						placeholder="Enter a 10 digit number"
						value={updatedContactDetails.contact}
						onChange={(e) => handleContactNumber(e.target.value)}
						focused
					/>
				</div>
				<FormControl className="country__select__container">
					<Select
						labelId="demo-simple-select-standard-label"
						id="demo-simple-select-standard"
						className="country__select__dropdown"
						value={updatedContactDetails.country}
						onChange={(e) =>
							setupdatedContactDetails({
								...updatedContactDetails,
								country: e.target.value,
							})
						}
						label="Age"
					>
						{userData.locations?.map((location) => (
							<MenuItem value={location}>{location}</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button
					variant="contained"
					style={{ paddingTop: "10px" }}
					onClick={handleSubmit}
				>
					Save Details
				</Button>
			</Box>
		</Modal>
	);
};
