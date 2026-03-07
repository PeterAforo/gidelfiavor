<?php
// Admin header - requires login check before including
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' | Admin' : 'Admin'; ?> - <?php echo SITE_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="<?php echo SITE_URL; ?>/assets/css/style.css" rel="stylesheet">
    <style>
        body { padding-top: 0; }
        .admin-sidebar {
            width: 250px;
            min-height: 100vh;
            background-color: #1a1a1a;
            position: fixed;
            left: 0;
            top: 0;
        }
        .admin-content {
            margin-left: 250px;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .admin-sidebar .nav-link {
            color: rgba(255,255,255,0.7) !important;
            padding: 0.75rem 1.5rem;
            border-left: 3px solid transparent;
        }
        .admin-sidebar .nav-link:hover,
        .admin-sidebar .nav-link.active {
            color: #fff !important;
            background-color: rgba(255,255,255,0.1);
            border-left-color: var(--primary);
        }
        .admin-sidebar .nav-link i {
            width: 24px;
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="admin-sidebar">
        <div class="p-4 border-bottom border-secondary">
            <a href="<?php echo SITE_URL; ?>" class="text-decoration-none d-flex align-items-center">
                <span class="brand-icon me-2">G</span>
                <span class="text-white">Gidel Fiavor</span>
            </a>
        </div>
        
        <nav class="nav flex-column py-3">
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>" href="dashboard.php">
                <i class="bi bi-speedometer2 me-2"></i> Dashboard
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'books.php' ? 'active' : ''; ?>" href="books.php">
                <i class="bi bi-book me-2"></i> Books
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'articles.php' ? 'active' : ''; ?>" href="articles.php">
                <i class="bi bi-file-text me-2"></i> Articles
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'gallery.php' ? 'active' : ''; ?>" href="gallery.php">
                <i class="bi bi-images me-2"></i> Gallery
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'testimonials.php' ? 'active' : ''; ?>" href="testimonials.php">
                <i class="bi bi-chat-quote me-2"></i> Testimonials
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'messages.php' ? 'active' : ''; ?>" href="messages.php">
                <i class="bi bi-envelope me-2"></i> Messages
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'hero-image.php' ? 'active' : ''; ?>" href="hero-image.php">
                <i class="bi bi-palette me-2"></i> Hero Image & Theme
            </a>
            <a class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'site-content.php' ? 'active' : ''; ?>" href="site-content.php">
                <i class="bi bi-gear me-2"></i> Site Content
            </a>
        </nav>
        
        <div class="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
            <a href="logout.php" class="nav-link text-danger">
                <i class="bi bi-box-arrow-left me-2"></i> Logout
            </a>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="admin-content">
        <!-- Top Bar -->
        <div class="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><?php echo $pageTitle ?? 'Admin'; ?></h5>
            <div class="d-flex align-items-center gap-3">
                <span class="text-muted small">Welcome, <?php echo $_SESSION['admin_user'] ?? 'Admin'; ?></span>
                <a href="<?php echo SITE_URL; ?>" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye me-1"></i> View Site
                </a>
            </div>
        </div>
