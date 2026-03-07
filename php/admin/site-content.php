<?php
$pageTitle = 'Site Content';
require_once '../config/config.php';
requireLogin();

$db = Database::getInstance();
$message = '';
$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'hero_title' => sanitize($_POST['hero_title'] ?? ''),
        'hero_subtitle' => sanitize($_POST['hero_subtitle'] ?? ''),
        'about_bio' => sanitize($_POST['about_bio'] ?? ''),
        'about_portrait' => sanitize($_POST['about_portrait'] ?? ''),
        'contact_email' => sanitize($_POST['contact_email'] ?? ''),
        'contact_phone' => sanitize($_POST['contact_phone'] ?? ''),
        'contact_address' => sanitize($_POST['contact_address'] ?? ''),
        'social_instagram' => sanitize($_POST['social_instagram'] ?? ''),
        'social_linkedin' => sanitize($_POST['social_linkedin'] ?? ''),
        'social_twitter' => sanitize($_POST['social_twitter'] ?? ''),
        'social_facebook' => sanitize($_POST['social_facebook'] ?? '')
    ];
    
    $existing = $db->fetchOne("SELECT id FROM site_content LIMIT 1");
    
    if ($existing) {
        $db->update('site_content', $data, 'id = :id', ['id' => $existing['id']]);
    } else {
        $db->insert('site_content', $data);
    }
    
    $message = 'Site content updated successfully';
}

// Get current content
$content = $db->fetchOne("SELECT * FROM site_content LIMIT 1") ?? [];

require_once 'includes/admin-header.php';
?>

<div class="container-fluid py-4">
    <?php if ($message): ?>
    <div class="alert alert-success alert-dismissible fade show">
        <?php echo $message; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    <?php endif; ?>
    
    <div class="card">
        <div class="card-body">
            <form method="POST">
                <!-- Hero Section -->
                <h5 class="mb-3">Hero Section</h5>
                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label class="form-label">Hero Title</label>
                        <input type="text" class="form-control" name="hero_title" 
                               value="<?php echo $content['hero_title'] ?? ''; ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Hero Subtitle</label>
                        <textarea class="form-control" name="hero_subtitle" rows="2"><?php echo $content['hero_subtitle'] ?? ''; ?></textarea>
                    </div>
                </div>
                
                <hr>
                
                <!-- About Section -->
                <h5 class="mb-3">About Section</h5>
                <div class="row g-3 mb-4">
                    <div class="col-12">
                        <label class="form-label">About Bio</label>
                        <textarea class="form-control" name="about_bio" rows="4"><?php echo $content['about_bio'] ?? ''; ?></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Portrait Image URL</label>
                        <input type="url" class="form-control" name="about_portrait" 
                               value="<?php echo $content['about_portrait'] ?? ''; ?>">
                    </div>
                </div>
                
                <hr>
                
                <!-- Contact Info -->
                <h5 class="mb-3">Contact Information</h5>
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="contact_email" 
                               value="<?php echo $content['contact_email'] ?? ''; ?>">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Phone</label>
                        <input type="text" class="form-control" name="contact_phone" 
                               value="<?php echo $content['contact_phone'] ?? ''; ?>">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Address</label>
                        <input type="text" class="form-control" name="contact_address" 
                               value="<?php echo $content['contact_address'] ?? ''; ?>">
                    </div>
                </div>
                
                <hr>
                
                <!-- Social Links -->
                <h5 class="mb-3">Social Media Links</h5>
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <label class="form-label">Instagram</label>
                        <input type="url" class="form-control" name="social_instagram" 
                               value="<?php echo $content['social_instagram'] ?? ''; ?>">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">LinkedIn</label>
                        <input type="url" class="form-control" name="social_linkedin" 
                               value="<?php echo $content['social_linkedin'] ?? ''; ?>">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Twitter/X</label>
                        <input type="url" class="form-control" name="social_twitter" 
                               value="<?php echo $content['social_twitter'] ?? ''; ?>">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Facebook</label>
                        <input type="url" class="form-control" name="social_facebook" 
                               value="<?php echo $content['social_facebook'] ?? ''; ?>">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle me-2"></i> Save Changes
                </button>
            </form>
        </div>
    </div>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
