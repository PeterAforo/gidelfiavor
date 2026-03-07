/**
 * Input Validation Helpers for API Endpoints
 * Provides sanitization and validation functions to prevent injection attacks
 */

// Sanitize string input - remove HTML tags and trim
export const sanitizeString = (str, maxLength = 500) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().substring(0, maxLength);
};

// Sanitize HTML content - allow safe tags for rich text
export const sanitizeHtml = (html, maxLength = 50000) => {
  if (typeof html !== 'string') return '';
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .substring(0, maxLength);
};

// Validate email format
export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Validate URL format
export const isValidUrl = (url) => {
  if (url === null || url === undefined || url === '') return true; // Allow empty/null
  if (typeof url !== 'string') return false;
  // Allow relative URLs starting with /
  if (url.startsWith('/')) return url.length <= 500;
  try {
    new URL(url);
    return url.length <= 500;
  } catch {
    return false;
  }
};

// Validate integer
export const isValidInt = (value) => {
  return Number.isInteger(value) || (typeof value === 'string' && /^\d+$/.test(value));
};

// Validate boolean
export const isValidBoolean = (value) => {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
};

// Parse boolean from various inputs
export const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1' || value === 1) return true;
  if (value === 'false' || value === '0' || value === 0) return false;
  return null;
};

// Validation schemas for different entities
export const validators = {
  book: (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    if (data.title && data.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    if (data.cover_url && !isValidUrl(data.cover_url)) {
      errors.push('Invalid cover URL');
    }
    if (data.purchase_link && !isValidUrl(data.purchase_link)) {
      errors.push('Invalid purchase link URL');
    }
    return { valid: errors.length === 0, errors };
  },

  article: (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    if (data.title && data.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    if (data.image_url && !isValidUrl(data.image_url)) {
      errors.push('Invalid image URL');
    }
    return { valid: errors.length === 0, errors };
  },

  page: (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) {
      errors.push('Slug is required');
    }
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    return { valid: errors.length === 0, errors };
  },

  comment: (data) => {
    const errors = [];
    if (!data.author_name || typeof data.author_name !== 'string' || data.author_name.trim().length === 0) {
      errors.push('Name is required');
    }
    if (!data.author_email || !isValidEmail(data.author_email)) {
      errors.push('Valid email is required');
    }
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      errors.push('Comment content is required');
    }
    if (data.content && data.content.length > 2000) {
      errors.push('Comment must be less than 2000 characters');
    }
    return { valid: errors.length === 0, errors };
  },

  testimonial: (data) => {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required');
    }
    if (!data.quote || typeof data.quote !== 'string' || data.quote.trim().length === 0) {
      errors.push('Quote is required');
    }
    return { valid: errors.length === 0, errors };
  },

  gallery: (data) => {
    const errors = [];
    if (!data.image_url || !isValidUrl(data.image_url)) {
      errors.push('Valid image URL is required');
    }
    return { valid: errors.length === 0, errors };
  },

  menu: (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) {
      errors.push('Slug is required');
    }
    return { valid: errors.length === 0, errors };
  },

  album: (data) => {
    const errors = [];
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    return { valid: errors.length === 0, errors };
  },
};

// Middleware factory for validation
export const validateRequest = (validatorName) => {
  return (req, res, next) => {
    const validator = validators[validatorName];
    if (!validator) {
      return next();
    }
    
    const result = validator(req.body);
    if (!result.valid) {
      return res.status(400).json({ error: result.errors.join(', ') });
    }
    next();
  };
};

export default {
  sanitizeString,
  sanitizeHtml,
  isValidEmail,
  isValidUrl,
  isValidInt,
  isValidBoolean,
  parseBoolean,
  validators,
  validateRequest,
};
