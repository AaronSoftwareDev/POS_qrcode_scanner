<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Content-Type: application/json");

include 'db_connection.php';
error_log("Received request method: " . $_SERVER['REQUEST_METHOD']);

// Check if data is sent using POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Access the posted data
  $postData = json_decode(file_get_contents("php://input"), true); // Use json_decode for raw JSON data

  // Do something with the received data
  if (!empty($postData['ID'])) {
    $ID = $postData['ID'];
    $ProductName = $postData['ProductName'];
    $ProductCategory = $postData['ProductCategory'];
    $price = $postData['productPrice'];
   

    // Update the products table based on the ID
    $sql = "UPDATE products SET ProductName = ?, ProductCategory = ?, price = ? WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $ProductName, $ProductCategory, $price, $ID);

    // Execute the statement
    if ($stmt->execute()) {
      echo json_encode(array("message" => "Product updated successfully.", "data" => $postData));
    } else {
      echo json_encode(array("message" => "Error updating product."));
    }

    // Close the statement
    $stmt->close();
  } else {
    echo json_encode(array("message" => "Invalid data received."));
  }
} else {
  echo json_encode(array("message" => "Invalid request method."));
}
?>
