import React from "react";
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
const Welcome = () => {
  return (
    <Container style={{ alignContent: "center" }}>
      <Row style={{ marginBottom: "20px" }}>
        <Col className="text-center" style={{ marginTop: 20 }}>
          <Image src="/home/images/logo.png" width={150} height={100} />
        </Col>
      </Row>
      <Row style={{ marginBottom: "5px" }}>
        <Col className="text-center">
          <h3>Meal Ordering System</h3>
          <p>Scan the QR code on the table to place an order.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
