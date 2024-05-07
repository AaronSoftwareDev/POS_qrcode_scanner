<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $data["email"];
    $receivedPassword = trim($data["password"]);

    $response = array(); // Initialize an associative array for the response

    try {
        // Query to retrieve user information
        $sql = "SELECT username, password, role FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($dbUsername, $dbPassword, $userRole);

        if ($stmt->fetch()) {
            // Check if received password matches stored plain text password
            if ($receivedPassword === $dbPassword) {
                // Authentication successful

                // Update login_status to 'yes' for the logged-in user
                // $updateSql = "UPDATE users SET login_status = 'yes' WHERE username = ?";
                // $updateStmt = $conn->prepare($updateSql);
                // $updateStmt->bind_param("s", $username);
                // $updateStmt->execute();
                // $updateStmt->close();

                $response["message"] = "Login successful";
                $response["userRole"] = $userRole;
                $response["dbUsername"] = $dbUsername;

                // Add a new key to the response indicating the redirect URL
                $response["redirectUrl"] = ($userRole === "cashier") ? "/OrdersList" : "/Supervisor";
            } else {
                // Authentication failed
                $response["error"] = "Invalid password";
            }
        } else {
            // Authentication failed
            $response["error"] = "Invalid username";
            $response["debug_info"] = ["username" => $username];
        }

        $stmt->close();
    } catch (Exception $e) {
        // Log and return an error message
        $response["error"] = "Internal server error";
        $response["debug_info"] = ["message" => $e->getMessage()];
    }

    // Encode the entire response array as a JSON string
    echo json_encode($response);
} else {
    // Invalid request method
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
