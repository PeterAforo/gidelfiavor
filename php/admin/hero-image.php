<?php
$pageTitle = 'Hero Image & Theme';
require_once '../config/config.php';
require_once '../includes/color-extractor.php';
requireLogin();

$message = '';
$error = '';

// Handle image upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['hero_image'])) {
    $file = $_FILES['hero_image'];
    
    if ($file['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (in_array($file['type'], $allowedTypes)) {
            $targetPath = '../assets/images/hero-image.png';
            
            // Create images directory if not exists
            if (!is_dir('../assets/images')) {
                mkdir('../assets/images', 0755, true);
            }
            
            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                // Extract colors from the new image
                $colors = ColorExtractor::getThemeFromImage($targetPath);
                
                // Save to database
                if (ColorExtractor::saveThemeColors($colors)) {
                    $message = "Hero image uploaded and theme colors updated successfully!";
                } else {
                    $message = "Hero image uploaded! Theme colors could not be saved to database.";
                }
            } else {
                $error = "Failed to upload image.";
            }
        } else {
            $error = "Invalid file type. Please upload JPG, PNG, GIF, or WebP.";
        }
    } else {
        $error = "Upload error: " . $file['error'];
    }
}

// Handle manual color update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['primary_color'])) {
    $primaryColor = sanitize($_POST['primary_color']);
    
    if (preg_match('/^#[0-9A-Fa-f]{6}$/', $primaryColor)) {
        $colors = [
            'primary' => $primaryColor,
            'primary_dark' => ColorExtractor::darkenColor($primaryColor, 20),
            'primary_light' => ColorExtractor::lightenColor($primaryColor, 20)
        ];
        
        if (ColorExtractor::saveThemeColors($colors)) {
            $message = "Theme colors updated successfully!";
        } else {
            $error = "Failed to save theme colors.";
        }
    } else {
        $error = "Invalid color format. Use hex format like #755941";
    }
}

// Handle extract from current image
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['extract_colors'])) {
    $imagePath = '../assets/images/hero-image.png';
    
    if (file_exists($imagePath)) {
        $colors = ColorExtractor::getThemeFromImage($imagePath);
        
        if (ColorExtractor::saveThemeColors($colors)) {
            $message = "Colors extracted and saved: " . $colors['primary'];
        } else {
            $error = "Failed to save extracted colors.";
        }
    } else {
        $error = "Hero image not found.";
    }
}

// Get current colors
$currentColors = ColorExtractor::getSavedThemeColors();

require_once 'includes/admin-header.php';
?>

<div class="container-fluid py-4">
    <?php if ($message): ?>
    <div class="alert alert-success alert-dismissible fade show">
        <?php echo $message; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    <?php endif; ?>
    
    <?php if ($error): ?>
    <div class="alert alert-danger alert-dismissible fade show">
        <?php echo $error; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    <?php endif; ?>
    
    <div class="row g-4">
        <!-- Hero Image Upload -->
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Hero Image</h5>
                </div>
                <div class="card-body">
                    <div class="mb-4 text-center">
                        <?php if (file_exists('../assets/images/hero-image.png')): ?>
                        <img src="<?php echo SITE_URL; ?>/assets/images/hero-image.png?v=<?php echo time(); ?>" 
                             alt="Current Hero Image" 
                             class="img-fluid rounded" 
                             style="max-height: 300px;">
                        <?php else: ?>
                        <div class="bg-light p-5 rounded text-muted">
                            No hero image uploaded
                        </div>
                        <?php endif; ?>
                    </div>
                    
                    <form method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="form-label">Upload New Hero Image</label>
                            <input type="file" class="form-control" name="hero_image" accept="image/*" required>
                            <small class="text-muted">Recommended: PNG with transparent background, at least 800px tall</small>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-upload me-2"></i> Upload & Extract Colors
                        </button>
                    </form>
                    
                    <hr>
                    
                    <form method="POST">
                        <input type="hidden" name="extract_colors" value="1">
                        <button type="submit" class="btn btn-outline-primary">
                            <i class="bi bi-palette me-2"></i> Re-extract Colors from Current Image
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Theme Colors -->
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Theme Colors</h5>
                </div>
                <div class="card-body">
                    <div class="row g-3 mb-4">
                        <div class="col-4 text-center">
                            <div class="rounded p-4 mb-2" style="background-color: <?php echo $currentColors['primary']; ?>;">
                                &nbsp;
                            </div>
                            <small class="text-muted">Primary<br><?php echo $currentColors['primary']; ?></small>
                        </div>
                        <div class="col-4 text-center">
                            <div class="rounded p-4 mb-2" style="background-color: <?php echo $currentColors['primary_dark']; ?>;">
                                &nbsp;
                            </div>
                            <small class="text-muted">Dark<br><?php echo $currentColors['primary_dark']; ?></small>
                        </div>
                        <div class="col-4 text-center">
                            <div class="rounded p-4 mb-2" style="background-color: <?php echo $currentColors['primary_light']; ?>;">
                                &nbsp;
                            </div>
                            <small class="text-muted">Light<br><?php echo $currentColors['primary_light']; ?></small>
                        </div>
                    </div>
                    
                    <form method="POST">
                        <div class="mb-3">
                            <label class="form-label">Set Primary Color Manually</label>
                            <div class="input-group">
                                <input type="color" class="form-control form-control-color" id="colorPicker" 
                                       value="<?php echo $currentColors['primary']; ?>" 
                                       onchange="document.getElementById('primaryColorInput').value = this.value">
                                <input type="text" class="form-control" name="primary_color" id="primaryColorInput"
                                       value="<?php echo $currentColors['primary']; ?>" 
                                       pattern="^#[0-9A-Fa-f]{6}$" placeholder="#755941">
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                    
                    <hr>
                    
                    <h6 class="mb-3">Preview</h6>
                    <button class="btn rounded-pill px-4" style="background-color: <?php echo $currentColors['primary']; ?>; color: white;">
                        Primary Button
                    </button>
                    <button class="btn rounded-pill px-4 ms-2" style="background-color: <?php echo $currentColors['primary_dark']; ?>; color: white;">
                        Dark Button
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('primaryColorInput').addEventListener('input', function() {
    if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
        document.getElementById('colorPicker').value = this.value;
    }
});
</script>

<?php require_once 'includes/admin-footer.php'; ?>
