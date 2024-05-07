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



if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // SQL query
    $sql = "SELECT * FROM  Images";
    $result = $conn->query($sql);

    // Check if the query was successful
    if ($result) {
        // Fetch data as an associative array
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Output data as JSON
        //header('Content-Type: application/json');
        echo json_encode($data);

        // Free result set
        $result->free();
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close connection
$conn->close();
