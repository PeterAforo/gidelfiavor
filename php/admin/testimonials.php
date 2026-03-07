<?php
$pageTitle = 'Testimonials';
require_once '../config/config.php';
requireLogin();

$db = Database::getInstance();
$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$message = '';
$error = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitize($_POST['name'] ?? '');
    $role = sanitize($_POST['role'] ?? '');
    $content = sanitize($_POST['content'] ?? '');
    $image_url = sanitize($_POST['image_url'] ?? '');
    
    if (empty($name) || empty($content)) {
        $error = 'Name and content are required';
    } else {
        $data = [
            'name' => $name,
            'role' => $role,
            'content' => $content,
            'image_url' => $image_url
        ];
        
        if ($action === 'edit' && $id > 0) {
            $db->update('testimonials', $data, 'id = :id', ['id' => $id]);
            $message = 'Testimonial updated successfully';
        } else {
            $db->insert('testimonials', $data);
            $message = 'Testimonial added successfully';
        }
        $action = 'list';
    }
}

// Handle delete
if ($action === 'delete' && $id > 0) {
    $db->delete('testimonials', 'id = ?', [$id]);
    $message = 'Testimonial deleted successfully';
    $action = 'list';
}

// Get testimonial for editing
$testimonial = null;
if ($action === 'edit' && $id > 0) {
    $testimonial = $db->fetchOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
}

// Get all testimonials
$testimonials = $db->fetchAll("SELECT * FROM testimonials ORDER BY created_at DESC");

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
    <!-- Testimonials List -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">Testimonials</h4>
        <a href="?action=add" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i> Add Testimonial
        </a>
    </div>
    
    <div class="row g-4">
        <?php if (!empty($testimonials)): ?>
            <?php foreach ($testimonials as $t): ?>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-start">
                            <img src="<?php echo $t['image_url'] ?: 'https://placehold.co/60x60/E5E7EB/9CA3AF?text=Avatar'; ?>" 
                                 alt="<?php echo sanitize($t['name']); ?>" 
                                 class="rounded-circle me-3" width="60" height="60" style="object-fit: cover;">
                            <div class="flex-grow-1">
                                <h6 class="mb-0"><?php echo sanitize($t['name']); ?></h6>
                                <small class="text-muted"><?php echo sanitize($t['role']); ?></small>
                                <p class="mt-2 mb-0 small">"<?php echo sanitize($t['content']); ?>"</p>
                            </div>
                        </div>
                        <div class="mt-3 d-flex gap-2">
                            <a href="?action=edit&id=<?php echo $t['id']; ?>" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-pencil"></i> Edit
                            </a>
                            <a href="?action=delete&id=<?php echo $t['id']; ?>" class="btn btn-sm btn-outline-danger btn-delete">
                                <i class="bi bi-trash"></i> Delete
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
                        No testimonials yet
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
    
    <?php else: ?>
    <!-- Add/Edit Form -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0"><?php echo $action === 'edit' ? 'Edit Testimonial' : 'Add Testimonial'; ?></h4>
        <a href="testimonials.php" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i> Back to List
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <form method="POST">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Name *</label>
                        <input type="text" class="form-control" name="name" 
                               value="<?php echo $testimonial['name'] ?? ''; ?>" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Role/Title</label>
                        <input type="text" class="form-control" name="role" 
                               value="<?php echo $testimonial['role'] ?? ''; ?>" placeholder="e.g. Pastor, Business Owner">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Testimonial Content *</label>
                        <textarea class="form-control" name="content" rows="4" required><?php echo $testimonial['content'] ?? ''; ?></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Photo URL</label>
                        <input type="url" class="form-control" name="image_url" 
                               value="<?php echo $testimonial['image_url'] ?? ''; ?>">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i> 
                            <?php echo $action === 'edit' ? 'Update Testimonial' : 'Add Testimonial'; ?>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
