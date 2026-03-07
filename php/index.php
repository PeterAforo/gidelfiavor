<?php
$pageTitle = 'Home';
require_once 'includes/header.php';

// Get site content from database
$db = Database::getInstance();
$content = $db->fetchOne("SELECT * FROM site_content LIMIT 1");
$books = $db->fetchAll("SELECT * FROM books ORDER BY created_at DESC LIMIT 3");
$articles = $db->fetchAll("SELECT * FROM articles ORDER BY published_at DESC LIMIT 3");
?>

<!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="row">
            <!-- Left Content -->
            <div class="col-lg-4 align-items-center">
                <p class="hero-subtitle mb-3 hero-animate-subtitle">HELLO I'M</p>
                <h1 class="hero-title mb-4 hero-animate-title" style="font-size: 7rem; line-height: 0.8;">
                    Gidel<br> Kwasi<br>
                    <span>Fiavor</span>
                </h1>
                <p class="text-muted small mb-4 hero-animate-text">
                    <?php echo $content['hero_subtitle'] ?? 'A passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience.'; ?>
                </p>
                <a href="about.php" class="btn btn-primary rounded-pill px-4 py-2 hero-animate-btn">
                    Read More <i class="bi bi-arrow-right ms-2"></i>
                </a>
            </div>
            
            <!-- Center Image -->
            <div class="col-lg-4 text-center hero-animate-center">
                <img src="assets/images/hero-image.png" alt="Gidel Kwasi Fiavor" class="hero-image">
            </div>
            
            
            </div>
        </div>
    </div>
    
    <!-- Outline Text (behind image) -->
    <div class="hero-overlay-text hero-outline-layer hero-animate-outline">
        <div class="container">
            <h2 class="outline-text">HEALTHCARE</h2>
            <h2 class="outline-text">MARKETING STRATEGIST</h2>
        </div>
    </div>
    
    <!-- Solid Text (in front of image) -->
    <div class="hero-overlay-text hero-solid-layer hero-animate-solid">
        <div class="container">
            <h2 class="solid-text">THEOLOGIAN</h2>
        </div>
    </div>
</section>

<!-- Books Parallax Section -->
<section class="books-parallax-section" data-aos="fade-up">
    <div class="parallax-overlay"></div>
    <div class="container position-relative">
        <div class="text-center mb-5">
            <h2 class="section-title text-white">My Books</h2>
            <p class="section-subtitle text-white-50">Inspiring works of faith and wisdom</p>
        </div>
        
        <div class="row g-4 justify-content-center">
            <?php if (!empty($books)): ?>
                <?php foreach ($books as $index => $book): ?>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="<?php echo ($index + 1) * 100; ?>">
                    <div class="book-card-parallax text-center">
                        <div class="book-cover-wrapper">
                            <img src="<?php echo $book['cover_image'] ?: 'https://placehold.co/300x400/E5E7EB/9CA3AF?text=Book+Cover'; ?>" 
                                 class="book-cover-img" 
                                 alt="<?php echo sanitize($book['title']); ?>">
                        </div>
                        <h5 class="book-title text-white mt-3"><?php echo sanitize($book['title']); ?></h5>
                        <p class="book-desc text-white-50 small"><?php echo sanitize(substr($book['description'], 0, 80)) . '...'; ?></p>
                        <a href="<?php echo $book['purchase_link'] ?: 'books.php'; ?>" class="btn btn-outline-light btn-sm rounded-pill">
                            Get the Book <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Placeholder books if none in database -->
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="book-card-parallax text-center">
                        <div class="book-cover-wrapper">
                            <img src="https://placehold.co/300x400/755941/FFFFFF?text=Book+1" class="book-cover-img" alt="Book">
                        </div>
                        <h5 class="book-title text-white mt-3">Faith & Purpose</h5>
                        <p class="book-desc text-white-50 small">Discovering your divine calling through faith...</p>
                        <a href="books.php" class="btn btn-outline-light btn-sm rounded-pill">
                            Get the Book <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="book-card-parallax text-center">
                        <div class="book-cover-wrapper">
                            <img src="https://placehold.co/300x400/5D4735/FFFFFF?text=Book+2" class="book-cover-img" alt="Book">
                        </div>
                        <h5 class="book-title text-white mt-3">Marriage Matters</h5>
                        <p class="book-desc text-white-50 small">Building stronger relationships through biblical principles...</p>
                        <a href="books.php" class="btn btn-outline-light btn-sm rounded-pill">
                            Get the Book <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
                    <div class="book-card-parallax text-center">
                        <div class="book-cover-wrapper">
                            <img src="https://placehold.co/300x400/8B6B4D/FFFFFF?text=Book+3" class="book-cover-img" alt="Book">
                        </div>
                        <h5 class="book-title text-white mt-3">Healthcare Leadership</h5>
                        <p class="book-desc text-white-50 small">Strategic insights for healthcare professionals...</p>
                        <a href="books.php" class="btn btn-outline-light btn-sm rounded-pill">
                            Get the Book <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="text-center mt-5">
            <a href="books.php" class="btn btn-light rounded-pill px-4">
                View All Books <i class="bi bi-arrow-right ms-2"></i>
            </a>
        </div>
    </div>
