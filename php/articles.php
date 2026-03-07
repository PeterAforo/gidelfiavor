<?php
$pageTitle = 'Articles';
require_once 'includes/header.php';

$db = Database::getInstance();
$articles = $db->fetchAll("SELECT * FROM articles ORDER BY published_at DESC");
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <h1>Articles</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Articles</li>
            </ol>
        </nav>
    </div>
</section>

<!-- Articles Section -->
<section class="section">
    <div class="container">
        <div class="row g-4">
            <?php if (!empty($articles)): ?>
                <?php foreach ($articles as $article): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="<?php echo $article['image_url'] ?: 'https://placehold.co/400x220/E5E7EB/9CA3AF?text=Article'; ?>" 
                                 class="card-img-top" 
                                 alt="<?php echo sanitize($article['title']); ?>"
                                 style="height: 220px; object-fit: cover;">
                            <div class="position-absolute top-0 start-0 p-3">
                                <span class="badge bg-primary"><?php echo sanitize($article['category'] ?? 'Article'); ?></span>
                            </div>
                            <div class="position-absolute bottom-0 start-0 p-3">
                                <span class="badge bg-dark bg-opacity-75">
                                    <i class="bi bi-person me-1"></i> Gidel Fiavor
                                </span>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">
                                <a href="article.php?id=<?php echo $article['id']; ?>" class="text-decoration-none text-dark">
                                    <?php echo sanitize($article['title']); ?>
                                </a>
                            </h5>
                            <p class="card-text text-muted small">
                                <?php echo sanitize(substr($article['excerpt'] ?? $article['content'], 0, 120)) . '...'; ?>
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>
                                    <?php echo date('M d, Y', strtotime($article['published_at'])); ?>
                                </small>
                                <a href="article.php?id=<?php echo $article['id']; ?>" class="text-primary text-decoration-none">
                                    Read More <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Fallback Static Articles -->
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="https://placehold.co/400x220/E5E7EB/9CA3AF?text=Article" class="card-img-top" alt="Article" style="height: 220px; object-fit: cover;">
                            <div class="position-absolute top-0 start-0 p-3">
                                <span class="badge bg-primary">Marriage</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Building a Strong Marriage Foundation</h5>
                            <p class="card-text text-muted small">Discover the key principles that form the foundation of a lasting and fulfilling marriage...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted"><i class="bi bi-calendar me-1"></i> Jan 15, 2024</small>
                                <a href="#" class="text-primary text-decoration-none">Read More <i class="bi bi-arrow-right ms-1"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="https://placehold.co/400x220/E5E7EB/9CA3AF?text=Article" class="card-img-top" alt="Article" style="height: 220px; object-fit: cover;">
                            <div class="position-absolute top-0 start-0 p-3">
                                <span class="badge bg-primary">Faith</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Walking by Faith in Uncertain Times</h5>
                            <p class="card-text text-muted small">How to maintain your faith and trust in God during challenging seasons of life...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted"><i class="bi bi-calendar me-1"></i> Jan 10, 2024</small>
                                <a href="#" class="text-primary text-decoration-none">Read More <i class="bi bi-arrow-right ms-1"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="https://placehold.co/400x220/E5E7EB/9CA3AF?text=Article" class="card-img-top" alt="Article" style="height: 220px; object-fit: cover;">
                            <div class="position-absolute top-0 start-0 p-3">
                                <span class="badge bg-primary">Healthcare</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Marketing Strategies for Healthcare</h5>
                            <p class="card-text text-muted small">Effective marketing approaches that resonate with patients and healthcare consumers...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted"><i class="bi bi-calendar me-1"></i> Jan 5, 2024</small>
                                <a href="#" class="text-primary text-decoration-none">Read More <i class="bi bi-arrow-right ms-1"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php require_once 'includes/footer.php'; ?>
