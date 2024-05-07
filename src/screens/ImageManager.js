import React, { useState } from "react";
import FetchProducts from "../components/FetchProducts";

function ImageManager() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("Select"); // Default category
  const [productPrice, setProductPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductCategoryChange = (e) => {
    setProductCategory(e.target.value);
  };

  const handleProductPriceChange = (e) => {
    setProductPrice(e.target.value);
  };

  const handleSave = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", productPrice);

    fetch("", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.success) {
          alert(
            "Image uploaded successfully, and information saved to database"
          );
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div>
        Product Name
        <div>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={handleProductNameChange}
          />
        </div>
        Product Category
        <div>
          {/* Use a select element for the product category dropdown */}

          <select
            value={productCategory}
            onChange={handleProductCategoryChange}
          >
            <option value="Select">---Select---</option>
            <option value="Hot Bevarages">Hot Bevarages</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Cold drinks">Cold drinks</option>
            <option value="Wraps and Pies">Wraps and Pies</option>
            <option value="Sweet Stuff">Sweet Stuff</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Product Price"
            value={productPrice}
            onChange={handleProductPriceChange}
          />
        </div>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        {/* Add a "Save" button to trigger the API call */}
        <button onClick={handleSave}>Save</button>
        {loading && <p>Uploading...</p>}
      </div>
      <div>
        <FetchProducts />
      </div>
    </>
  );
}

export default ImageManager;
