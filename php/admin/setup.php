<?php
/**
 * Admin Setup - Creates admin user if not exists
 * DELETE THIS FILE AFTER SETUP!
 */
require_once '../config/config.php';

$message = '';
$error = '';

try {
    $db = Database::getInstance();
    
    // Check if admin user exists
    $existing = $db->fetchOne("SELECT id FROM admin_users WHERE username = 'admin'");
    
    if ($existing) {
        // Update password
        $hash = password_hash('admin123', PASSWORD_DEFAULT);
        $db->query("UPDATE admin_users SET password = ? WHERE username = 'admin'", [$hash]);
        $message = "Admin password has been reset to 'admin123'";
    } else {
        // Create admin user
        $hash = password_hash('admin123', PASSWORD_DEFAULT);
        $db->insert('admin_users', [
            'username' => 'admin',
            'password' => $hash,
            'email' => 'admin@gidelfiavor.com'
        ]);
        $message = "Admin user created successfully!";
    }
} catch (Exception $e) {
    $error = "Error: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Setup</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body text-center p-5">
                        <h3 class="mb-4">Admin Setup</h3>
                        
                        <?php if ($message): ?>
                        <div class="alert alert-success">
                            <?php echo $message; ?>
                        </div>
                        <p class="mb-3">
                            <strong>Username:</strong> admin<br>
                            <strong>Password:</strong> admin123
                        </p>
                        <a href="login.php" class="btn btn-primary">Go to Login</a>
                        <?php endif; ?>
                        
                        <?php if ($error): ?>
                        <div class="alert alert-danger">
                            <?php echo $error; ?>
                        </div>
                        <?php endif; ?>
                        
                        <hr class="my-4">
                        <p class="text-danger small">
                            <strong>Security Warning:</strong> Delete this file (setup.php) after logging in!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
