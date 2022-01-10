import React, { useEffect, useState } from "react";
import "./Profile.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CakeIcon from "@mui/icons-material/Cake";
import EditIcon from "@mui/icons-material/Edit";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  updateUserPhoto,
} from "../../../../redux/actions/UserActions";
import { updateCustomerData } from "../../../../redux/actions/CustomerActions";
import swal from "sweetalert";
const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  const [showEditModal, setshowEditModal] = useState(false);
  const [showphotoModal, setshowphotoModal] = useState(false);
  const [userPhoto, setuserPhoto] = useState({});
  const [userUpdated, setUserUpdated] = useState({});
  const countryList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas ",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory ",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands ",
    "Central African Republic ",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands ",
    "Colombia",
    "Comoros ",
    "Congo (the Democratic Republic of the)",
    "Congo ",
    "Cook Islands ",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic ",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands  [Malvinas]",
    "Faroe Islands ",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories ",
    "Gabon",
    "Gambia ",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See ",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic ",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands ",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands ",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger ",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands ",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines ",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation ",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan ",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands ",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates ",
    "United Kingdom of Great Britain and Northern Ireland ",
    "United States Minor Outlying Islands ",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands",
  ];
  const userDetails = {
    name: "Piyush Nautiyal",
    dateofBirth: "03/31/1999",
    city: "CityA",
    state: "StateA",
    country: "CountryA",
    nickName: "Stan",
  };

  useEffect(() => {
    console.log(userData);
    userDetails != {} && setUserUpdated(userData);
  }, userData);

  const fileChangedHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      var reader = new FileReader();

      reader.onloadend = function (e) {
        setuserPhoto(file);
        setUserUpdated({
          ...userUpdated,
          details: {
            ...userUpdated.details,
            profilepic: reader.result,
          },
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpdate = () => {
    const formData = new FormData();
    formData.append("_id", userData.userId);
    formData.append("image", userPhoto);
    formData.append("imageKey", userUpdated.details?.imageKey);
    dispatch(updateUserPhoto(formData, userData.token)).then(() => {
      dispatch(getUser(userData.userId, userData.token));
      setshowphotoModal(false);
    });
  };

  const handleUserDetailsSave = () => {
    if (
      !userUpdated.userName ||
      !userUpdated.details.dob ||
      !userUpdated.details.city ||
      !userUpdated.details.state ||
      !userUpdated.details.country
    ) {
      console.log(userUpdated);
      return swal("Data Missing");
    }
    dispatch(updateCustomerData(userData.userId, userUpdated, userData.token)).then(()=>{
		setshowEditModal(false)
	});
  };

  return (
    <div
      className="profile__main"
      style={{ display: Object.keys(userUpdated).length == 0 && "none" }}
    >
      <Modal
        open={showphotoModal}
        onClose={() => {
          setUserUpdated(userData);
          setshowphotoModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="photo__box__main">
          {userUpdated.details?.profilepic ? (
            <img
              style={{ objectFit: "cover" }}
              src={userUpdated.details?.profilepic}
            />
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
      <Modal
        open={showEditModal}
        onClose={() => setshowEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="profile__box__main">
          <TextField
            color="error"
            variant="filled"
            label="Name"
            value={userUpdated.userName}
            onChange={(e) =>
              setUserUpdated({
                ...userUpdated,
                userName: e.target.value,
              })
            }
            focused
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Date of birth"
              inputFormat="dd/MM/yyyy"
              value={userUpdated.details?.dob}
              onChange={(newValue) => {
                console.log(newValue);
                setUserUpdated({
                  ...userUpdated,
                  details: {
                    ...userUpdated.details,
                    dob: newValue.toString(),
                  },
                });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            color="error"
            variant="filled"
            label="City"
            value={userUpdated.details?.city}
            onChange={(e) =>
              setUserUpdated({
                ...userUpdated,
                details: {
                  ...userUpdated.details,
                  city: e.target.value,
                },
              })
            }
            focused
          />
          <TextField
            color="error"
            variant="filled"
            label="State"
            value={userUpdated.details?.state}
            onChange={(e) =>
              setUserUpdated({
                ...userUpdated,
                details: {
                  ...userUpdated.details,
                  state: e.target.value,
                },
              })
            }
            focused
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            {console.log(userUpdated)}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userUpdated.details?.country}
              label="Country"
              onChange={(e) => {
                console.log(e.target.value);
                setUserUpdated({
                  ...userUpdated,
                  details: {
                    ...userUpdated.details,
                    country: e.target.value,
                  },
                });
              }}
            >
              {countryList.map((country) => (
                <MenuItem value={country}>{country}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            color="error"
            variant="filled"
            label="Nick name"
            value={userUpdated.details?.nickname}
            onChange={(e) =>
              setUserUpdated({
                ...userUpdated,
                details: {
                  ...userUpdated.details,
                  nickname: e.target.value,
                },
              })
            }
            focused
          />
          <Button
            variant="contained"
            style={{ paddingTop: "10px" }}
            onClick={handleUserDetailsSave}
          >
            Save Details
          </Button>
        </Box>
      </Modal>
      <div className="profile__left__section">
        <div className="profile__photo__container">
          {userUpdated.details?.profilepic ? (
            <img
              style={{ objectFit: "cover" }}
              src={userUpdated.details?.profilepic}
              onClick={() => setshowphotoModal(true)}
            />
          ) : (
            <AccountBoxIcon
              className="profile__photo"
              onClick={() => setshowphotoModal(true)}
            />
          )}
          <div className="profile__item profile__firstName">
            {userUpdated.userName + " (" + userUpdated.details?.nickname + ")"}
            <div
              className="profile__edit"
              onClick={() => setshowEditModal(true)}
            >
              <EditIcon />
            </div>
          </div>
        </div>
        <div className="profile__information">
          <div className="profile__item profile_dob">
            <CakeIcon />
            {userUpdated.details?.dob}
          </div>
          <div className="profile__item">
            <LocationCityIcon />
            <div className="profile__location">
              <div className="location__primary"></div>
              {userUpdated.details?.city + ", " + userUpdated.details?.state}
              <div className="location__country">
                {userUpdated.details?.country}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__right__section">
        <div className="user__options">
          <div className="options__item favorites__section__main">
            <Link to="/Favorites"> Favorites</Link>
          </div>
          <div className="options__item orders__section__main">
            <Link to="/Orders">Orders</Link>
          </div>
        </div>
        <div className="about__section">
          <h1>About</h1>
          <p>This is user about. Wonderful user, stop please</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
