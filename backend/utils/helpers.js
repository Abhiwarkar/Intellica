// utils/helpers.js - Backend Helper Functions
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * ==================== AUTH HELPERS ====================
 */

// Generate JWT Token
const generateToken = (payload, expiresIn = '30d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Hash Password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare Password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * ==================== VALIDATION HELPERS ====================
 */

// Validate Email Format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate Password Strength
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Sanitize User Input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

/**
 * ==================== RESPONSE HELPERS ====================
 */

// Success Response
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Error Response
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

// Validation Error Response
const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation Error',
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * ==================== DATE/TIME HELPERS ====================
 */

// Get Date Range for Analytics
const getDateRange = (period = '30d') => {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate, endDate: now };
};

// Format Date to ISO String
const formatDateISO = (date) => {
  return new Date(date).toISOString();
};

// Get Start of Day
const getStartOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Get End of Day
const getEndOfDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * ==================== ANALYTICS HELPERS ====================
 */

// Calculate Percentage Change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Calculate Bounce Rate
const calculateBounceRate = (totalSessions, bounceSessions) => {
  if (totalSessions === 0) return 0;
  return (bounceSessions / totalSessions) * 100;
};

// Format Percentage
const formatPercentage = (value, decimals = 1) => {
  return parseFloat(value.toFixed(decimals));
};

// Calculate Average Session Time
const calculateAverageSessionTime = (totalSessionTime, totalSessions) => {
  if (totalSessions === 0) return '0m 0s';
  const avgSeconds = totalSessionTime / totalSessions;
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = Math.floor(avgSeconds % 60);
  return `${minutes}m ${seconds}s`;
};

// Format Number with Commas
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Generate Session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * ==================== DATABASE HELPERS ====================
 */

// Pagination Helper
const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Build Pagination Response
const buildPaginationResponse = (data, totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage,
      hasPrevPage,
      limit
    }
  };
};

// Convert String to ObjectId
const toObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

/**
 * ==================== UTILITY HELPERS ====================
 */

// Generate Random String
const generateRandomString = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Capitalize First Letter
const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Truncate Text
const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

// Deep Clone Object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove Undefined/Null Values from Object
const cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * ==================== ERROR HANDLING HELPERS ====================
 */

// Create Custom Error
const createError = (message, statusCode = 500, isOperational = true) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

// Handle Async Errors (Wrapper Function)
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Log Error
const logError = (error, req = null) => {
  console.error('=== ERROR LOG ===');
  console.error('Time:', new Date().toISOString());
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  if (req) {
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Request Body:', req.body);
  }
  console.error('==================');
};

/**
 * ==================== EXPORT ALL HELPERS ====================
 */
module.exports = {
  // Auth Helpers
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  
  // Validation Helpers
  isValidEmail,
  isValidObjectId,
  isStrongPassword,
  sanitizeInput,
  
  // Response Helpers
  sendSuccess,
  sendError,
  sendValidationError,
  
  // Date/Time Helpers
  getDateRange,
  formatDateISO,
  getStartOfDay,
  getEndOfDay,
  
  // Analytics Helpers
  calculatePercentageChange,
  calculateBounceRate,
  formatPercentage,
  calculateAverageSessionTime,
  formatNumber,
  generateSessionId,
  
  // Database Helpers
  getPaginationParams,
  buildPaginationResponse,
  toObjectId,
  
  // Utility Helpers
  generateRandomString,
  capitalize,
  truncateText,
  deepClone,
  cleanObject,
  
  // Error Handling Helpers
  createError,
  asyncHandler,
  logError
};