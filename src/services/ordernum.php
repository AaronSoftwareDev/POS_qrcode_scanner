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
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the current date
$currentDate = date("Y-m-d");

// SQL query to select the latest order_num for the current date
$sql = "SELECT MAX(order_num) as max_order_num FROM order_num WHERE DATE(transaction_date) = '$currentDate'";
$result = mysqli_query($conn, $sql);
$maxOrderNum = 0;

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $maxOrderNum = $row['max_order_num'];
}

$newOrderNum = $maxOrderNum + 1;

// Check if there are no records for the current date
if ($maxOrderNum === null) {
    $newOrderNum = 1; // If no record exists, set order_num as 1
}

// Insert a new record with the determined order_num and the current date/time
$insertSql = "INSERT INTO order_num (transaction_date, order_num) VALUES (NOW(), '$newOrderNum')";

if (mysqli_query($conn, $insertSql)) {
    // Fetch the newly inserted record
    $selectInsertedRecord = "SELECT * FROM order_num WHERE order_num = '$newOrderNum' AND DATE(transaction_date) = '$currentDate'";
    $insertedRecordResult = mysqli_query($conn, $selectInsertedRecord);

    if ($insertedRecordResult && mysqli_num_rows($insertedRecordResult) > 0) {
        $insertedRecord = mysqli_fetch_assoc($insertedRecordResult);
        echo json_encode($insertedRecord);
    } else {
        echo json_encode("Error fetching inserted record");
    }
} else {
    echo json_encode("Error: " . $insertSql . "<br>" . mysqli_error($conn));
}

mysqli_close($conn);



