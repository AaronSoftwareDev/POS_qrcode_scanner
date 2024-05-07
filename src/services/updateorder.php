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

include 'db_connection.php';
error_log("Received request method: " . $_SERVER['REQUEST_METHOD']);

// Check if data is sent using POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Access the posted data
  $postData = json_decode(file_get_contents("php://input"), true); // Use json_decode for raw JSON data

  // Do something with the received data
  if (!empty($postData['orders']) && isset($postData['isUser'])) {
    $isUser = $postData['isUser'];

    // Fetch first_name and last_name from users table based on username
    $userQuery = "SELECT first_name, last_name FROM users WHERE username = ?";
    $userStmt = $conn->prepare($userQuery);
    $userStmt->bind_param("s", $isUser);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows > 0) {
      $userRow = $userResult->fetch_assoc();
      $firstName = $userRow['first_name'];
      $lastName = $userRow['last_name'];

      foreach ($postData['orders'] as $order) {
        // Access object's properties
        $order_id = $order['order_id'];

        // Update the is_processed column to 'Yes' and set the login_user field to isUser
        $sql = "UPDATE neworders SET is_processed = 'Confirmed', login_user = ?, first_name = ?, last_name = ? WHERE order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $isUser, $firstName, $lastName, $order_id);

        // Execute the statement
        if ($stmt->execute()) {
          echo json_encode(array("message" => "Order processed successfully.", "data" => $postData));
        } else {
          echo json_encode(array("message" => "Error processing order."));
        }

        // Close the statement
        $stmt->close();
      }
    } else {
      echo json_encode(array("message" => "User not found."));
    }

    // Close the user statement and result
    $userStmt->close();
    $userResult->close();

  } else {
    echo json_encode(array("message" => "Invalid data received."));
  }
} else {
  echo json_encode(array("message" => "Invalid request method."));
}
?>
