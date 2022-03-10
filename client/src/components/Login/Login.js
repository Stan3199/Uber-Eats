import {
	Button,
	FormControl,
	FormControlLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../redux/actions/UserActions";

import "./Login.css";
import swal from "sweetalert";

const Login = () => {
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [loginMehod, setloginMehod] = useState(true);
	const [userEmail, setuserEmail] = useState("");
	const [userName, setuserName] = useState("");
	const [userPassword, setuserPassword] = useState("");
	const [userrole, setuserrole] = useState("customer");
	const [userLocation, setuserLocation] = useState("US");
	const handleSignUp = () => {
		setloginMehod(!loginMehod);
	};
	const handleSubmit = async () => {
		if (loginMehod) {
			if (!userEmail || !userPassword) {
				swal("Please enter all the fields");
				return;
			}
			await dispatch(loginUser(userEmail, userPassword));
		} else {
			if (
				!userName ||
				!userEmail ||
				!userPassword ||
				!userrole ||
				!userLocation
			) {
				swal("Please enter all the fields");
				return;
			}
			await dispatch(
				registerUser(
					userName,
					userEmail,
					userPassword,
					userrole,
					userLocation
				)
			);
		}
	};

	return (
		<div className="login__main__container">
			<div className="login__main">
				<div className="uber__logo">
					<img
						className="menu--logo"
						src="https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg"
					></img>
				</div>
				<div className="login__container">
					<div className="welcome__container">
						<div className="welcome__text">
							{loginMehod == true
								? "Welcome back"
								: "Let's get started"}
						</div>
						{loginMehod == false && (
							<FormControl component="fieldset">
								<RadioGroup
									className="toggle__mode__login"
									aria-label="gender"
									defaultValue="customer"
									name="radio-buttons-group"
								>
									<div
										className="toggle__button__container__login"
										onClick={() => setuserrole("customer")}
									>
										<FormControlLabel
											className={`toggle__button__login ${
												userrole == "customer" &&
												`role__selected`
											}`}
											value="1"
											control={<Radio />}
											label="Customer"
										/>
									</div>
									<div
										className="toggle__button__container__login"
										onClick={() => setuserrole("owner")}
									>
										<FormControlLabel
											className={`toggle__button__login ${
												userrole == "owner" &&
												`role__selected`
											}`}
											value="2"
											control={<Radio />}
											label="Restaurant"
										/>
									</div>
								</RadioGroup>
							</FormControl>
						)}
						<div className="email__pass__container">
							{loginMehod == false && (
								<TextField
									id="filled-basic"
									label="Enter name"
									variant="filled"
									value={userName}
									onChange={(e) =>
										setuserName(e.target.value)
									}
								/>
							)}
							<TextField
								id="filled-basic"
								label="Enter address"
								variant="filled"
								value={userEmail}
								onChange={(e) => setuserEmail(e.target.value)}
							/>
							<TextField
								id="filled-basic"
								label="Enter password"
								variant="filled"
								type="password"
								value={userPassword}
								onChange={(e) =>
									setuserPassword(e.target.value)
								}
							/>
							{loginMehod == false && userrole == "owner" && (
								<FormControl className="country__select__container__signUp">
									<Select
										labelId="demo-simple-select-standard-label"
										id="demo-simple-select-standard"
										className="country__select__dropdown"
										value={userLocation}
										onChange={(e) =>
											setuserLocation(e.target.value)
										}
										label="Age"
									>
										{userData.locations?.map((location) => (
											<MenuItem value={location}>
												{location}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}
						</div>
						<div
							className={`error__section ${
								!userData.userFound && "showerror"
							}`}
						>
							No user found, please enter your credentials again
						</div>
						<Button className="next__button" onClick={handleSubmit}>
							Submit
						</Button>
						<div className="new_account__container">
							<div className="create__new">
								{loginMehod == true
									? "New to Uber?"
									: "Already use Uber"}
							</div>
							<div
								className="change__method"
								onClick={handleSignUp}
							>
								&nbsp;
								{loginMehod == true
									? "Create an account"
									: "Sign In"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
