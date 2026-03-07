<?php
$pageTitle = 'Books';
require_once '../config/config.php';
requireLogin();

$db = Database::getInstance();
$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$message = '';
$error = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitize($_POST['title'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $cover_image = sanitize($_POST['cover_image'] ?? '');
    $tags = sanitize($_POST['tags'] ?? '');
    $purchase_link = sanitize($_POST['purchase_link'] ?? '');
    
    if (empty($title)) {
        $error = 'Title is required';
    } else {
        $data = [
            'title' => $title,
            'description' => $description,
            'cover_image' => $cover_image,
            'tags' => $tags,
            'purchase_link' => $purchase_link
        ];
        
        if ($action === 'edit' && $id > 0) {
            $db->update('books', $data, 'id = :id', ['id' => $id]);
            $message = 'Book updated successfully';
        } else {
            $db->insert('books', $data);
            $message = 'Book added successfully';
        }
        $action = 'list';
    }
}

// Handle delete
if ($action === 'delete' && $id > 0) {
    $db->delete('books', 'id = ?', [$id]);
    $message = 'Book deleted successfully';
    $action = 'list';
}

// Get book for editing
$book = null;
if ($action === 'edit' && $id > 0) {
    $book = $db->fetchOne("SELECT * FROM books WHERE id = ?", [$id]);
}

// Get all books for listing
$books = $db->fetchAll("SELECT * FROM books ORDER BY created_at DESC");

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
    <!-- Books List -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">All Books</h4>
        <a href="?action=add" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i> Add Book
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Tags</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($books)): ?>
                            <?php foreach ($books as $b): ?>
                            <tr>
                                <td>
                                    <img src="<?php echo $b['cover_image'] ?: 'https://placehold.co/50x70/E5E7EB/9CA3AF?text=Book'; ?>" 
                                         alt="Cover" width="50" height="70" style="object-fit: cover;">
                                </td>
                                <td><?php echo sanitize($b['title']); ?></td>
                                <td><small class="text-muted"><?php echo sanitize($b['tags']); ?></small></td>
                                <td><small><?php echo date('M d, Y', strtotime($b['created_at'])); ?></small></td>
                                <td>
                                    <a href="?action=edit&id=<?php echo $b['id']; ?>" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    <a href="?action=delete&id=<?php echo $b['id']; ?>" class="btn btn-sm btn-outline-danger btn-delete">
                                        <i class="bi bi-trash"></i>
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="5" class="text-center text-muted">No books found</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <?php else: ?>
    <!-- Add/Edit Form -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0"><?php echo $action === 'edit' ? 'Edit Book' : 'Add New Book'; ?></h4>
        <a href="books.php" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i> Back to List
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <form method="POST">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Title *</label>
                        <input type="text" class="form-control" name="title" 
                               value="<?php echo $book['title'] ?? ''; ?>" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Cover Image URL</label>
                        <input type="url" class="form-control" name="cover_image" 
                               value="<?php echo $book['cover_image'] ?? ''; ?>">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" rows="5"><?php echo $book['description'] ?? ''; ?></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Tags (comma separated)</label>
                        <input type="text" class="form-control" name="tags" 
                               value="<?php echo $book['tags'] ?? ''; ?>" placeholder="e.g. Marriage, Faith, Self-Help">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Purchase Link</label>
                        <input type="url" class="form-control" name="purchase_link" 
                               value="<?php echo $book['purchase_link'] ?? ''; ?>">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i> 
                            <?php echo $action === 'edit' ? 'Update Book' : 'Add Book'; ?>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
