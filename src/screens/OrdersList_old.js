import React, { useState, useEffect } from "react";
import {
  Container,
  ListGroup,
  Card,
  Button,
  Image,
  Modal,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
const OrdersList = () => {
  //window.location.reload();
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderPrint, setSelectedOrderPrint] = useState(null);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [loginUser, setLoginUser] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentDate, setCurrentDate] = useState(new Date());
  const isAuthenticated = useSelector((state) => state.cart.isAuthenticated);
  const isUser = useSelector((state) => state.cart.dbUsername);
  // // setLoginUser(isUser);
  // console.log("is user from the store just now", loginUser);
  const [showModal, setShowModal] = useState(false);
  const [modalContentPrinted, setModalContentPrinted] = useState(false);

  const [confirmationState, setConfirmationState] = useState({});
  const handleButton1Click = (orderNum) => {
    setConfirmationState((prevConfirmationState) => ({
      ...prevConfirmationState,
      [orderNum]: true,
    }));
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/Login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDateWithoutTime = new Date();
      currentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight
      setCurrentDate(currentDateWithoutTime);
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  function generateRandomText(length) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomText = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomText += alphabet.charAt(randomIndex);
    }

    return randomText;
  }

  const fetchData = async () => {
    const randomValue = Math.floor(Math.random() * 1000); // Adjust the
    const randomText = generateRandomText(5);

    try {
      const response = await fetch(
        `${apiUrl}/neworders.php?${randomText}=${randomValue}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const jsonData = await response.json();

      setData(jsonData);
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  };

  const handleClick = async (selectedOrder) => {
    try {
      const orderData = {
        orders: selectedOrder,
        isUser: isUser, // Include isUser in the payload
      };
      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);

      const response = await fetch(
        `${apiUrl}/updateorder.php?${randomText}=${randomValue}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      console.log("Order processed successfully");
      console.log(JSON.stringify(orderData));
    } catch (error) {
      console.error("There was an error processing the order:", error);
    }
  };

  useEffect(() => {
    console.log("url" + apiUrl);
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Group items by Order_num
  const groupedData = data.reduce((acc, item) => {
    const key = item.Order_num;
    const existingOrder = acc.find((order) => order.Order_num === key);

    if (!existingOrder) {
      acc.push({
        Order_num: key,
        orders: [item],
      });
    } else {
      existingOrder.orders.push(item);
    }
    return acc;
  }, []);
  const printModalContent = () => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent) {
      const orderNum = selectedOrder && selectedOrder[0]?.Order_num;
      const tableNum = selectedOrder && selectedOrder[0]?.qr_code;

      const printWindow = window.open(
        "",
        "PrintWindow",
        "width=800,height=600"
      );
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              @media print {
                body * {
                  visibility: visible;
                }
                #modal-content {
                  position: relative;
                }
                .order-num {
                  display: none;
                }
                /* Add any necessary print-specific styles here */
              }
            </style>
          </head>
          <body>
            <div style="position: relative; text-align: center;">
              <img src="images/logo.png" width="150" height="100" style="align-self: center;" />
              <div style="text-align: center; margin-top: 10px;">
                Order Number: ${orderNum}
              </div>
              <div style="text-align: center; margin-top: 10px;">
              Table: ${tableNum}
            </div>
              <div style="font-size: 10px;">${modalContent.innerHTML}</div>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();

      setModalContentPrinted(true);
      setShowModal(false);
    }
  };

  const handleClick_print = async () => {
    try {
      if (!selectedOrder) {
        return;
      }

      const orderNum = selectedOrder[0].Order_num;
      const ordersToUpdate = data.filter(
        (order) => order.Order_num === orderNum
      );

      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);

      const response = await fetch(
        `${apiUrl}/updateorder_2.php?${randomText}=${randomValue}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ordersToUpdate),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      setShowModal(true);

      setData((prevData) =>
        prevData.filter((order) => order.Order_num !== orderNum)
      );
    } catch (error) {
      console.error("There was an error processing the order:", error);
    }
  };
  const handlePrintButtonClick = () => {
    if (!modalContentPrinted) {
      handleClick_print();
      printModalContent();
    }
  };
  useEffect(() => {
    setModalContentPrinted(false);
  }, [showModal]);

  return (
    <Container>
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title>
            <Image src="images/logo.png" width={150} height={100} />
          </Card.Title>
          <Card.Title>
            <span style={{ fontSize: "1.5em", color: "#198754" }}>
              Order List
            </span>
            <br />
            Current Cashier - {isUser}
          </Card.Title>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            {" "}
            <Link to="/login">
              <Button variant="danger">Logout</Button>
            </Link>
          </div>

          {groupedData.map((group, index) => (
            <div
              key={index}
              style={{
                marginBottom: "15px",
                backgroundColor: "#f2f2f2",
                borderRadius: "8px",
                padding: "15px",
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <div
                className="order-num"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {group.Order_num}
              </div>

              {group.orders.map((row, rowIndex) => (
                <ListGroup horizontal key={rowIndex}>
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      flex: "1",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff",
                      position: "relative",
                    }}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{row.name}</div>K{row.price} x{" "}
                      {row.quantity} {row.qr_code}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              ))}

              <div
                style={{
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <Button
                  style={{
                    marginLeft: "5px",
                    height: "50px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOrder(group.orders);
                    handleClick(group.orders);
                    handleButton1Click(group.Order_num);
                  }}
                  variant="outline-primary"
                  disabled={confirmationState[group.Order_num]}
                >
                  Confirm
                </Button>{" "}
                <Button
                  style={{
                    marginLeft: "5px",
                    height: "50px",
                  }}
                  onClick={() => {
                    setSelectedOrder(group.orders);
                    setShowModal(true);
                  }}
                  variant="outline-success"
                  disabled={!confirmationState[group.Order_num]}
                >
                  Print
                </Button>{" "}
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <Image
              src="images/logo.png"
              width={150}
              height={100}
              className="mx-auto d-block"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="modal-content">
          {selectedOrder && (
            <div>
              {selectedOrder.flat().map((item, index) => (
                <div key={index}>
                  <p>Item: {item.name}</p>
                  <p>
                    Price: K{item.price} x {item.quantity}
                  </p>

                  <hr />
                </div>
              ))}
            </div>
          )}
          <p className="text-end fw-bold">
            Sum Total : K
            {selectedOrder &&
              selectedOrder
                .flat()
                .reduce((total, item) => total + item.price * item.quantity, 0)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handlePrintButtonClick}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersList;
