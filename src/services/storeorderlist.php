<?php
// Enable CORS
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specified HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specified headers

// No caching headers
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Content-Type: application/json");
// Assuming you have a db_connection.php file for connecting to your database
include 'db_connection.php';
error_log("Received request method: " . $_SERVER['REQUEST_METHOD']);

// Set the time zone to 'Africa/Lusaka'
date_default_timezone_set('Africa/Lusaka');

// Check if data is sent using POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Access the posted data
  $postData = json_decode(file_get_contents("php://input"), true); // Use json_decode for raw JSON data

  // Do something with the received data
  if (!empty($postData)) {
    // Here you can process the received data, for example:
    foreach ($postData as $object) {
      // Access each object's properties
      $name = $object['name'];
      $price = $object['price'];
      $quantity = $object['quantity'];
      $qr_code = $object['qr_code'];
      $is_processed = 'No'; // Default value
      $is_cancelled = 'No'; // Default value
      $order_date = date("Y-m-d"); // Current date as default
      $order_time = date("H:i:s"); // Current time
      $order_num = $object['Order_num'];

      // Insert data into the neworders table
      $sql = "INSERT INTO neworders (name, price, quantity, qr_code, is_processed, is_cancelled, order_date, order_time,Order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
      $stmt = $conn->prepare($sql);
      $stmt->bind_param("sdsssssss", $name, $price, $quantity, $qr_code, $is_processed, $is_cancelled, $order_date, $order_time,$order_num);

      // Execute the statement
      if ($stmt->execute()) {
        echo "Data inserted successfully. Name: $name, Price: $price, Quantity: $quantity, qr_Code: $qr_code\n";
      } else {
        echo "Error inserting data.\n";
      }

      // Close the statement
      $stmt->close();
    }
  } else {
    echo 'No data received.';
  }
} else {
  echo 'Invalid request method.';
}
?>
