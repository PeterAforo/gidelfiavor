/**
 * Gidel Fiavor Website - Main JavaScript
 */

$(document).ready(function() {
    // Initialize animations on scroll
    initScrollAnimations();
    
    // Newsletter form handler
    initNewsletterForm();
    
    // Contact form handler
    initContactForm();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
});

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with scroll animation classes
    document.querySelectorAll('.animate-on-scroll, [data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Auto-add animation to sections and cards
    document.querySelectorAll('.section, .card, .section-title, .section-subtitle').forEach((el, index) => {
        if (!el.classList.contains('hero-section')) {
            el.classList.add('aos-init');
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (index % 5) * 100);
            observer.observe(el);
        }
    });
}

/**
 * Newsletter Form
 */
function initNewsletterForm() {
    $('#newsletterForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $(this).find('input[type="email"]').val();
        const $btn = $(this).find('button');
        const originalText = $btn.text();
        
        $btn.prop('disabled', true).text('Subscribing...');
        
        $.ajax({
            url: 'api/newsletter.php',
            method: 'POST',
            data: { email: email },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Thank you for subscribing!');
                    $('#newsletterForm')[0].reset();
                } else {
                    showAlert('danger', response.message || 'Something went wrong.');
                }
            },
            error: function() {
                showAlert('danger', 'Failed to subscribe. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).text(originalText);
            }
        });
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        const $btn = $(this).find('button[type="submit"]');
        const originalText = $btn.text();
        
        $btn.prop('disabled', true).text('Sending...');
        
        $.ajax({
            url: 'api/contact.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('success', 'Message sent successfully! We\'ll get back to you soon.');
                    $('#contactForm')[0].reset();
                } else {
                    showAlert('danger', response.message || 'Something went wrong.');
                }
            },
            error: function() {
                showAlert('danger', 'Failed to send message. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).text(originalText);
            }
        });
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 600);
        }
    });
}

/**
 * Show Alert
 */
function showAlert(type, message) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Remove existing alerts
    $('.alert').remove();
    
    // Add new alert at top of main content
    $('main').prepend(alertHtml);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
}

/**
 * Load More Items (for articles, gallery, etc.)
 */
function loadMoreItems(endpoint, container, page) {
    $.ajax({
        url: endpoint,
        method: 'GET',
        data: { page: page },
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data.length > 0) {
                response.data.forEach(item => {
                    $(container).append(item.html);
                });
                return true;
            }
            return false;
        },
        error: function() {
            console.error('Failed to load more items');
            return false;
        }
    });
}

/**
 * Animate Progress Bars
 */
function animateProgressBars() {
    $('.skill-bar .progress-bar').each(function() {
        const width = $(this).data('width');
        $(this).css('width', '0%').animate({ width: width + '%' }, 1000);
    });
}

/**
 * Counter Animation
 */
function animateCounters() {
    $('.stat-number').each(function() {
        const $this = $(this);
        const target = parseInt($this.data('target'));
        
        $({ count: 0 }).animate({ count: target }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                $this.text(Math.floor(this.count));
            },
            complete: function() {
                $this.text(target);
            }
        });
    });
}
