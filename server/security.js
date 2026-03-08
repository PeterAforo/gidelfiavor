// Enhanced security middleware and utilities

import helmet from 'helmet';

// Content Security Policy configuration
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "blob:", "https:", "https://res.cloudinary.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", "https://www.google-analytics.com", "https://res.cloudinary.com"],
    frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? cspConfig : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Input sanitization utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[sanitizeInput(key)] = sanitizeObject(value);
  }
  return sanitized;
};

// SQL injection prevention (parameterized queries reminder)
export const validateId = (id) => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed < 1) {
    throw new Error('Invalid ID');
  }
  return parsed;
};

// XSS prevention for HTML content
export const escapeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

// Rate limiting configurations
export const rateLimitConfigs = {
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
  },
  strict: {
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests, please try again later.' },
  },
  auth: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Too many login attempts, please try again later.' },
  },
};

// CORS configuration
export const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://www.gidelfiavor.com',
      'https://gidelfiavor.com',
      'https://gidelfiavor.vercel.app',
      process.env.NODE_ENV !== 'production' && 'http://localhost:8080',
      process.env.NODE_ENV !== 'production' && 'http://localhost:5173',
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};

// Security audit checklist
export const securityChecklist = {
  authentication: {
    jwtTokens: true,
    bcryptHashing: true,
    tokenExpiration: true,
    secureStorage: true,
  },
  authorization: {
    adminRouteProtection: true,
    roleBasedAccess: true,
  },
  inputValidation: {
    parameterizedQueries: true,
    inputSanitization: true,
    xssPrevention: true,
  },
  transport: {
    httpsOnly: true,
    secureHeaders: true,
    cors: true,
  },
  rateLimiting: {
    apiEndpoints: true,
    authEndpoints: true,
  },
};

export default {
  securityHeaders,
  sanitizeInput,
  sanitizeObject,
  validateId,
  escapeHtml,
  rateLimitConfigs,
  corsConfig,
  securityChecklist,
};
