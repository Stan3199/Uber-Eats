import React, { useState, useEffect } from "react";
import "./Filter.css";
import { AccordionHOC } from "../../../../../../util/Accordion/AccordionHOC.js";
import Form from "react-bootstrap/Form";
import { Slider } from "@mui/material";
import { useDispatch } from "react-redux";
import { setFilter } from "../../../../../../redux/actions/UserActions";

const Filter = () => {
	const dispatch = useDispatch();

	const prices = ["$", "$$", "$$$", "$$$$"];

	const Dietary = ["All", "Vegetarian", "Vegan", "Non Vegeterian"];

	const handleFilter = (filter) => {
		dispatch(setFilter(filter));
	};

	return (
		<div className="filter-main">
			<div>
				<AccordionHOC title={"Dietary"}>
					<Form>
						<div className="items__container">
							{Dietary.map((item) => (
								<div className="item">
									<div key={item} className="item__main">
										<Form.Check
											type={"radio"}
											id={item}
											label={item}
										/>
									</div>
								</div>
							))}
						</div>
					</Form>
				</AccordionHOC>
			</div>
		</div>
	);
};

export default Filter;
