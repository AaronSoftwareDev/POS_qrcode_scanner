// MenuItemList.js
import React, { useState } from "react";
import { ListGroup, Image } from "react-bootstrap";
import SelectedItemIndicator from "./SelectedItemIndicator";

const MenuItemList = ({ items, onAddToCart }) => {
  return (
    <ListGroup>
      {items.map((item, index) => (
        <ListGroup.Item
          key={index}

          /*
          onClick={() => {
            onAddToCart(item);
          }}*/
        >
          {index + 1}.{" "}
          <img
            src={item.imageUrl} // Make sure this path is correct
            alt={item.name}
            style={{
              width: 65,
              height: 65,
              marginBottom: 8,
              marginRight: 8,
              alignSelf: "flex-start",
            }}
          />
          {"   "}
          {item.name} - K{item.price}
          <SelectedItemIndicator itemObj={item} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default MenuItemList;
