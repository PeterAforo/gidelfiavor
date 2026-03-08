// Simple monitoring and logging service

// Request logging
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')?.substring(0, 100)
    };
    
    // Log errors and slow requests
    if (res.statusCode >= 400 || duration > 1000) {
      console.warn('[ALERT]', JSON.stringify(log));
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('[REQUEST]', JSON.stringify(log));
    }
  });
  
  next();
};

// Error tracking
const errorLog = [];
const MAX_ERROR_LOG = 100;

export const trackError = (error, context = {}) => {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack?.split('\n').slice(0, 5).join('\n'),
    context
  };
  
  errorLog.unshift(errorEntry);
  if (errorLog.length > MAX_ERROR_LOG) {
    errorLog.pop();
  }
  
  console.error('[ERROR]', JSON.stringify(errorEntry));
  
  // In production, you could send to external service here
  // e.g., Sentry, LogRocket, etc.
};

// Health metrics
const metrics = {
  startTime: Date.now(),
  requestCount: 0,
  errorCount: 0,
  avgResponseTime: 0,
  responseTimes: []
};

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  metrics.requestCount++;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.responseTimes.push(duration);
    
    // Keep only last 100 response times
    if (metrics.responseTimes.length > 100) {
      metrics.responseTimes.shift();
    }
    
    // Calculate average
    metrics.avgResponseTime = Math.round(
      metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
    );
    
    if (res.statusCode >= 400) {
      metrics.errorCount++;
    }
  });
  
  next();
};

// Get health status
export const getHealthStatus = () => {
  const uptime = Math.round((Date.now() - metrics.startTime) / 1000);
  const memoryUsage = process.memoryUsage();
  
  return {
    status: 'healthy',
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`,
    metrics: {
      totalRequests: metrics.requestCount,
      errorCount: metrics.errorCount,
      errorRate: metrics.requestCount > 0 
        ? `${((metrics.errorCount / metrics.requestCount) * 100).toFixed(2)}%` 
        : '0%',
      avgResponseTime: `${metrics.avgResponseTime}ms`
    },
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
    },
    recentErrors: errorLog.slice(0, 5)
  };
};

// Get recent errors
export const getRecentErrors = (limit = 20) => {
  return errorLog.slice(0, limit);
};

// Alert thresholds
export const checkAlerts = () => {
  const alerts = [];
  const memoryUsage = process.memoryUsage();
  
  // High memory usage alert
  if (memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
    alerts.push({
      type: 'memory',
      severity: 'warning',
      message: `High memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
    });
  }
  
  // High error rate alert
  if (metrics.requestCount > 100 && (metrics.errorCount / metrics.requestCount) > 0.1) {
    alerts.push({
      type: 'errors',
      severity: 'critical',
      message: `High error rate: ${((metrics.errorCount / metrics.requestCount) * 100).toFixed(2)}%`
    });
  }
  
  // Slow response time alert
  if (metrics.avgResponseTime > 500) {
    alerts.push({
      type: 'performance',
      severity: 'warning',
      message: `Slow average response time: ${metrics.avgResponseTime}ms`
    });
  }
  
  return alerts;
};

export default {
  requestLogger,
  trackError,
  metricsMiddleware,
  getHealthStatus,
  getRecentErrors,
  checkAlerts
};
