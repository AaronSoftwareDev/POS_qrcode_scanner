import React, { useState, useEffect } from "react";
import {
  Container,
  ListGroup,
  Card,
  Button,
  Modal,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addUserinfor } from "../redux/cartSlice";

const ManagersView = () => {
  const location = useLocation();
  const { dbUsername, redirectUrl } = location.state || {};
  const apiUrl = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const tableNum_data1 = useSelector((state) => state.cart.userinfor);
  const tableNum_data = useSelector((state) => state.cart.tableNum);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContentPrinted, setModalContentPrinted] = useState(false);

  const isAuthenticated = useSelector((state) => state.cart.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/Login");
    }
  }, [isAuthenticated, navigate]);
  function generateRandomText(length) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomText = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomText += alphabet.charAt(randomIndex);
    }

    return randomText;
  }

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
    try {
      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);
      const response = await fetch(
        `${apiUrl}processeddata.php?${randomText}=${randomValue}`
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

  const removeProcessedOrder = (processedOrder) => {
    setData((prevData) =>
      prevData.filter(
        (order) => order.Order_num !== processedOrder[0].Order_num
      )
    );
  };

  const handleClick = async () => {
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

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/deleteUser.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      console.log("User data deleted successfully");
      // Redirect to the login page or perform any other desired action
    } catch (error) {
      console.error("There was an error deleting user data:", error);
    }
  };

  const handlePrintButtonClick = () => {
    if (!modalContentPrinted) {
      handleClick();
      printModalContent();
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    const dataToSend = tableNum_data1 || dbUsername;
    if (dataToSend) {
      dispatch(addUserinfor(dataToSend));
    }

    return () => clearInterval(intervalId);
  }, [dbUsername, tableNum_data1, dispatch]);

  const printModalContent = () => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent) {
      const orderNum = selectedOrder && selectedOrder[0]?.Order_num;

      const printContent = document.createElement("div");
      printContent.appendChild(modalContent.cloneNode(true));

      const printWindow = window.open("", "_blank");
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
              <div style="font-size: 10px;">${printContent.innerHTML}</div>
            </div>
           
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();

      printWindow.addEventListener("afterprint", () => {
        printWindow.close();
        setModalContentPrinted(true);
        setShowModal(false);
      });
    }
  };

  useEffect(() => {
    setModalContentPrinted(false);
  }, [showModal]);

  const groupedData = data.reduce((acc, item) => {
    const key = item.order_time;
    if (!acc[key]) {
      acc[key] = [];
    }

    if (acc[key].length < 4) {
      acc[key].push(item);
    } else {
      acc[key].push([item]);
    }

    return acc;
  }, {});

  return (
    <Container>
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title style={{ position: "relative" }}>
            <Image src="images/logo.png" width={150} height={100} />
          </Card.Title>
          <Card.Title>Processed Orders </Card.Title>

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
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Link>
          </div>

          {Object.keys(groupedData).map((orderTime, index) => (
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
              {groupedData[orderTime].map((row, rowIndex) => (
                <ListGroup horizontal key={rowIndex}>
                  {Array.isArray(row) ? (
                    row.map((item, itemIndex) => (
                      <ListGroup.Item
                        key={itemIndex}
                        className="d-flex justify-content-between align-items-center"
                        style={{
                          width: "calc(100% - 10px)",
                          margin: "0px 5px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          padding: "10px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          backgroundColor: "#fff",
                          position: "relative",
                        }}
                      >
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{item.name}</div>K
                          {item.price} x {item.quantity} {item.qr_code}
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item
                      key={0}
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        width: "calc(100% - 10px)",
                        margin: "0 5px",
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
                  )}
                </ListGroup>
              ))}
              <div
                style={{
                  justifyContent: "flex-end",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  style={{
                    marginLeft: "5px",
                    height: "50px",
                  }}
                  onClick={() => {
                    setSelectedOrder(groupedData[orderTime]);
                    setShowModal(true);
                  }}
                  variant="outline-success"
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

export default ManagersView;
