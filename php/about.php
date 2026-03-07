<?php
$pageTitle = 'About Me';
require_once 'includes/header.php';

$db = Database::getInstance();
$content = $db->fetchOne("SELECT * FROM site_content LIMIT 1");
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <h1>About Me</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">About Me</li>
            </ol>
        </nav>
    </div>
</section>

<!-- Services/Expertise Row -->
<section class="section">
    <div class="container">
        <div class="row g-4 text-center">
            <div class="col-md-3 col-6">
                <div class="p-3">
                    <i class="bi bi-book text-primary mb-3" style="font-size: 2rem;"></i>
                    <h6>Author</h6>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="p-3">
                    <i class="bi bi-mortarboard text-primary mb-3" style="font-size: 2rem;"></i>
                    <h6>Theologian</h6>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="p-3">
                    <i class="bi bi-heart text-primary mb-3" style="font-size: 2rem;"></i>
                    <h6>Marriage Counsellor</h6>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="p-3">
                    <i class="bi bi-graph-up text-primary mb-3" style="font-size: 2rem;"></i>
                    <h6>Healthcare Marketing</h6>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Skills Section -->
<section class="section bg-light">
    <div class="container">
        <div class="row align-items-center g-5">
            <div class="col-lg-6">
                <img src="https://placehold.co/500x600/E5E7EB/9CA3AF?text=Portrait" alt="Gidel Fiavor" class="img-fluid rounded-4 shadow">
            </div>
            <div class="col-lg-6">
                <h2 class="section-title mb-4">My Skills</h2>
                <p class="text-muted mb-4">
                    <?php echo $content['about_bio'] ?? 'With decades of experience across multiple disciplines, I bring a unique blend of expertise to everything I do.'; ?>
                </p>
                
                <!-- Skill Bars -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-medium">Healthcare Marketing</span>
                        <span class="small text-muted">95%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="progress-bar" data-width="95" style="width: 95%;"></div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-medium">Theological Studies</span>
                        <span class="small text-muted">90%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="progress-bar" data-width="90" style="width: 90%;"></div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-medium">Marriage Counseling</span>
                        <span class="small text-muted">88%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="progress-bar" data-width="88" style="width: 88%;"></div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-medium">Writing & Publishing</span>
                        <span class="small text-muted">92%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="progress-bar" data-width="92" style="width: 92%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Stats Section -->
<section class="section">
    <div class="container">
        <div class="row g-4 text-center">
            <div class="col-md-3 col-6">
                <div class="stat-item">
                    <div class="stat-number" data-target="30">30+</div>
                    <div class="stat-label">Years Experience</div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stat-item">
                    <div class="stat-number" data-target="5">5</div>
                    <div class="stat-label">Books Published</div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stat-item">
                    <div class="stat-number" data-target="500">500+</div>
                    <div class="stat-label">Couples Counseled</div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stat-item">
                    <div class="stat-number" data-target="100">100+</div>
                    <div class="stat-label">Speaking Events</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Education Section -->
<section class="section bg-light">
    <div class="container">
        <h2 class="section-title text-center mb-5">Education</h2>
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card h-100 p-4">
                    <div class="card-body">
                        <i class="bi bi-mortarboard text-primary mb-3" style="font-size: 2rem;"></i>
                        <h5 class="card-title">Master of Divinity</h5>
                        <p class="text-muted small mb-1">Theological Seminary</p>
                        <p class="text-primary small">2000 - 2003</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100 p-4">
                    <div class="card-body">
                        <i class="bi bi-mortarboard text-primary mb-3" style="font-size: 2rem;"></i>
                        <h5 class="card-title">MBA in Healthcare</h5>
                        <p class="text-muted small mb-1">Business School</p>
                        <p class="text-primary small">1995 - 1997</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card h-100 p-4">
                    <div class="card-body">
                        <i class="bi bi-mortarboard text-primary mb-3" style="font-size: 2rem;"></i>
                        <h5 class="card-title">B.Sc. Marketing</h5>
                        <p class="text-muted small mb-1">University</p>
                        <p class="text-primary small">1990 - 1994</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Experience Timeline -->
<section class="section">
    <div class="container">
        <h2 class="section-title text-center mb-5">Experience</h2>
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="timeline">
                    <div class="timeline-item">
                        <h5>Senior Healthcare Marketing Consultant</h5>
                        <p class="text-primary small mb-2">2015 - Present</p>
                        <p class="text-muted small">Leading strategic marketing initiatives for healthcare organizations across Ghana and West Africa.</p>
                    </div>
                    <div class="timeline-item">
                        <h5>Marriage & Family Counselor</h5>
                        <p class="text-primary small mb-2">2005 - Present</p>
                        <p class="text-muted small">Providing biblical counseling and guidance to couples and families.</p>
                    </div>
                    <div class="timeline-item">
                        <h5>Author & Speaker</h5>
                        <p class="text-primary small mb-2">2010 - Present</p>
                        <p class="text-muted small">Writing books and speaking at conferences on faith, marriage, and professional development.</p>
                    </div>
                    <div class="timeline-item">
                        <h5>Marketing Director</h5>
                        <p class="text-primary small mb-2">2000 - 2015</p>
                        <p class="text-muted small">Directed marketing operations for major healthcare institutions.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Contact Form Section -->
<section class="section bg-light">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <h2 class="section-title text-center mb-5">Get In Touch</h2>
                <form id="contactForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <input type="text" class="form-control" name="name" placeholder="Your Name" required>
                        </div>
                        <div class="col-md-6">
                            <input type="email" class="form-control" name="email" placeholder="Your Email" required>
                        </div>
                        <div class="col-md-6">
                            <input type="tel" class="form-control" name="phone" placeholder="Phone Number">
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" name="subject" placeholder="Subject">
                        </div>
                        <div class="col-12">
                            <textarea class="form-control" name="message" rows="5" placeholder="Your Message" required></textarea>
                        </div>
                        <div class="col-12 text-center">
                            <button type="submit" class="btn btn-primary rounded-pill px-5 py-2">
                                Send Message <i class="bi bi-send ms-2"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<?php require_once 'includes/footer.php'; ?>
