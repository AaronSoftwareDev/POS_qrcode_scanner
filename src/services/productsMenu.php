<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Content-Type: application/json");
// Assuming you have a db_connection.php file for connecting to your database
include 'db_connection.php';
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from the database
$sql = "SELECT * FROM `products`";
$result = $conn->query($sql);

// Initialize an associative array to store products by category
$productsByCategory = array();

// Iterate through the result set
while ($row = $result->fetch_assoc()) {
    $category = $row['ProductCategory'];
    $imageUrl = $row['imageUrl'];
    $name = $row['ProductName'];
    $price = (float)$row['price'];

    // Add product details to the category array
    $productsByCategory[$category][] = array(
        'imageUrl' => $imageUrl,
        'name' => $name,
        'price' => $price,
        'selectedQty' => 0,
    );
}

// Close the database connection
$conn->close();


// Make sure every category is present in the output
$allCategories = array_unique(array_column($productsByCategory, 'category'));
foreach ($allCategories as $category) {
    if (!isset($productsByCategory[$category])) {
        $productsByCategory[$category] = array();
    }
}

// Convert the associative array to JSON
$jsonData = json_encode($productsByCategory, JSON_PRETTY_PRINT);

// Output the JSON data
header('Content-Type: application/json');
echo $jsonData;

?>
