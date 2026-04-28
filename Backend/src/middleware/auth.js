/**
 * auth.js - Authentication middleware for FarmAid
 */

const jwt = require('jsonwebtoken');
const { AppError, ERROR_CODES } = require('../utils/constants');
const { User } = require('../models');

/**
 * Verify JWT access token
 */
const verifyAccessToken = (token) => {
  try {
    console.log('Token to verify:', token.substring(0, 20) + '...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET || 'NOT SET');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    throw new AppError('Invalid token', 401, ERROR_CODES.INVALID_TOKEN);
  }
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? authHeader.substring(0, 30) + '...' : 'MISSING');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, ERROR_CODES.NO_TOKEN);
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token.substring(0, 20) + '...');
    
    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = await User.findByPk(decoded.sub || decoded.id);
    if (!user) {
      throw new AppError('User not found', 401, ERROR_CODES.USER_NOT_FOUND);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is not active', 403, ERROR_CODES.ACCOUNT_INACTIVE);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize admin middleware
 * Checks if authenticated user has admin role
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401, ERROR_CODES.AUTH_REQUIRED));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403, ERROR_CODES.ADMIN_REQUIRED));
  }

  next();
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      
      const user = await User.findByPk(decoded.sub || decoded.id);
      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }
    next();
  } catch (error) {
    // If token is invalid, just proceed without user
    next();
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has one of the allowed roles
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, ERROR_CODES.AUTH_REQUIRED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, ERROR_CODES.INSUFFICIENT_PERMISSIONS));
    }

    next();
  };
};

/**
 * Generate tokens (access and refresh)
 */
const generateTokens = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: `${user.firstName} ${user.lastName}`
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

module.exports = {
  verifyAccessToken,
  authenticate,
  protect: authenticate, // Alias for backward compatibility
  authorizeAdmin,
  optionalAuth,
  authorizeRoles,
  authorize: authorizeRoles, // Alias for backward compatibility
  generateTokens
};