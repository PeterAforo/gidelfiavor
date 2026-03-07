<?php
$pageTitle = 'Article';
require_once 'includes/header.php';

$db = Database::getInstance();

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$article = $db->fetchOne("SELECT * FROM articles WHERE id = ?", [$id]);

if (!$article) {
    header("Location: articles.php");
    exit;
}

$pageTitle = $article['title'];
$recentPosts = $db->fetchAll("SELECT * FROM articles WHERE id != ? ORDER BY published_at DESC LIMIT 3", [$id]);
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <h1><?php echo sanitize($article['title']); ?></h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item"><a href="articles.php">Articles</a></li>
                <li class="breadcrumb-item active"><?php echo sanitize(substr($article['title'], 0, 30)) . '...'; ?></li>
            </ol>
        </nav>
    </div>
</section>

<!-- Article Content -->
<section class="section">
    <div class="container">
        <div class="row g-5">
            <!-- Main Content -->
            <div class="col-lg-8">
                <!-- Featured Image -->
                <?php if (!empty($article['image_url'])): ?>
                <img src="<?php echo $article['image_url']; ?>" 
                     alt="<?php echo sanitize($article['title']); ?>" 
                     class="img-fluid rounded-4 mb-4 w-100"
                     style="max-height: 400px; object-fit: cover;">
                <?php endif; ?>
                
                <!-- Article Meta -->
                <div class="d-flex align-items-center gap-4 mb-4">
                    <div class="d-flex align-items-center">
                        <img src="https://placehold.co/100x100/E5E7EB/9CA3AF?text=GF" alt="Author" class="rounded-circle me-2" width="40" height="40">
                        <span class="small">Gidel Fiavor</span>
                    </div>
                    <span class="text-muted small">
                        <i class="bi bi-calendar me-1"></i>
                        <?php echo date('F d, Y', strtotime($article['published_at'])); ?>
                    </span>
                    <?php if (!empty($article['category'])): ?>
                    <span class="badge bg-primary"><?php echo sanitize($article['category']); ?></span>
                    <?php endif; ?>
                </div>
                
                <!-- Article Body -->
                <div class="article-content">
                    <?php echo nl2br($article['content']); ?>
                </div>
                
                <!-- Tags -->
                <?php if (!empty($article['keywords'])): ?>
                <div class="mt-4 pt-4 border-top">
                    <strong class="small">Keywords:</strong>
                    <?php 
                    $keywords = is_array($article['keywords']) ? $article['keywords'] : explode(',', $article['keywords']);
                    foreach ($keywords as $keyword): 
                    ?>
                    <span class="badge bg-secondary me-1"><?php echo sanitize(trim($keyword)); ?></span>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                
                <!-- Share -->
                <div class="mt-4 pt-4 border-top">
                    <strong class="small me-3">Share:</strong>
                    <a href="#" class="social-icon me-2"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="social-icon me-2"><i class="bi bi-twitter-x"></i></a>
                    <a href="#" class="social-icon me-2"><i class="bi bi-linkedin"></i></a>
                    <a href="#" class="social-icon"><i class="bi bi-whatsapp"></i></a>
                </div>
                
                <!-- Comments Section -->
                <div class="mt-5 pt-4 border-top">
                    <h4 class="mb-4">Comments</h4>
                    <div class="bg-light p-4 rounded-3 mb-4">
                        <p class="text-muted mb-0">No comments yet. Be the first to comment!</p>
                    </div>
                    
                    <!-- Comment Form -->
                    <h5 class="mb-3">Leave a Comment</h5>
                    <form id="commentForm">
                        <input type="hidden" name="article_id" value="<?php echo $article['id']; ?>">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <input type="text" class="form-control" name="name" placeholder="Your Name" required>
                            </div>
                            <div class="col-md-6">
                                <input type="email" class="form-control" name="email" placeholder="Your Email" required>
                            </div>
                            <div class="col-12">
                                <textarea class="form-control" name="comment" rows="4" placeholder="Your Comment" required></textarea>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary rounded-pill px-4">
                                    Post Comment <i class="bi bi-send ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Sidebar -->
            <div class="col-lg-4">
                <!-- Search -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3">Search</h5>
                        <form action="articles.php" method="GET">
                            <div class="input-group">
                                <input type="text" class="form-control" name="search" placeholder="Search articles...">
                                <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Recent Posts -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3">Recent Posts</h5>
                        <?php if (!empty($recentPosts)): ?>
                            <?php foreach ($recentPosts as $post): ?>
                            <div class="d-flex mb-3">
                                <img src="<?php echo $post['image_url'] ?: 'https://placehold.co/80x60/E5E7EB/9CA3AF?text=Post'; ?>" 
                                     alt="<?php echo sanitize($post['title']); ?>" 
                                     class="rounded me-3" 
                                     width="80" height="60" 
                                     style="object-fit: cover;">
                                <div>
                                    <h6 class="mb-1">
                                        <a href="article.php?id=<?php echo $post['id']; ?>" class="text-decoration-none text-dark">
                                            <?php echo sanitize(substr($post['title'], 0, 40)) . '...'; ?>
                                        </a>
                                    </h6>
                                    <small class="text-muted"><?php echo date('M d, Y', strtotime($post['published_at'])); ?></small>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <p class="text-muted small">No recent posts.</p>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- About Author -->
                <div class="card">
                    <div class="card-body text-center">
                        <img src="https://placehold.co/100x100/E5E7EB/9CA3AF?text=GF" alt="Gidel Fiavor" class="rounded-circle mb-3" width="100" height="100">
                        <h5>Gidel Fiavor</h5>
                        <p class="text-muted small">Healthcare marketing specialist, theologian, marriage counsellor, and author.</p>
                        <div class="d-flex justify-content-center gap-2">
                            <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="social-icon"><i class="bi bi-linkedin"></i></a>
                            <a href="#" class="social-icon"><i class="bi bi-twitter-x"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php require_once 'includes/footer.php'; ?>
