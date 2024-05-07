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
const Supervisor = () => {
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [currentDate, setCurrentDate] = useState(new Date());
  const isAuthenticated = useSelector((state) => state.cart.isAuthenticated);
  const [showModal, setShowModal] = useState(false);
  const [modalContentPrinted, setModalContentPrinted] = useState(false);
  const [confirmationState, setConfirmationState] = useState({});
  const [isCancelConfirmationVisible, setIsCancelConfirmationVisible] =
    useState(false);
  const handleCancelConfirmation = () => {
    setIsCancelConfirmationVisible(true);
  };

  const handleButton1Click = (orderNum) => {
    setConfirmationState((prevConfirmationState) => ({
      ...prevConfirmationState,
      [orderNum]: true,
    }));
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
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
    try {
      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);

      const response = await fetch(
        `${apiUrl}/neworders_supervisor.php?${randomText}=${randomValue}`
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

  const handleCancel = async (cancelledOrder) => {
    try {
      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);

      const response = await fetch(
        `${apiUrl}/cancelledOrder.php?${randomText}=${randomValue}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cancelledOrder),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      console.log("Order cancelled");
      console.log(JSON.stringify(cancelledOrder));
    } catch (error) {
      console.error("There was an error processing the order:", error);
    }
  };

  const handleCancelConfirmed = () => {
    handleCancel(cancelledOrder);
    setIsCancelConfirmationVisible(false);
  };

  const handleCancelCancelled = () => {
    setIsCancelConfirmationVisible(false);
  };
  const handleClick = async (selectedOrder) => {
    try {
      const randomValue = Math.floor(Math.random() * 1000); // Adjust the
      const randomText = generateRandomText(5);

      const response = await fetch(
        `${apiUrl}/updateorder.php?${randomText}=${randomValue}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedOrder),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      console.log("Order processed successfully");
      console.log(JSON.stringify(selectedOrder));
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
            <Link to="/Reports">
              <Button variant="primary">View Report</Button>
            </Link>
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
                  }}
                  onClick={() => {
                    setCancelledOrder(group.orders);
                    // handleCancel(group.orders);
                    handleCancelConfirmation();
                  }}
                  variant="outline-danger"
                >
                  Cancel
                </Button>{" "}
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
      <Modal show={isCancelConfirmationVisible} onHide={handleCancelCancelled}>
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
        <Modal.Body id="modal-content" style={{ textAlign: "center" }}>
          <h5>Are your sure, you want to cancel the order</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancelCancelled}>
            No
          </Button>
          <Button variant="success" onClick={handleCancelConfirmed}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Supervisor;
