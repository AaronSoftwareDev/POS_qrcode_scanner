import { faBedPulse, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faBreadSlice,
  faCoffee,
  faGlassWater,
  faIceCream,
  faPlateWheat,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from "../redux/cartSlice";

const SelectedItemIndicator = ({ itemObj }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [itemIdToUpdate, setItemIdToUpdate] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(1);

  const getExistingItemCount = () => {
    const qtyOfItems = cartItems.filter(
      (obj) => obj.name === itemObj.name
    ).length;

    //console.log(itemInStore);
    if (qtyOfItems !== undefined) {
      return qtyOfItems;
    } else {
      return 0;
    }
  };

  const handleAddItem = () => {
    console.log(itemObj);
    dispatch(addItem(itemObj));
  };

  const handleRemoveItem = () => {
    dispatch(removeItem(itemObj.name));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div style={{ fontSize: "12px", color: "green", marginLeft: 18 }}>
      {" "}
      <Button
        style={buttonStyle}
        variant="outline-danger"
        size="sm"
        onClick={() => handleRemoveItem()}
      >
        -
      </Button>{" "}
      {getExistingItemCount()}{" "}
      <Button
        style={buttonStyle}
        variant="outline-primary"
        size="sm"
        onClick={() => handleAddItem()}
      >
        +
      </Button>{" "}
      {getExistingItemCount() > 0 && <FontAwesomeIcon icon={faCheck} />}
    </div>
  );
};
export default SelectedItemIndicator;

const buttonStyle = {
  padding: "0.02rem 0.4rem", // Adjust the padding to make the button smaller
  fontSize: "0.70rem", // Adjust the font size for a smaller text
};
