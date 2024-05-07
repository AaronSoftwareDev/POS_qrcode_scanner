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

// Establish a connection to your database
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// SQL query to select all rows from the neworders table
// $sql = "SELECT * FROM neworders WHERE is_processed = 'No' OR is_processed = 'Printed' OR is_processed = 'Yes' AND DATE(order_date) = CURDATE()";
$sql = "SELECT * FROM neworders WHERE (is_processed = 'No' OR is_processed = 'Printed' OR is_processed = 'Yes') AND DATE(order_date) = CURDATE()";



// Perform the query and get the result
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // Fetch rows as associative array and store in a PHP array
    $data = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    // Convert PHP array to JSON and echo the result
    echo json_encode($data);
} else {
    echo "No data found";
}

// Close the connection
mysqli_close($conn);
?>
