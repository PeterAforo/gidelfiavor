// Cloudinary integration for persistent image storage
// This replaces local file storage which is lost on Render redeploys

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Initialize Cloudinary with environment variables
export const initCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary not configured. Using local storage (files will be lost on redeploy).');
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('Cloudinary configured successfully');
  return true;
};

// Upload buffer to Cloudinary
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'gidelfiavor',
        resource_type: 'auto',
        transformation: options.transformation || [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Upload file from multer
export const uploadFileToCloudinary = async (file, folder = 'general') => {
  try {
    const result = await uploadToCloudinary(file.buffer, { folder: `gidelfiavor/${folder}` });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === 'ok' };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

// Generate optimized URL with transformations
export const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
};

// Generate responsive image URLs
export const getResponsiveUrls = (publicId) => {
  return {
    thumbnail: cloudinary.url(publicId, { width: 150, height: 150, crop: 'fill', fetch_format: 'auto', quality: 'auto' }),
    small: cloudinary.url(publicId, { width: 400, crop: 'limit', fetch_format: 'auto', quality: 'auto' }),
    medium: cloudinary.url(publicId, { width: 800, crop: 'limit', fetch_format: 'auto', quality: 'auto' }),
    large: cloudinary.url(publicId, { width: 1200, crop: 'limit', fetch_format: 'auto', quality: 'auto' }),
    original: cloudinary.url(publicId, { fetch_format: 'auto', quality: 'auto' }),
  };
};

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

export default {
  initCloudinary,
  uploadToCloudinary,
  uploadFileToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
  getResponsiveUrls,
  isCloudinaryConfigured,
};
