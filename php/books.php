<?php
$pageTitle = 'Books';
require_once 'includes/header.php';

$db = Database::getInstance();
$books = $db->fetchAll("SELECT * FROM books ORDER BY created_at DESC");
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <h1>My Books</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Books</li>
            </ol>
        </nav>
    </div>
</section>

<!-- Books Section -->
<section class="section">
    <div class="container">
        <div class="row g-4">
            <?php if (!empty($books)): ?>
                <?php foreach ($books as $book): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="card book-card h-100">
                        <img src="<?php echo $book['cover_image'] ?: 'https://placehold.co/300x400/E5E7EB/9CA3AF?text=Book+Cover'; ?>" 
                             class="card-img-top" 
                             alt="<?php echo sanitize($book['title']); ?>"
                             style="height: 350px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title"><?php echo sanitize($book['title']); ?></h5>
                            <p class="card-text text-muted small">
                                <?php echo sanitize(substr($book['description'], 0, 150)) . '...'; ?>
                            </p>
                            <?php if (!empty($book['tags'])): ?>
                            <div class="mb-3">
                                <?php 
                                $tags = is_array($book['tags']) ? $book['tags'] : explode(',', $book['tags']);
                                foreach ($tags as $tag): 
                                ?>
                                <span class="badge bg-secondary me-1"><?php echo sanitize(trim($tag)); ?></span>
                                <?php endforeach; ?>
                            </div>
                            <?php endif; ?>
                            <a href="<?php echo $book['purchase_link'] ?? '#'; ?>" class="btn btn-primary rounded-pill" target="_blank">
                                Get the Book <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Fallback Static Books -->
                <div class="col-md-6 col-lg-4">
                    <div class="card book-card h-100">
                        <img src="https://placehold.co/300x400/E5E7EB/9CA3AF?text=Book+Cover" class="card-img-top" alt="Book" style="height: 350px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">The Art of Marriage</h5>
                            <p class="card-text text-muted small">A comprehensive guide to building a strong and lasting marriage based on biblical principles.</p>
                            <div class="mb-3">
                                <span class="badge bg-secondary me-1">Marriage</span>
                                <span class="badge bg-secondary me-1">Faith</span>
                            </div>
                            <a href="#" class="btn btn-primary rounded-pill">
                                Get the Book <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="card book-card h-100">
                        <img src="https://placehold.co/300x400/E5E7EB/9CA3AF?text=Book+Cover" class="card-img-top" alt="Book" style="height: 350px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">Healthcare Marketing Excellence</h5>
                            <p class="card-text text-muted small">Strategic insights for marketing healthcare services in the modern digital age.</p>
                            <div class="mb-3">
                                <span class="badge bg-secondary me-1">Marketing</span>
                                <span class="badge bg-secondary me-1">Healthcare</span>
                            </div>
                            <a href="#" class="btn btn-primary rounded-pill">
                                Get the Book <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="card book-card h-100">
                        <img src="https://placehold.co/300x400/E5E7EB/9CA3AF?text=Book+Cover" class="card-img-top" alt="Book" style="height: 350px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">Walking in Faith</h5>
                            <p class="card-text text-muted small">A devotional journey through the principles of faith and spiritual growth.</p>
                            <div class="mb-3">
                                <span class="badge bg-secondary me-1">Theology</span>
                                <span class="badge bg-secondary me-1">Devotional</span>
                            </div>
                            <a href="#" class="btn btn-primary rounded-pill">
                                Get the Book <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php require_once 'includes/footer.php'; ?>
