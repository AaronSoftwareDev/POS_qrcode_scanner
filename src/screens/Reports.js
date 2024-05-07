import {
  Container,
  Table,
  Card,
  Image,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Reports() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([{ id: 0, username: "All" }]);

  // const handleUserSelection = (user) => {
  //   setSelectedUser(user);
  // };
  const handleUserSelection = (user) => {
    setSelectedUser(user.username === "All" ? null : user);
  };

  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dbUsername = searchParams.get("dbUsername");
  const isAuthenticated = useSelector((state) => state.cart.isAuthenticated);
  const navigate = useNavigate();

  function generateRandomText(length) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomText = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomText += alphabet.charAt(randomIndex);
    }

    return randomText;
  }

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/Login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const randomValue = Math.floor(Math.random() * 1000); // Adjust the
        const randomText = generateRandomText(5);

        const reportResponse = await fetch(
          `${apiUrl}/report.php?${randomText}=${randomValue}`
        );
        const userResponse = await fetch(
          `${apiUrl}/getUser.php?${randomText}=${randomValue}`
        );
        const loginUser = await fetch(
          `${apiUrl}/getLoginUser.php?${randomText}=${randomValue}`
        );
        console.log("new login user data", loginUser);

        if (!reportResponse.ok || !userResponse.ok) {
          throw new Error("Network response was not ok.");
        }

        const reportJsonData = await reportResponse.json();
        const userJsonData = await userResponse.json();
        const loginUserJsonData = await loginUser.json();
        console.log("this is the login users data hello", userJsonData);
        const userOptions = userJsonData.map((user) => ({
          id: user.id,
          username: user.username,
        }));
        setUserOptions(userOptions);
        setUserData(loginUserJsonData);

        // Use the selectedUser to filter data
        const filteredData = selectedUser
          ? reportJsonData.filter(
              (item) => item.Login_user === selectedUser.username
            )
          : reportJsonData;

        // setData(filteredData);
        console.log("filtered data all", reportJsonData);
        setData(filteredData);
        console.log("filtered data", userData);

        localStorage.setItem("reportsData", JSON.stringify(filteredData));
        localStorage.setItem("userData", JSON.stringify(userJsonData));

        const confirmedOrders = filteredData.filter(
          (item) => item.is_processed === "Printed"
        );

        const confirmedTotalAmount = confirmedOrders.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );

        setTotalAmount(confirmedTotalAmount);
      } catch (error) {
        console.error("There was a problem fetching data:", error);
      }
    };

    fetchData();
  }, [selectedUser]); // Empty dependency array ensures the effect runs only once
  // const [userOptions, setUserOptions] = useState([]);
  // const [selectedUser, setSelectedUser] = useState(null);

  // const handleUserSelection = (user) => {
  //   setSelectedUser(user);
  // };
  const printReport = () => {
    const doc = new jsPDF();

    const imgData = "images/logo.png";
    doc.addImage(imgData, "png", 80, 10, 60, 50); // Centered image

    const username =
      userData.length > 0 ? userData[0].username : "No cashier has logged in";
    doc.text(`Cashier Login - ${username}`, 10, 70);

    const currentDate = new Date().toLocaleDateString(); // Get current date
    doc.text(`Date: ${currentDate}`, 10, 80); // Display current date

    const headers = [
      "#",
      "Name",
      "Price",
      "Quantity",
      "Table number",
      "Order time",
      "Order number",
      "Status",
      "Cashier",
    ];

    const confirmedOrders = data.filter(
      (item) => item.is_processed === "Printed"
    );

    const confirmedTotalAmount = confirmedOrders.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );

    setTotalAmount(confirmedTotalAmount);

    const tableData = data.map((item, index) => [
      index + 1,
      item.name,
      item.price,
      item.quantity,
      item.qr_code,
      item.order_time,
      item.Order_num,
      item.is_processed.toString(),
      item.first_name + " " + item.last_name,
    ]);

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 90,
    });

    const totalAmountY = doc.autoTable.previous.finalY + 10;

    doc.text(
      `Total Amount of Confirmed Orders: K${confirmedTotalAmount.toFixed(2)}`,
      10,
      totalAmountY
    );

    doc.save("report.pdf");
  };

  return (
    <Container>
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title>
            <Image src="images/logo.png" width={150} height={100} />
          </Card.Title>
          <Card.Title>
            <Card.Title>
              <span style={{ fontSize: "1.5em", color: "#198754" }}>
                Today Report
              </span>
              <br />
              Current Cashier -{" "}
              {userData.length > 0
                ? userData[0].username
                : "No cashier has logged in"}
            </Card.Title>
          </Card.Title>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Cashier
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    handleUserSelection({ id: 0, username: "All" })
                  }
                >
                  All
                </Dropdown.Item>
                {userOptions.map((user) => (
                  <Dropdown.Item
                    key={user.id}
                    onClick={() => handleUserSelection(user)}
                  >
                    {user.username}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="success" onClick={printReport}>
              Print Report
            </Button>
            <Link to="/Supervisor">
              <Button variant="danger">Back</Button>
            </Link>
          </div>

          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Table number</th>
                <th>Order time</th>
                <th>Order date</th>
                <th>Order number</th>
                <th>Status</th>
                <th>Cashier</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>K{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.qr_code}</td>
                  <td>{item.order_time}</td>
                  <td>{item.order_date}</td>
                  <td>{item.Order_num}</td>
                  <td>{item.is_processed.toString()}</td>
                  <td>
                    {item.first_name} {item.last_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-right">
            <strong>Total Amount of Confirmed Orders:</strong> K
            {totalAmount.toFixed(2)}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Reports;
