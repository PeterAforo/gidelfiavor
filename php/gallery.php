<?php
$pageTitle = 'Gallery';
require_once 'includes/header.php';

$db = Database::getInstance();
$images = $db->fetchAll("SELECT * FROM gallery ORDER BY created_at DESC");
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <h1>Gallery</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Gallery</li>
            </ol>
        </nav>
    </div>
</section>

<!-- Gallery Section -->
<section class="section">
    <div class="container">
        <div class="row g-4">
            <?php if (!empty($images)): ?>
                <?php foreach ($images as $image): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="gallery-item">
                        <img src="<?php echo $image['image_url']; ?>" alt="<?php echo sanitize($image['caption'] ?? 'Gallery Image'); ?>">
                        <div class="overlay">
                            <a href="<?php echo $image['image_url']; ?>" class="btn btn-light btn-sm rounded-pill" data-bs-toggle="modal" data-bs-target="#imageModal" data-image="<?php echo $image['image_url']; ?>" data-caption="<?php echo sanitize($image['caption'] ?? ''); ?>">
                                <i class="bi bi-zoom-in"></i> View
                            </a>
                        </div>
                        <?php if (!empty($image['caption'])): ?>
                        <div class="p-3 bg-white">
                            <p class="small text-muted mb-0"><?php echo sanitize($image['caption']); ?></p>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <!-- Fallback Static Gallery -->
                <?php for ($i = 1; $i <= 6; $i++): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="gallery-item">
                        <img src="https://placehold.co/400x250/E5E7EB/9CA3AF?text=Gallery" alt="Gallery Image <?php echo $i; ?>">
                        <div class="overlay">
                            <a href="#" class="btn btn-light btn-sm rounded-pill">
                                <i class="bi bi-zoom-in"></i> View
                            </a>
                        </div>
                    </div>
                </div>
                <?php endfor; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Image Modal -->
<div class="modal fade" id="imageModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center p-0">
                <img src="" alt="" class="img-fluid" id="modalImage">
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <p class="text-muted mb-0" id="modalCaption"></p>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById('imageModal');
    imageModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const image = button.getAttribute('data-image');
        const caption = button.getAttribute('data-caption');
        
        document.getElementById('modalImage').src = image;
        document.getElementById('modalCaption').textContent = caption;
    });
});
</script>

<?php require_once 'includes/footer.php'; ?>
