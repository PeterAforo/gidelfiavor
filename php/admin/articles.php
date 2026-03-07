<?php
$pageTitle = 'Articles';
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
    $content = $_POST['content'] ?? '';
    $excerpt = sanitize($_POST['excerpt'] ?? '');
    $image_url = sanitize($_POST['image_url'] ?? '');
    $category = sanitize($_POST['category'] ?? '');
    $keywords = sanitize($_POST['keywords'] ?? '');
    
    if (empty($title) || empty($content)) {
        $error = 'Title and content are required';
    } else {
        $data = [
            'title' => $title,
            'content' => $content,
            'excerpt' => $excerpt,
            'image_url' => $image_url,
            'category' => $category,
            'keywords' => $keywords,
            'published_at' => date('Y-m-d H:i:s')
        ];
        
        if ($action === 'edit' && $id > 0) {
            unset($data['published_at']);
            $db->update('articles', $data, 'id = :id', ['id' => $id]);
            $message = 'Article updated successfully';
        } else {
            $db->insert('articles', $data);
            $message = 'Article added successfully';
        }
        $action = 'list';
    }
}

// Handle delete
if ($action === 'delete' && $id > 0) {
    $db->delete('articles', 'id = ?', [$id]);
    $message = 'Article deleted successfully';
    $action = 'list';
}

// Get article for editing
$article = null;
if ($action === 'edit' && $id > 0) {
    $article = $db->fetchOne("SELECT * FROM articles WHERE id = ?", [$id]);
}

// Get all articles for listing
$articles = $db->fetchAll("SELECT * FROM articles ORDER BY published_at DESC");

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
    <!-- Articles List -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">All Articles</h4>
        <a href="?action=add" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i> Add Article
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($articles)): ?>
                            <?php foreach ($articles as $a): ?>
                            <tr>
                                <td>
                                    <img src="<?php echo $a['image_url'] ?: 'https://placehold.co/80x50/E5E7EB/9CA3AF?text=Article'; ?>" 
                                         alt="Image" width="80" height="50" style="object-fit: cover;">
                                </td>
                                <td><?php echo sanitize($a['title']); ?></td>
                                <td><span class="badge bg-primary"><?php echo sanitize($a['category'] ?: 'Uncategorized'); ?></span></td>
                                <td><small><?php echo date('M d, Y', strtotime($a['published_at'])); ?></small></td>
                                <td>
                                    <a href="?action=edit&id=<?php echo $a['id']; ?>" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    <a href="?action=delete&id=<?php echo $a['id']; ?>" class="btn btn-sm btn-outline-danger btn-delete">
                                        <i class="bi bi-trash"></i>
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="5" class="text-center text-muted">No articles found</td>
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
        <h4 class="mb-0"><?php echo $action === 'edit' ? 'Edit Article' : 'Add New Article'; ?></h4>
        <a href="articles.php" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i> Back to List
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <form method="POST">
                <div class="row g-3">
                    <div class="col-md-8">
                        <label class="form-label">Title *</label>
                        <input type="text" class="form-control" name="title" 
                               value="<?php echo $article['title'] ?? ''; ?>" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Category</label>
                        <input type="text" class="form-control" name="category" 
                               value="<?php echo $article['category'] ?? ''; ?>" placeholder="e.g. Marriage, Faith">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Excerpt</label>
                        <textarea class="form-control" name="excerpt" rows="2"><?php echo $article['excerpt'] ?? ''; ?></textarea>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Content *</label>
                        <textarea class="form-control" name="content" rows="10" required><?php echo $article['content'] ?? ''; ?></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Featured Image URL</label>
                        <input type="url" class="form-control" name="image_url" 
                               value="<?php echo $article['image_url'] ?? ''; ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Keywords (comma separated)</label>
                        <input type="text" class="form-control" name="keywords" 
                               value="<?php echo $article['keywords'] ?? ''; ?>">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i> 
                            <?php echo $action === 'edit' ? 'Update Article' : 'Publish Article'; ?>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
