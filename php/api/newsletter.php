<?php
/**
 * Newsletter Subscription API Endpoint
 */
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Invalid request method'], 405);
}

$email = sanitize($_POST['email'] ?? '');

// Validation
if (empty($email)) {
    jsonResponse(['success' => false, 'message' => 'Please enter your email address'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid email address'], 400);
}

try {
    $db = Database::getInstance();
    
    // Check if email already exists
    $existing = $db->fetchOne("SELECT id FROM newsletter_subscribers WHERE email = ?", [$email]);
    
    if ($existing) {
        jsonResponse(['success' => false, 'message' => 'This email is already subscribed'], 400);
    }
    
    $db->insert('newsletter_subscribers', [
        'email' => $email,
        'subscribed_at' => date('Y-m-d H:i:s')
    ]);
    
    jsonResponse(['success' => true, 'message' => 'Thank you for subscribing!']);
    
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Failed to subscribe. Please try again.'], 500);
}
