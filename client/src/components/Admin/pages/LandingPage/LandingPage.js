import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Divider,
	Modal,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { BasicDetailsModal, ContactDetailsModal } from "../../Modals/Modals";
import { useDispatch, useSelector } from "react-redux";
import {
	getUser,
	logOutUser,
	updateUserPhoto,
} from "../../../../redux/actions/UserActions";
import { Box } from "@mui/system";

const LandingPage = () => {
	const [basicModal, setbasicModal] = useState(false);
	const [contactModal, setcontactModal] = useState(false);
	const [showphotoModal, setshowphotoModal] = useState(false);
	const [restImage, setrestImage] = useState(null);
	const [restImageBinary, setrestImageBinary] = useState(null);
	const userData = useSelector((state) => state.user);
	const dispatch = useDispatch();

	console.log(userData);
	useEffect(() => {
		setrestImage(userData.details?.profilepic);
	}, [userData]);

	const handleBasicEdit = (e) => {
		e.preventDefault();
		setbasicModal(true);
	};

	const handleContactModal = (e) => {
		e.preventDefault();
		setcontactModal(true);
	};
	const handleLogOut = () => {
		dispatch(logOutUser(userData.token));
	};

	const handlePhotoUpdate =async () => {
		const formData = new FormData();
		console.log(userData);
		formData.append("_id", userData.userId);
		formData.append("image", restImageBinary);
		formData.append("imageKey", userData.details?.imageKey);
		await dispatch(updateUserPhoto(formData, userData.token)).then(() => {
			dispatch(getUser(userData.userId, userData.token));
			setshowphotoModal(false);
		});
	};

	const fileChangedHandler = (event) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			var reader = new FileReader();
			reader.onloadend = function (e) {
				setrestImageBinary(file);
				setrestImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="menu__main__container">
			<Modal
				open={showphotoModal}
				onClose={() => {
					setrestImage(userData.details?.profilepic);
					setshowphotoModal(false);
				}}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="photo__box__main">
					{userData.details?.profilepic ? (
						<img className="profile__pic__img" style={{ objectFit: "cover" }} src={restImage} />
					) : (
						<AccountBoxIcon className="profile__photo" />
					)}
					<div className="upload__buttons">
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
						<Button
							variant="contained"
							component="span"
							onClick={handlePhotoUpdate}
						>
							Save
						</Button>
					</div>
				</Box>
			</Modal>
			<BasicDetailsModal
				modal={basicModal}
				basicDetails={{
					name: userData.userName,
					description: userData.details.about,
					timeFrom: userData.details.timings?.split("||")[0],
					timeTo: userData.details.timings?.split("||")[1],
				}}
				updateModal={(val) => setbasicModal(val)}
			/>
			<ContactDetailsModal
				modal={contactModal}
				contactDetails={{
					contact: parseInt(
						userData.details.contact.replace(/\D/g, "")
					),
					country: userData.details.country,
				}}
				updateModal={(val) => setcontactModal(val)}
			/>
			<div className="menu__top__container">
				<div className="item menu__header">
					<div className="home__container"> Home</div>
					<div
						className="sign__out__container"
						onClick={handleLogOut}
					>
						Log Out
					</div>
				</div>
				<div className="content-main-div">
					<div
						className="content-top"
						style={{ paddingLeft: "20px" }}
					>
						<div className="accordion__landing__main">
							<div
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography>
									<b>MEDIA</b>
								</Typography>
							</div>
							<div
								className="media__main__container"
								onClick={() => setshowphotoModal(true)}
							>
								<img
									className="restaurant__image"
									src={restImage}
									alt="Restaurant Image"
								/>
							</div>
						</div>
					</div>
					<div className="content-bottom">
						<div className="accordion__landing__main">
							<div
								aria-controls="panel1a-content"
								id="panel1a-header"
								className="accordion__header__landing"
							>
								<div>
									<b>BASIC</b>
								</div>
								<div
									className="edit__landing__container"
									onClick={handleBasicEdit}
								>
									<EditIcon />
								</div>
							</div>
							<div>
								<div className="details__main">
									<div className="details1">
										<div className="details-label">
											Restaurant Name
										</div>
										<div
											className="details-value"
											style={{ paddingTop: "10px" }}
										>
											{userData.userName}
										</div>
									</div>
									<div className="details2">
										<div className="details-label">
											Timing
										</div>
										<div
											className="details-value"
											style={{ paddingTop: "10px" }}
										>
											{userData.details?.timings &&
												new Date(
													userData.details?.timings?.split(
														"||"
													)[0]
												)
													.toISOString()
													.slice(11, -8)}{" "}
											-{" "}
											{userData.details?.timings &&
												new Date(
													userData.details?.timings?.split(
														"||"
													)[1]
												)
													.toISOString()
													.slice(11, -8)}
										</div>
									</div>
									<div className="details3">
										<div
											className="details-label"
											style={{ paddingTop: "20px" }}
										>
											Description
										</div>
										<div
											className="details-value"
											style={{ paddingTop: "10px" }}
										>
											{userData.details.about}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div style={{ paddingTop: "20px" }}>
							<div className="accordion__landing__main">
								<div
									aria-controls="panel1a-content"
									id="panel1a-header"
									className="accordion__header__landing"
								>
									<div>
										<b>Contact</b>
									</div>
									<div
										className="edit__landing__container"
										onClick={handleContactModal}
									>
										<EditIcon />
									</div>
								</div>
								<div>
									<div className="details__main">
										<div className="details1">
											<div className="details-label">
												Contact number
											</div>
											<div
												className="details-value"
												style={{ paddingTop: "10px" }}
											>
												{userData.details.contact}
											</div>
										</div>
										<div className="details2">
											<div className="details-label">
												Location
											</div>
											<div
												className="details-value"
												style={{ paddingTop: "10px" }}
											>
												{userData.details.country}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
