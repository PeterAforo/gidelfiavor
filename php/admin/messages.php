<?php
$pageTitle = 'Messages';
require_once '../config/config.php';
requireLogin();

$db = Database::getInstance();
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$action = $_GET['action'] ?? 'list';
$message = '';

// Handle delete
if ($action === 'delete' && $id > 0) {
    $db->delete('contact_messages', 'id = ?', [$id]);
    $message = 'Message deleted successfully';
    $action = 'list';
}

// Mark as read
if ($action === 'view' && $id > 0) {
    $db->update('contact_messages', ['is_read' => 1], 'id = :id', ['id' => $id]);
}

// Get message for viewing
$msg = null;
if ($action === 'view' && $id > 0) {
    $msg = $db->fetchOne("SELECT * FROM contact_messages WHERE id = ?", [$id]);
}

// Get all messages
$messages = $db->fetchAll("SELECT * FROM contact_messages ORDER BY created_at DESC");

require_once 'includes/admin-header.php';
?>

<div class="container-fluid py-4">
    <?php if ($message): ?>
    <div class="alert alert-success alert-dismissible fade show">
        <?php echo $message; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    <?php endif; ?>
    
    <?php if ($action === 'view' && $msg): ?>
    <!-- View Message -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">View Message</h4>
        <a href="messages.php" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i> Back to Messages
        </a>
    </div>
    
    <div class="card">
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>From:</strong> <?php echo sanitize($msg['name']); ?>
                </div>
                <div class="col-md-6">
                    <strong>Email:</strong> 
                    <a href="mailto:<?php echo sanitize($msg['email']); ?>"><?php echo sanitize($msg['email']); ?></a>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Phone:</strong> <?php echo sanitize($msg['phone'] ?: 'N/A'); ?>
                </div>
                <div class="col-md-6">
                    <strong>Date:</strong> <?php echo date('F d, Y H:i', strtotime($msg['created_at'])); ?>
                </div>
            </div>
            <div class="mb-3">
                <strong>Subject:</strong> <?php echo sanitize($msg['subject'] ?: 'No Subject'); ?>
            </div>
            <hr>
            <div class="bg-light p-4 rounded">
                <?php echo nl2br(sanitize($msg['message'])); ?>
            </div>
            <div class="mt-4">
                <a href="mailto:<?php echo sanitize($msg['email']); ?>" class="btn btn-primary">
                    <i class="bi bi-reply me-2"></i> Reply
                </a>
                <a href="?action=delete&id=<?php echo $msg['id']; ?>" class="btn btn-outline-danger btn-delete">
                    <i class="bi bi-trash me-2"></i> Delete
                </a>
            </div>
        </div>
    </div>
    
    <?php else: ?>
    <!-- Messages List -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">Contact Messages</h4>
    </div>
    
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($messages)): ?>
                            <?php foreach ($messages as $m): ?>
                            <tr class="<?php echo !$m['is_read'] ? 'fw-bold' : ''; ?>">
                                <td>
                                    <?php if (!$m['is_read']): ?>
                                    <span class="badge bg-primary">New</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo sanitize($m['name']); ?></td>
                                <td><?php echo sanitize($m['email']); ?></td>
                                <td><?php echo sanitize($m['subject'] ?: 'No Subject'); ?></td>
                                <td><small><?php echo date('M d, Y H:i', strtotime($m['created_at'])); ?></small></td>
                                <td>
                                    <a href="?action=view&id=<?php echo $m['id']; ?>" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="?action=delete&id=<?php echo $m['id']; ?>" class="btn btn-sm btn-outline-danger btn-delete">
                                        <i class="bi bi-trash"></i>
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" class="text-center text-muted">No messages yet</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php require_once 'includes/admin-footer.php'; ?>
