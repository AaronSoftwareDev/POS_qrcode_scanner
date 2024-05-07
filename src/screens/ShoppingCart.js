// ShoppingCart.js
import React, { useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faBreadSlice,
  faCoffee,
  faGlassWater,
  faIceCream,
  faPlateWheat,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  addNewItem,
  addTable,
} from "../redux/cartSlice";

const ShoppingCart = (props) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [isConfirmed, setIsConfimed] = useState(false);
  let orderNumber = props.orderNumData.order_num;
  let formattedOrderNumber;

  if (orderNumber !== undefined) {
    orderNumber = orderNumber.toString();
    formattedOrderNumber = `EC${orderNumber.padStart(3, "0")}`;
  }
  const handleClick = () => {
    // Send data to the parent component
    props.onButtonClick();
  };
  const handleClick2 = () => {
    // Send data to the parent component
    props.onButtonClick2();
  };

  function generateRandomText(length) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomText = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomText += alphabet.charAt(randomIndex);
    }

    return randomText;
  }

  //create a formatted array for shopping cart to show name and quantity
  const nameQtytArr = cartItems.reduce((accumulator, currentObject) => {
    const existingNames = accumulator.find(
      (item) => item.name === currentObject.name
    );

    if (existingNames) {
      // If the category already exists in the accumulator, increment the quantity
      existingNames.quantity += 1;
    } else {
      // If the category does not exist, add a new entry to the accumulator
      accumulator.push({
        name: currentObject.name,
        price: currentObject.price,
        quantity: 1,
        qr_code: props.tableData,
        Order_num: formattedOrderNumber,
      });
    }

    return accumulator;
  }, []);

  const orderTotal = () => {
    var total = 0;
    nameQtytArr.map((x) => {
      var price = x.price;
      var qty = x.quantity;
      total = total + price * qty;
    });
    // console.log(nameQtytArr);
    return total;
  };

  const orderStatus = () => {
    if (cartItems.length > 0)
      return isConfirmed === false ? " (Pending Confirmation)" : " (Confirmed)";
    return "";
  };

  const onConfirmOrder = () => {
    handleClick();
    const confirmed = window.confirm(
      "Are you sure you want to confirm your order?"
    );
    if (confirmed) {
      // const dataToSend = [
      //   { id: 4, name: "John", price: 3, quantity: 3, qr_code: "ABC114" },
      // ];
      const datatable = props.tableData;
      console.log("your props" + datatable);

      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);

      // const data = nameQtytArr;
      //process order
      fetch(`${apiUrl}/storeorderlist.php?${randomText}=${randomValue}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nameQtytArr), // Convert data to JSON string
      })
        .then((response) => {
          console.log(JSON.stringify("object being sent" + nameQtytArr));
          // Handle the response from PHP
          // You can check response.ok and response.status here
          // Maybe perform some actions based on the response

          console.log("Data sent successfully");
          // console.log("json data" + JSON.stringify(dataToSend));
        })
        .catch((error) => {
          // Handle error here
          console.error("There was an error:", error);
        });

      console.log(nameQtytArr);
      setIsConfimed(true);
    }
  };

  const displayCartMessage = () => {
    if (parseInt(cartItems.length) <= 0) {
      return <p>You have not selected any item(s) for order...</p>;
    } else if (!isConfirmed) {
      return (
        <p>
          You have selected {cartItems.length} item(s). Click on confirm order
          button once you have selected all the items!
        </p>
      );
    } else {
      return <p>Your order was successfully confirmed!</p>;
    }
  };

  const onRemoveFromCart = (item) => {
    dispatch(removeItem(item.name));
  };

  const handleClearCart = () => {
    // Show a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to clear all items on the order list?"
    );
    if (confirmed) dispatch(clearCart());
  };

  const handleClearCartNew = () => {
    props.onOrderConfirmation();
    handleClick2();
    // Show a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to make another order?"
    );
    if (confirmed) {
      dispatch(clearCart());
      setIsConfimed(false);
    }
  };

  // Now, formattedOrderNumber will be in the format EC001, EC002, ..., EC012

  return (
    <>
      <div style={divStyle}>
        <div className="text-center">
          <span>Table: {props.tableData}</span>

          <h5>
            Your Order{orderStatus()} {formattedOrderNumber}
          </h5>
          {displayCartMessage()}
        </div>
        <div>
          <ListGroup>
            {nameQtytArr.map((item, index) => (
              <ListGroup.Item key={index}>
                <span style={{ fontSize: "12px" }}>
                  {index + 1}. {item.name} (K{item.price} x {item.quantity})
                </span>
                &nbsp;
                {!isConfirmed && (
                  <Button
                    style={buttonStyle}
                    variant="outline-danger"
                    onClick={() => onRemoveFromCart(item)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div>
          {cartItems.length > 0 && !isConfirmed && (
            <div className="text-center">
              <div style={{ margin: 10 }}>
                <h6>Order Total: K{orderTotal()}</h6>
              </div>
              <Button
                variant="success"
                style={{ margin: 10 }}
                onClick={() => onConfirmOrder()}
              >
                Confirm Order
              </Button>
              <Button
                variant="danger"
                onClick={() => handleClearCart()}
                style={{ margin: 10 }}
              >
                Clear All
              </Button>
            </div>
          )}
          {isConfirmed && (
            <div className="text-center">
              <div style={{ margin: 10 }}>
                <h6>Order Total: K{orderTotal()}</h6>
              </div>
              <Button
                variant="success"
                onClick={() => handleClearCartNew()}
                style={{ margin: 10 }}
              >
                Make another order
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;

const divStyle = {
  border: "1px solid green", // 2px solid black border
  padding: "10px", // Optional: Add padding for better visibility
  borderRadius: "10px" /* Apply border radius */,
  padding: "10px",
};

const cartFontSize = {};

const buttonStyle = {
  padding: "0.02rem 0.4rem", // Adjust the padding to make the button smaller
  fontSize: "0.70rem", // Adjust the font size for a smaller text
};
