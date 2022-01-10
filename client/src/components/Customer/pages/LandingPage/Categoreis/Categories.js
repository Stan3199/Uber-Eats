import React, { useState, useEffect } from "react";
import './Categories.css'
const Categories = () => {
	const categories = [
		{
			name: "Deals",
			imgSrc: "https://d4p17acsd5wyj.cloudfront.net/shortcuts/deals.png",
		},
		{
			name: "Grocery",
			imgSrc: "https://d4p17acsd5wyj.cloudfront.net/shortcuts/uber_grocery.png",
		},
		{
			name: "Convinience",
			imgSrc: "https://d4p17acsd5wyj.cloudfront.net/shortcuts/convenience.png",
		},
		{
			name: "Alcohol",
			imgSrc: "https://d4p17acsd5wyj.cloudfront.net/shortcuts/alcohol.png",
		},
	];

	return (
        <>
		<div className="main-categories">
			{categories.map((category) => (
				<div className="category__body">
					<img src={category.imgSrc} />
					{category.name}
				</div>
			))}
		</div>
        <hr />
        </>
	);
};

export default Categories;
