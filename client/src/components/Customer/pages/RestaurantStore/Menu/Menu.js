import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import "./Menu.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getMenu } from "../../../../../redux/actions/CustomerActions";

const Menu = (props) => {
  const userData = useSelector((state) => state.user);
  const customerData = useSelector((state) => state.customer);
  const params = useParams();
  const dispatch = useDispatch();

  const [menu, setmenu] = useState([]);

	useEffect(()=>{ if (params.rid != "")
			dispatch(getMenu(params.rid, userData.token)).then(() =>
        setmenu(customerData.menu)
      )},[])

  useEffect(() => {
    setmenu(customerData.menu);
  }, [customerData]);

  console.log(customerData, userData);
  return (
    <div className="menu-main">
      {menu.map((dish) => (
        <Card className="card-main" onClick={() => props.modal(dish)}>
          <CardContent>
            <div className="card__container">
              <Typography
                variant="body2"
                color="text.secondary"
                className="card__content__container__cus__menu"
              >
                <div className="card_content__body">
                  <div>
                    <p>{dish.name}</p>
                  </div>
                  <div>
                    <div className="card__description">{dish.description}</div>
                  </div>
                  <div>
                    <p>{dish.price}</p>
                  </div>
                </div>
              </Typography>

              <CardMedia
                className="card__image"
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
  );
};

export default Menu;
