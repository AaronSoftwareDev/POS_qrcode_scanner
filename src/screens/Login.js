import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/cartSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      email: email.trim(),
      password: password.trim(),
    };

    // Log the received password for debugging
    console.log("Password sent to server:", data.password);

    fetch(`${apiUrl}/Auth.php`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);
        if (data.error) {
          alert(data.error);
        } else if (
          data.userRole &&
          (data.userRole === "supervisor" ||
            data.userRole === "cashier" ||
            data.userRole === "admin")
        ) {
          localStorage.setItem("dbUsername", data.dbUsername);
          console.log("this is the user", data.dbUsername);

          // Add a new fetch API call if the userRole is "cashier"
          if (data.userRole === "cashier") {
            fetch(`${apiUrl}/userRole.php`, {
              method: "POST",
              body: JSON.stringify({ username: data.dbUsername }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((userData) => {
                if (userData.success) {
                  console.log("Username inserted into user_data table");
                } else {
                  console.error(
                    "Failed to insert username into user_data table"
                  );
                }
              })
              .catch((error) => {
                console.error("There was an error!", error.message);
              });
          }

          dispatch(
            loginSuccess({
              userRole: data.userRole,
              dbUsername: data.dbUsername,
            })
          );

          const redirectUrl =
            data.userRole === "admin" ? "/Admin" : data.redirectUrl;

          navigate(redirectUrl, {
            state: {
              dbUsername: data.dbUsername,
              redirectUrl: data.redirectUrl,
            },
          });
        } else {
          alert("Invalid user role or unexpected response from the server");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit} className="p-4 shadow">
            <div className="mb-4">
              <Image
                src="images/logo.png"
                width={100}
                height={80}
                className="mx-auto d-block"
              />
            </div>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="email"
                placeholder="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="text-center" style={{ marginTop: "4px" }}>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
