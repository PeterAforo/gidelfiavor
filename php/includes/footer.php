    </main>
    
    <!-- Footer -->
    <footer class="footer bg-dark text-white pt-5 pb-4">
        <div class="container">
            <div class="row g-4">
                <!-- Newsletter Column -->
                <div class="col-lg-4">
                    <h5 class="text-white mb-3">Newsletter</h5>
                    <p class="text-white-50 small">Subscribe to get the latest updates on books, articles, and events.</p>
                    <form id="newsletterForm" class="mt-3">
                        <div class="input-group">
                            <input type="email" class="form-control" placeholder="Enter your email" required>
                            <button class="btn btn-primary" type="submit">Subscribe</button>
                        </div>
                    </form>
                    <div class="d-flex gap-2 mt-4">
                        <a href="#" class="social-icon-footer"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="social-icon-footer"><i class="bi bi-linkedin"></i></a>
                        <a href="#" class="social-icon-footer"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="social-icon-footer"><i class="bi bi-facebook"></i></a>
                    </div>
                </div>
                
                <!-- Quick Links Column -->
                <div class="col-lg-4">
                    <h5 class="text-white mb-3">Quick Links</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="<?php echo SITE_URL; ?>">Home</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/about.php">About Me</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/books.php">Books</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/articles.php">Articles</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/gallery.php">Gallery</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/contact.php">Contact</a></li>
                    </ul>
                </div>
                
                <!-- Contact Column -->
                <div class="col-lg-4">
                    <h5 class="text-white mb-3">Contact</h5>
                    <ul class="list-unstyled text-white-50 small">
                        <li class="mb-2">
                            <i class="bi bi-geo-alt me-2 text-primary"></i>
                            Accra, Ghana
                        </li>
                        <li class="mb-2">
                            <i class="bi bi-envelope me-2 text-primary"></i>
                            info@gidelfiavor.com
                        </li>
                        <li class="mb-2">
                            <i class="bi bi-telephone me-2 text-primary"></i>
                            +233 XX XXX XXXX
                        </li>
                    </ul>
                </div>
            </div>
            
            <hr class="my-4 border-secondary">
            
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start">
                    <p class="text-white-50 small mb-0">
                        &copy; <?php echo date('Y'); ?> Gidel Fiavor. All rights reserved.
                    </p>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <a href="#" class="text-white-50 small me-3">Privacy Policy</a>
                    <a href="#" class="text-white-50 small">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- Custom JS -->
    <script src="<?php echo SITE_URL; ?>/assets/js/main.js"></script>
    <!-- Pixel Effect JS -->
    <script src="<?php echo SITE_URL; ?>/assets/js/pixel-effect.js"></script>
</body>
</html>
