import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Image optimization settings
const OPTIMIZATION_SETTINGS = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  small: { width: 400, height: 400, quality: 85 },
  medium: { width: 800, height: 800, quality: 85 },
  large: { width: 1200, height: 1200, quality: 90 },
  original: { quality: 90 }
};

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff'];

// Check if file is an image
export const isImage = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_FORMATS.includes(ext);
};

// Optimize a single image
export const optimizeImage = async (inputPath, outputDir, options = {}) => {
  const filename = path.basename(inputPath);
  const ext = path.extname(filename).toLowerCase();
  const nameWithoutExt = path.basename(filename, ext);
  
  if (!isImage(filename)) {
    return { success: false, error: 'Not a supported image format' };
  }
  
  const results = {};
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Generate optimized versions
    for (const [size, settings] of Object.entries(OPTIMIZATION_SETTINGS)) {
      if (size === 'original') {
        // Just optimize the original without resizing
        const outputPath = path.join(outputDir, `${nameWithoutExt}-original.webp`);
        await sharp(inputPath)
          .webp({ quality: settings.quality })
          .toFile(outputPath);
        results[size] = outputPath;
      } else {
        // Resize and optimize
        const outputPath = path.join(outputDir, `${nameWithoutExt}-${size}.webp`);
        await sharp(inputPath)
          .resize(settings.width, settings.height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: settings.quality })
          .toFile(outputPath);
        results[size] = outputPath;
      }
    }
    
    return {
      success: true,
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(inputPath).size
      },
      optimized: results
    };
  } catch (error) {
    console.error('Image optimization error:', error);
    return { success: false, error: error.message };
  }
};

// Optimize image on upload (middleware)
export const optimizeOnUpload = async (req, res, next) => {
  if (!req.file || !isImage(req.file.originalname)) {
    return next();
  }
  
  try {
    const inputPath = req.file.path;
    const outputDir = path.dirname(inputPath);
    
    // Create optimized WebP version
    const optimizedPath = inputPath.replace(/\.[^.]+$/, '.webp');
    
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(optimizedPath);
    
    // Add optimized path to request
    req.file.optimizedPath = optimizedPath;
    req.file.optimizedUrl = req.file.path.replace(/\.[^.]+$/, '.webp').replace(/\\/g, '/');
    
    next();
  } catch (error) {
    console.error('Image optimization middleware error:', error);
    next(); // Continue without optimization on error
  }
};

// Generate responsive image srcset
export const generateSrcSet = (baseUrl) => {
  const ext = path.extname(baseUrl);
  const base = baseUrl.replace(ext, '');
  
  return {
    srcset: `${base}-small.webp 400w, ${base}-medium.webp 800w, ${base}-large.webp 1200w`,
    sizes: '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px',
    src: `${base}-medium.webp`
  };
};

export default { optimizeImage, optimizeOnUpload, isImage, generateSrcSet };
