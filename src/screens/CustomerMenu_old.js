import { useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Accordion,
  Navbar,
  Card,
  Image,
} from "react-bootstrap";
import { Route, Link } from "react-router-dom";
import CategoryMenu from "../components/CategoryMenu";
import MenuItemList from "../components/MenuItemList";
import { useDispatch } from "react-redux";
import ShoppingCart from "./ShoppingCart";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faBreadSlice,
  faCoffee,
  faGlassWater,
  faIceCream,
  faPlateWheat,
} from "@fortawesome/free-solid-svg-icons";
import { addTable } from "../redux/cartSlice";

import { useParams } from "react-router-dom";
const CustomerMenu = () => {
  const { tableId } = useParams();
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [tablenNum, setTablenNum] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const isMounted = useRef(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleButtonClick = () => {
    setButtonDisabled(true);
  };
  const handleButtonClick2 = () => {
    setButtonDisabled(false);
  };

  const handleConfirmOrder = () => {
    // Logic for confirming order
    setButtonsDisabled(true);
  };

  const handleMakeAnotherOrder = () => {
    // Logic for making another order
    setButtonsDisabled(false);
  };

  useEffect(() => {
    setTablenNum("T12");
    dispatch(addTable("T12"));

    const handleBeforeUnload = (event) => {
      // when page is refreshed, ask for confirmation when the order is not yet confirmed
      // it can get deleted
      const message =
        "Are you sure you want to refresh or leave page? Changes you made may not be saved";
      event.returnValue = message; // Standard for most browsers
      return message; // For some older browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Define your categories and menu items here.
  const categories = [
    "Hot Bevarages",
    "Breakfast",
    "Cold drinks",
    "Wraps and Pies",
    "Sweet Stuff",
  ];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    handleShow();
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

  const fetchData_ordernum = async () => {
    try {
      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);
      console.log(apiUrl);

      const response = await fetch(
        `${apiUrl}/ordernum.php?${randomText}=${randomValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const jsonData = await response.json();
      if (jsonData === "" || jsonData === null) {
        setData("...loading");
      } else {
        setData(jsonData);
      }

      console.log(
        "the data from the use effect" + JSON.stringify(jsonData, null, 2)
      );
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      // Run your code only on the initial mount
      fetchData_ordernum();
      isMounted.current = false;
    }
  }, []);

  const handleAddToCart = (item) => {
    const itemInCart = cartItems.find((x) => x.name === item.name);

    console.log("item availability: " + itemInCart);

    if (itemInCart !== undefined) {
      //update qty

      let newcartItems = cartItems;

      newcartItems.map((x) => {
        if (x.name === newcartItems.name) {
          x.count = x.count + 1;
          newcartItems.count = newcartItems.count + 1;
        }
      });

      console.log(newcartItems);

      setCartItems(newcartItems);
    } else {
      //add new
      item.count = 1;
      setCartItems((prevCartItems) => [...prevCartItems, item]);
    }
  };

  const handleRemoveFromCart = (item) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((cartItem) => cartItem !== item)
    );
  };

  return (
    <Container style={{ alignContent: "center" }}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MenuItemList
            items={menuItems[selectedCategory] || []}
            onAddToCart={handleAddToCart}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Row style={{ marginBottom: "20px" }}>
        <Col className="text-center" style={{ marginTop: 20 }}>
          <Image src="/home/images/logo.png" width={150} height={100} />
        </Col>
      </Row>
      <Row style={{ marginBottom: "5px" }}>
        <Col className="text-center">
          <h3>Meal Ordering System</h3>
          <p>
            Click any of the categories below to select order items. You can
            select from more than one category.
          </p>
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px" }}>
        <Col className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleSelectCategory("Hot Bevarages")}
            style={{ marginBottom: "5px" }}
            disabled={isButtonDisabled}
          >
            <FontAwesomeIcon icon={faCoffee} /> Hot Bevarages{" "}
          </Button>{" "}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleSelectCategory("Breakfast")}
            style={{ marginBottom: "5px" }}
            disabled={isButtonDisabled}
          >
            <FontAwesomeIcon icon={faBreadSlice} /> Breakfast{" "}
          </Button>{" "}
          <Button
            variant="success"
            size="lg"
            onClick={() => handleSelectCategory("Cold drinks")}
            style={{ marginBottom: "5px" }}
            disabled={isButtonDisabled}
          >
            <FontAwesomeIcon icon={faGlassWater} disabled={isButtonDisabled} />{" "}
            Cold drinks
          </Button>{" "}
          <Button
            variant="warning"
            size="lg"
            onClick={() => handleSelectCategory("Wraps and Pies")}
            style={{ marginBottom: "5px" }}
            disabled={isButtonDisabled}
          >
            <FontAwesomeIcon icon={faBowlFood} /> Wraps and Pies
          </Button>{" "}
          <Button
            variant="danger"
            size="lg"
            onClick={() => handleSelectCategory("Sweet Stuff")}
            style={{ marginBottom: "5px" }}
            disabled={isButtonDisabled}
          >
            <FontAwesomeIcon icon={faIceCream} /> Sweet Stuff
          </Button>{" "}
          {/* <Link to="/imagemanager">Image Manager</Link> */}
          {/*
            <Button variant="info">Info</Button>{" "}
            <Button variant="light">Light</Button>{" "}
            <Button variant="dark">Dark</Button>
        */}
        </Col>
      </Row>

      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <ShoppingCart
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onOrderConfirmation={fetchData_ordernum}
            tableData={tableId}
            orderNumData={data}
            onButtonClick={handleButtonClick}
            onButtonClick2={handleButtonClick2}
            onConfirmOrder={handleConfirmOrder}
            onMakeAnotherOrder={handleMakeAnotherOrder}
            buttonsDisabled={buttonsDisabled}
          />
          {/*
             <MenuItemList
            items={menuItems[selectedCategory] || []}
            onAddToCart={handleAddToCart}
          />

            */}
        </Col>
        <Col md={3}>
          {/*
            <ShoppingCart
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
          />
            */}
        </Col>
      </Row>
    </Container>
  );
};
export default CustomerMenu;
