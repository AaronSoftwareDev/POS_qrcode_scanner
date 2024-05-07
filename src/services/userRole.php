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

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $data["username"];

    try {
        // Insert the username and current time into the user_data table
        $insertSql = "INSERT INTO user_data (username, login_time, login_date) VALUES (?, NOW(), NOW())";

        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("s", $username);
        $insertStmt->execute();
        $insertStmt->close();

        $response["message"] = "Username and login time inserted into user_data table";
        echo json_encode($response);
    } catch (Exception $e) {
        // Log and return an error message
        $response["error"] = "Internal server error";
        $response["debug_info"] = ["message" => $e->getMessage()];
        echo json_encode($response);
    }
} else {
    // Invalid request method
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
