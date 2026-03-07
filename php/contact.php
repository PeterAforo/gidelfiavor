<?php
$pageTitle = 'Contact';
require_once 'includes/header.php';

$db = Database::getInstance();
$content = $db->fetchOne("SELECT * FROM site_content LIMIT 1");
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <h1>Contact</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Contact</li>
            </ol>
        </nav>
    </div>
</section>

<!-- Contact Info Cards -->
<section class="section">
    <div class="container">
        <div class="row g-4 mb-5">
            <div class="col-md-4">
                <div class="contact-card h-100">
                    <div class="icon">
                        <i class="bi bi-geo-alt"></i>
                    </div>
                    <h5>Address</h5>
                    <p class="text-muted small mb-0">
                        <?php echo $content['contact_address'] ?? 'Accra, Ghana'; ?>
                    </p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="contact-card h-100">
                    <div class="icon">
                        <i class="bi bi-envelope"></i>
                    </div>
                    <h5>Email</h5>
                    <p class="text-muted small mb-0">
                        <a href="mailto:<?php echo $content['contact_email'] ?? 'info@gidelfiavor.com'; ?>" class="text-decoration-none">
                            <?php echo $content['contact_email'] ?? 'info@gidelfiavor.com'; ?>
                        </a>
                    </p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="contact-card h-100">
                    <div class="icon">
                        <i class="bi bi-telephone"></i>
                    </div>
                    <h5>Phone</h5>
                    <p class="text-muted small mb-0">
                        <a href="tel:<?php echo $content['contact_phone'] ?? '+233XXXXXXXX'; ?>" class="text-decoration-none">
                            <?php echo $content['contact_phone'] ?? '+233 XX XXX XXXX'; ?>
                        </a>
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Contact Form -->
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-body p-4 p-lg-5">
                        <h3 class="text-center mb-4">Send a Message</h3>
                        <form id="contactForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small">Your Name *</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small">Phone Number</label>
                                    <input type="tel" class="form-control" name="phone">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small">Email Address *</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small">Subject</label>
                                    <input type="text" class="form-control" name="subject">
                                </div>
                                <div class="col-12">
                                    <label class="form-label small">Your Message *</label>
                                    <textarea class="form-control" name="message" rows="5" required></textarea>
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
        </div>
    </div>
</section>

<?php require_once 'includes/footer.php'; ?>
