import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { IconContext } from "react-icons";

const FetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getImageUrl = (url) => {
    // Use the replace method to replace the substring
    const newPath = url.replace("", "");

    // return newPath;
    return newPath;
  };

  const getProducts = () => {
    setIsLoading(true);
    const apiUrl = "";
    const randomQueryParam = "?random=${Math.random()}"; //prevent caching
    fetch(apiUrl + randomQueryParam, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);

        alert("Failing to fetch records: Check your network connectivity!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteProduct = () => {
    fetch("", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div>{isLoading && <h4>Fetching Records...</h4>}</div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Product Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>
                {" "}
                <img
                  src={getImageUrl(product.imageUrl)}
                  width={80}
                  height={50}
                />
              </td>
              <td>{product.productName}</td>
              <td>{product.productCategory}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
export default FetchProducts;