</section>

<!-- About Section -->
<section class="py-5" data-aos="fade-up">
    <div class="container">
        <div class="row gx-4 align-items-center justify-content-between">
            <div class="col-md-5 order-2 order-md-1" data-aos="fade-right">
                <div class="mt-5 mt-md-0">
                    <span class="text-muted">My Story</span>
                    <h2 class="display-5 fw-bold">About Me</h2>
                    <p class="lead">
                        <?php echo $content['about_bio'] ?? 'With nearly three decades of professional experience, I have dedicated my life to serving others through healthcare marketing, theological education, and marriage counseling.'; ?>
                    </p>
                    <p class="lead">A passionate healthcare marketing specialist, theologian, marriage counsellor, and author committed to making a lasting impact.</p>
                    <a href="about.php" class="btn btn-primary rounded-pill px-4 mt-3">
                        Learn More <i class="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>
            <div class="col-md-6 offset-md-1 order-1 order-md-2" data-aos="fade-left">
                <div class="row gx-2 gx-lg-3">
                    <div class="col-6">
                        <div class="mb-2"><img class="img-fluid rounded-3" src="assets/images/about-1.jpg" alt="Gidel Fiavor" onerror="this.src='https://placehold.co/400x400/755941/FFFFFF?text=Author'"></div>
                    </div>
                    <div class="col-6">
                        <div class="mb-2"><img class="img-fluid rounded-3" src="assets/images/about-2.jpg" alt="Gidel Fiavor" onerror="this.src='https://placehold.co/400x400/5D4735/FFFFFF?text=Theologian'"></div>
                    </div>
                    <div class="col-6">
                        <div class="mb-2"><img class="img-fluid rounded-3" src="assets/images/about-3.jpg" alt="Gidel Fiavor" onerror="this.src='https://placehold.co/400x400/8B6B4D/FFFFFF?text=Counsellor'"></div>
                    </div>
                    <div class="col-6">
                        <div class="mb-2"><img class="img-fluid rounded-3" src="assets/images/about-4.jpg" alt="Gidel Fiavor" onerror="this.src='https://placehold.co/400x400/A67C52/FFFFFF?text=Strategist'"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Latest Articles Section -->
<section class="articles-clean-section py-5" data-aos="fade-up">
    <div class="container">
        <!-- Section Header -->
        <div class="text-center mb-5">
            <span class="articles-subtitle">Recent news</span>
            <h2 class="articles-main-title">Our blogs</h2>
        </div>
        
        <!-- Articles Grid -->
        <div class="row g-4 justify-content-center">
            <?php if (!empty($articles)): ?>
                <?php foreach ($articles as $index => $article): ?>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="<?php echo ($index + 1) * 100; ?>">
                    <div class="article-card-clean">
                        <div class="article-img-container">
                            <a href="article.php?id=<?php echo $article['id']; ?>">
                                <img src="<?php echo $article['image_url'] ?: 'https://placehold.co/400x350/E5E7EB/9CA3AF?text=Article'; ?>" alt="<?php echo sanitize($article['title']); ?>" class="article-img">
                            </a>
                            <span class="article-date-tag"><?php echo date('F d, Y', strtotime($article['created_at'] ?? 'now')); ?></span>
                        </div>
                        <h5 class="article-clean-title">
                            <a href="article.php?id=<?php echo $article['id']; ?>"><?php echo sanitize($article['title']); ?></a>
                        </h5>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Placeholder articles -->
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="article-card-clean">
                        <div class="article-img-container">
                            <a href="articles.php">
                                <img src="https://placehold.co/400x350/4A90A4/FFFFFF?text=Faith" alt="Article" class="article-img">
                            </a>
                            <span class="article-date-tag">March 20, 2026</span>
                        </div>
                        <h5 class="article-clean-title">
                            <a href="articles.php">Incididunt ut labore et dolore magna</a>
                        </h5>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="article-card-clean">
                        <div class="article-img-container">
                            <a href="articles.php">
                                <img src="https://placehold.co/400x350/E8D5B7/333333?text=Leadership" alt="Article" class="article-img">
                            </a>
                            <span class="article-date-tag">March 04, 2026</span>
                        </div>
                        <h5 class="article-clean-title">
                            <a href="articles.php">Lorem ipsum dolor sit consectetur</a>
                        </h5>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
                    <div class="article-card-clean">
                        <div class="article-img-container">
                            <a href="articles.php">
                                <img src="https://placehold.co/400x350/87CEEB/333333?text=Marriage" alt="Article" class="article-img">
                            </a>
                            <span class="article-date-tag">March 31, 2026</span>
                        </div>
                        <h5 class="article-clean-title">
                            <a href="articles.php">Lorem ipsum dolor sit consectetur</a>
                        </h5>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Pagination dots -->
        <div class="articles-pagination text-center mt-4">
            <span class="pagination-dot active"></span>
            <span class="pagination-dot"></span>
        </div>
    </div>
</section>

<?php require_once 'includes/footer.php'; ?>
