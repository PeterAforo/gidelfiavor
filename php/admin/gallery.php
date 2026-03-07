<?php
$pageTitle = 'Gallery';
require_once '../config/config.php';
requireLogin();

$db = Database::getInstance();
$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$message = '';
$error = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $image_url = sanitize($_POST['image_url'] ?? '');
    $caption = sanitize($_POST['caption'] ?? '');
    
    if (empty($image_url)) {
        $error = 'Image URL is required';
    } else {
        $data = [
            'image_url' => $image_url,
            'caption' => $caption
        ];
        
        if ($action === 'edit' && $id > 0) {
            $db->update('gallery', $data, 'id = :id', ['id' => $id]);
            $message = 'Image updated successfully';
        } else {
            $db->insert('gallery', $data);
            $message = 'Image added successfully';
        }
        $action = 'list';
    }
}

// Handle delete
if ($action === 'delete' && $id > 0) {
    $db->delete('gallery', 'id = ?', [$id]);
    $message = 'Image deleted successfully';
    $action = 'list';
}

// Get image for editing
$image = null;
if ($action === 'edit' && $id > 0) {
    $image = $db->fetchOne("SELECT * FROM gallery WHERE id = ?", [$id]);
}

// Get all images for listing
$images = $db->fetchAll("SELECT * FROM gallery ORDER BY created_at DESC");

require_once 'includes/admin-header.php';
?>

<div class="container-fluid py-4">
    <?php if ($message): ?>
    <div class="alert alert-success alert-dismissible fade show">
        <?php echo $message; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    <?php endif; ?>
    
    <?php if ($error): ?>
    <div class="alert alert-danger alert-dismissible fade show">
        <?php echo $error; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    <?php endif; ?>
    
    <?php if ($action === 'list'): ?>
    <!-- Gallery List -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">Gallery Images</h4>
        <a href="?action=add" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i> Add Image
        </a>
    </div>
    
    <div class="row g-4">
        <?php if (!empty($images)): ?>
            <?php foreach ($images as $img): ?>
            <div class="col-md-4 col-lg-3">
                <div class="card">
                    <img src="<?php echo $img['image_url']; ?>" class="card-img-top" alt="Gallery" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <p class="card-text small text-muted"><?php echo sanitize($img['caption'] ?: 'No caption'); ?></p>
                        <div class="d-flex gap-2">
                            <a href="?action=edit&id=<?php echo $img['id']; ?>" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-pencil"></i>
                            </a>
                            <a href="?action=delete&id=<?php echo $img['id']; ?>" class="btn btn-sm btn-outline-danger btn-delete">
                                <i class="bi bi-trash"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center text-muted py-5">
                        No images in gallery
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
    
    <?php else: ?>
    <!-- Add/Edit Form -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0"><?php echo $action === 'edit' ? 'Edit Image' : 'Add New Image'; ?></h4>
        <a href="gallery.php" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i> Back to Gallery
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <form method="POST">
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Image URL *</label>
                        <input type="url" class="form-control" name="image_url" 
                               value="<?php echo $image['image_url'] ?? ''; ?>" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Caption</label>
                        <input type="text" class="form-control" name="caption" 
                               value="<?php echo $image['caption'] ?? ''; ?>">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i> 
                            <?php echo $action === 'edit' ? 'Update Image' : 'Add Image'; ?>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
