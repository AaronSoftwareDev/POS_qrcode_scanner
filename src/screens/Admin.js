import React, { useState, useEffect, useMemo } from "react";
import { Container, Card, Button, Image, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import DataTable from "react-data-table-component";
import Accordion from "react-bootstrap/Accordion";
import DataTableExtensions from "react-data-table-component-extensions";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);
  const [editedData, setEditedData] = useState({
    ID: null,
    ProductName: "",
    ProductCategory: "",
    productPrice: "",
  });

  const [newProduct, setNewProduct] = useState({
    productName: "",
    productPrice: "",
    productCategory: "",
    imageUrl: "",
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/productslist.php`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const jsonData = await response.json();

      setProducts(jsonData);
      console.log("this is the data", jsonData);
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditedData({
      ID: row.ID,
      ProductName: row.ProductName,
      productPrice: row.price,
      ProductCategory: row.ProductCategory,
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/DeleteProduct.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: productId }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      // Handle success
      const result = await response.json();
      console.log("Product deleted successfully:", result);
      // Update the product list after successful deletion
      fetchData();
    } catch (error) {
      console.error("There was a problem deleting the product:", error);
    }
  };
  const handleSaveChanges = async () => {
    console.log("the updated data", editedData);
    try {
      const response = await fetch(`${apiUrl}/updateproducts.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      // Handle success
      const updatedProduct = await response.json();
      console.log("Product updated successfully:", updatedProduct);
      // Optionally, update the product list after successful update
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error("There was a problem updating the product:", error);
    }
  };
  const filteredProducts = products.filter((product) =>
    product.ProductName.toLowerCase().includes(globalFilter.toLowerCase())
  );
  const columns_table = [
    {
      name: "Product Name",
      selector: (row) => row.ProductName,
    },
    {
      name: "Product Price",
      selector: (row) => row.price,
    },
    {
      name: "Product Category",
      selector: (row) => row.ProductCategory,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {/* Edit Icon */}
          <span
            style={{ cursor: "pointer", marginRight: "10px" }}
            onClick={() => handleEdit(row)}
          >
            <FaEdit color="#007bff" />
          </span>
          {/* Delete Icon */}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(row.ID)}
          >
            <FaTrash color="red" />
          </span>
        </>
      ),
      // selector: (row) => row.year,
    },
  ];

  const data_table = [
    {
      id: 1,
      title: "Beetlejuice",
      year: "1988",
    },
    {
      id: 2,
      title: "Ghostbusters",
      year: "1984",
    },
  ];

  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.cart.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/Login");
    }
  }, [isAuthenticated, navigate]);

  const handleNewProductSubmit = async (e) => {
    console.log("the new data", newProduct);
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/CreateNewProduct.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      // Handle success
      const newProductCreated = await response.json();
      console.log("Product created successfully:", newProductCreated);
      // Optionally, update the product list after successful creation
      setShowSubmitSuccessModal(true);
      fetchData();
    } catch (error) {
      console.error("There was a problem creating the product:", error);
    }
  };

  return (
    <Container>
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title>
            <Image src="images/logo.png" width={150} height={100} />
          </Card.Title>
          <Card.Title>
            <span style={{ fontSize: "1.5em", color: "#198754" }}>
              Admin Panel
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
            <Accordion>
              <Accordion.Item eventKey="0" style={{ borderColor: "#0D6EFD" }}>
                <Accordion.Header>New Product</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleNewProductSubmit}>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        controlId="formGridEmail"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Product Name"
                          value={newProduct.productName}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              productName: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        controlId="formGridEmail"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Product Price"
                          value={newProduct.productPrice}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              productPrice: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={4}
                        controlId="formGridState"
                      >
                        <Form.Select
                          value={newProduct.productCategory} // Bind value to the state
                          onChange={
                            (e) =>
                              setNewProduct({
                                ...newProduct,
                                productCategory: e.target.value,
                              }) // Update state on change
                          }
                        >
                          <option>Category...</option>
                          <option>Hot Beverages</option>
                          <option>Breakfast</option>
                          <option>Cold drinks</option>
                          <option>Wraps and pies</option>
                          <option>Sweet Stuff</option>
                        </Form.Select>
                      </Form.Group>
                    </Row>
                    <Row
                      style={{
                        paddingLeft: "10%",
                        paddingRight: "10%",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Form.Group
                        as={Row}
                        xs={12}
                        md={4}
                        controlId="formGridEmail"
                        style={{ alignSelf: "center" }}
                      >
                        <Form.Control
                          type="text"
                          placeholder="Image URL"
                          value={newProduct.imageUrl}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Row>
                    <Button
                      variant="success"
                      type="submit"
                      style={{ marginTop: 6 }}
                    >
                      Submit
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Modal
              show={showSubmitSuccessModal}
              onHide={() => setShowSubmitSuccessModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Submit Successful</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Your product has been submitted successfully.
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowSubmitSuccessModal(false);
                    // Close the new product accordion (if needed)
                  }}
                >
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
            <Link to="/adminReports">
              <Button variant="primary" style={{ height: 55, width: 80 }}>
                Report
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="danger" style={{ height: 55, width: 80 }}>
                Logout
              </Button>
            </Link>
          </div>
          <div>
            <Form.Group as={Row}>
              <Col xs={4}>
                {" "}
                {/* This will take 40% of the width */}
                <Form.Control
                  type="text"
                  placeholder="Search by Product Name"
                  value={globalFilter}
                  // style={{ borderColor: "#0D6EFD" }}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </Col>
            </Form.Group>

            <DataTable
              title="Product List"
              columns={columns_table}
              data={filteredProducts}
              pagination
              selectableRows
              dense
            />
          </div>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display selected row data in the modal */}
          {selectedRow && (
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Product Name:
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={editedData.ProductName}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        ProductName: e.target.value,
                      })
                    }
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Product Price:
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={editedData.productPrice}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        productPrice: e.target.value,
                      })
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Product Category:
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={editedData.ProductCategory}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        ProductCategory: e.target.value,
                      })
                    }
                  />
                </Col>
              </Form.Group>

              {/* Add more form fields as needed */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Admin;
