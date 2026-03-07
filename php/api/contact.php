<?php
/**
 * Contact Form API Endpoint
 */
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Invalid request method'], 405);
}

$name = sanitize($_POST['name'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$phone = sanitize($_POST['phone'] ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($message)) {
    jsonResponse(['success' => false, 'message' => 'Please fill in all required fields'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid email address'], 400);
}

try {
    $db = Database::getInstance();
    
    $db->insert('contact_messages', [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message,
        'created_at' => date('Y-m-d H:i:s')
    ]);
    
    // Optional: Send email notification
    // mail(SITE_EMAIL, "New Contact: $subject", $message, "From: $email");
    
    jsonResponse(['success' => true, 'message' => 'Message sent successfully!']);
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Failed to send message. Please try again.'], 500);
}
