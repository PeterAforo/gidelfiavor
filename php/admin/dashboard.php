<?php
$pageTitle = 'Dashboard';
require_once '../config/config.php';
requireLogin();

$db = Database::getInstance();

// Get counts
$bookCount = $db->fetchOne("SELECT COUNT(*) as count FROM books")['count'] ?? 0;
$articleCount = $db->fetchOne("SELECT COUNT(*) as count FROM articles")['count'] ?? 0;
$galleryCount = $db->fetchOne("SELECT COUNT(*) as count FROM gallery")['count'] ?? 0;
$messageCount = $db->fetchOne("SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0")['count'] ?? 0;

require_once 'includes/admin-header.php';
?>

<div class="container-fluid py-4">
    <h4 class="mb-4">Dashboard</h4>
    
    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="card bg-primary text-white">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $bookCount; ?></h3>
                            <p class="mb-0 small">Books</p>
                        </div>
                        <i class="bi bi-book" style="font-size: 2rem; opacity: 0.5;"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-success text-white">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $articleCount; ?></h3>
                            <p class="mb-0 small">Articles</p>
                        </div>
                        <i class="bi bi-file-text" style="font-size: 2rem; opacity: 0.5;"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $galleryCount; ?></h3>
                            <p class="mb-0 small">Gallery Images</p>
                        </div>
                        <i class="bi bi-images" style="font-size: 2rem; opacity: 0.5;"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-dark">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h3 class="mb-0"><?php echo $messageCount; ?></h3>
                            <p class="mb-0 small">Unread Messages</p>
                        </div>
                        <i class="bi bi-envelope" style="font-size: 2rem; opacity: 0.5;"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="row g-4">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <a href="books.php?action=add" class="btn btn-outline-primary">
                            <i class="bi bi-plus-circle me-2"></i> Add New Book
                        </a>
                        <a href="articles.php?action=add" class="btn btn-outline-primary">
                            <i class="bi bi-plus-circle me-2"></i> Add New Article
                        </a>
                        <a href="gallery.php?action=add" class="btn btn-outline-primary">
                            <i class="bi bi-plus-circle me-2"></i> Add Gallery Image
                        </a>
                        <a href="site-content.php" class="btn btn-outline-primary">
                            <i class="bi bi-gear me-2"></i> Edit Site Content
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Recent Messages</h5>
                    <a href="messages.php" class="btn btn-sm btn-outline-primary">View All</a>
                </div>
                <div class="card-body">
                    <?php 
                    $recentMessages = $db->fetchAll("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5");
                    if (!empty($recentMessages)):
                        foreach ($recentMessages as $msg):
                    ?>
                    <div class="d-flex justify-content-between align-items-start border-bottom py-2">
                        <div>
                            <strong class="small"><?php echo sanitize($msg['name']); ?></strong>
                            <p class="text-muted small mb-0"><?php echo sanitize(substr($msg['message'], 0, 50)) . '...'; ?></p>
                        </div>
                        <small class="text-muted"><?php echo date('M d', strtotime($msg['created_at'])); ?></small>
                    </div>
                    <?php 
                        endforeach;
                    else:
                    ?>
                    <p class="text-muted small mb-0">No messages yet.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
