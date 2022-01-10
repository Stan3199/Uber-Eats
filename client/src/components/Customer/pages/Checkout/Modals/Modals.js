import {
	Button,
	FormControl,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addAddress,
	deleteAddress,
	selectAddress,
	setUserCountry,
} from "../../../../../redux/actions/CustomerActions.js";
import DeleteIcon from "@mui/icons-material/Delete";

const locations = {
	city: ["CityA", "CityB", "CityC"],
	state: ["StateA", "StateB", "StateC"],
	country: ["CountryA", "CountryB", "CountryC"],
};
export const CountryModal = (props) => {
	const dispatch = useDispatch();

	return (
		<div>
			<Modal
				open={props.modal}
				onClose={() => props.updateModal(false)}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="location__box__main">
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<InputLabel id="demo-simple-select-label">
							Country
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={props.user.country}
							label="Country"
							onChange={(e) =>
								dispatch(setUserCountry(e.target.value))
							}
						>
							{locations.country.map((country) => (
								<MenuItem value={country}>{country}</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Modal>
		</div>
	);
};

export const DeliveryModal = (props) => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.customer);
	const handleSelectAddress = (city) => {
		dispatch(selectAddress(city));
		props.updateModal(false);
	};
	return (
		<Modal
			open={props.modal}
			onClose={() => props.updateModal(false)}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box className="location__box__main">
				<div className="add_item__container">
					<Typography
						sx={{ mt: 4, mb: 2 }}
						variant="h6"
						component="div"
					>
						Delivery Address
					</Typography>
					<DeliveryAddModal />
				</div>
				<List>
					{userData.addresses.map((city, key) => (
						<ListItem
							key={key}
							className="address_item"
							secondaryAction={
								<IconButton edge="end" aria-label="delete">
									<DeleteIcon
										onClick={() =>
											dispatch(deleteAddress(key))
										}
									/>
								</IconButton>
							}
						>
							<ListItemText
								onClick={() => handleSelectAddress(city)}
								primary={city}
							/>
						</ListItem>
					))}
				</List>
			</Box>
		</Modal>
	);
};

function DeliveryAddModal() {
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();

	const handleDeliveryAdd = () => {
		const newAddress = document.getElementById("new_address").value;
		if (newAddress.replaceAll(" ", "").length == 0) return;
		dispatch(addAddress(newAddress));
		setOpen(false);
	};
	return (
		<React.Fragment>
			<Button onClick={() => setOpen(true)}>Add address</Button>
			<Modal
				hideBackdrop
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="child-modal-title"
				aria-describedby="child-modal-description"
			>
				<Box className="location__box__main">
					<TextField
						id="new_address"
						label="Filled"
						variant="filled"
					/>

					<Button onClick={handleDeliveryAdd}>Submit</Button>
				</Box>
			</Modal>
		</React.Fragment>
	);
}

console.log(locations);
