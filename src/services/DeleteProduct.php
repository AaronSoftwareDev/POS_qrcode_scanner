<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
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

    // Delete the record from the products table based on the ID
    $sql = "DELETE FROM products WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $ID);

    // Execute the statement
    if ($stmt->execute()) {
      echo json_encode(array("message" => "Product deleted successfully.", "data" => $postData));
    } else {
      echo json_encode(array("message" => "Error deleting product."));
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
