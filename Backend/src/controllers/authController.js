
// src/controllers/authController.js
const { User } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

// Store refresh tokens (in production, use a database table)
const refreshTokenStore = new Map();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '15m' } // Short-lived access token
    );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    // Store refresh token (in production, store in database with user association)
    refreshTokenStore.set(refreshToken, {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return refreshToken;
};

// Generate Password Reset Token
const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phoneNumber, location } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password, // Will be hashed by model hook
            role: role || 'farmer',
            phoneNumber,
            location,
            isActive: true,
            emailVerified: false
        });

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Send welcome email (optional)
        try {
            await sendEmail({
                to: email,
                subject: 'Welcome to FarmAid',
                template: 'welcome',
                data: { name }
            });
        } catch (emailError) {
            logger.error('Failed to send welcome email:', emailError);
            // Don't fail registration if email fails
        }

        logger.info(`New user registered: ${email}`);

        res.status(201).json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                location: user.location
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password included
        const user = await User.findOne({
            where: { email },
            attributes: { include: ['password'] }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
        }

        // Check password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        logger.info(`User logged in: ${email}`);

        res.json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                location: user.location,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Check if refresh token exists in store
        const tokenData = refreshTokenStore.get(refreshToken);
        if (!tokenData) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Check if token is expired
        if (tokenData.expiresAt < new Date()) {
            refreshTokenStore.delete(refreshToken);
            return res.status(401).json({ error: 'Refresh token expired' });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            );
        } catch (error) {
            refreshTokenStore.delete(refreshToken);
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Find user
        const user = await User.findByPk(decoded.id);
        if (!user || !user.isActive) {
            refreshTokenStore.delete(refreshToken);
            return res.status(401).json({ error: 'User not found or inactive' });
        }

        // Generate new access token
        const newToken = generateToken(user);

        // Optionally generate new refresh token (rotate)
        const newRefreshToken = generateRefreshToken(user);
        refreshTokenStore.delete(refreshToken); // Remove old token

        logger.info(`Token refreshed for user: ${user.email}`);

        res.json({
            success: true,
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        // Always return success even if user doesn't exist (security)
        if (!user) {
            logger.info(`Password reset requested for non-existent email: ${email}`);
            return res.json({
                success: true,
                message: 'If your email is registered, you will receive a password reset link'
            });
        }

        // Generate reset token
        const resetToken = generatePasswordResetToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Store reset token in database
        await user.update({
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry
        });

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        try {
            await sendEmail({
                to: email,
                subject: 'Password Reset Request',
                template: 'password-reset',
                data: {
                    name: user.name,
                    resetUrl,
                    expiresIn: '1 hour'
                }
            });

            logger.info(`Password reset email sent to: ${email}`);
        } catch (emailError) {
            logger.error('Failed to send password reset email:', emailError);
            // Don't expose email failure to client
        }

        res.json({
            success: true,
            message: 'If your email is registered, you will receive a password reset link'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Invalidate all refresh tokens for this user
        for (const [rt, data] of refreshTokenStore.entries()) {
            if (data.userId === user.id) {
                refreshTokenStore.delete(rt);
            }
        }

        // Send confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Successful',
                template: 'password-reset-confirmation',
                data: { name: user.name }
            });
        } catch (emailError) {
            logger.error('Failed to send password reset confirmation:', emailError);
        }

        logger.info(`Password reset successful for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires']
            },
            include: [
                {
                    association: 'farm',
                    attributes: ['id', 'name', 'size', 'location', 'mainLivestock']
                },
                {
                    association: 'livestock',
                    limit: 5,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user statistics
        const stats = await getUserStats(user.id);

        res.json({
            success: true,
            data: {
                ...user.toJSON(),
                stats
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, location, farmName, farmSize } = req.body;

        const user = await User.findByPk(req.user.id);

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            user.email = email;
            user.emailVerified = false; // Require re-verification
        }

        // Update fields
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (location) user.location = location;

        // Update farm details if they exist
        if (user.farm) {
            await user.farm.update({
                name: farmName || user.farm.name,
                size: farmSize || user.farm.size
            });
        }

        await user.save();

        logger.info(`Profile updated for user: ${user.email}`);

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                location: user.location,
                farm: user.farm
            },
            message: 'Profile updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   POST /api/auth/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id, {
            attributes: { include: ['password'] }
        });

        // Verify current password
        const isValidPassword = await user.validatePassword(currentPassword);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Invalidate all refresh tokens for this user
        for (const [rt, data] of refreshTokenStore.entries()) {
            if (data.userId === user.id) {
                refreshTokenStore.delete(rt);
            }
        }

        // Send notification email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Changed',
                template: 'password-changed',
                data: { name: user.name }
            });
        } catch (emailError) {
            logger.error('Failed to send password change notification:', emailError);
        }

        logger.info(`Password changed for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        // Remove refresh token if provided
        if (refreshToken) {
            refreshTokenStore.delete(refreshToken);
        }

        // Log logout
        logger.info(`User logged out: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete account
// @route   DELETE /api/auth/account
exports.deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        // Invalidate all refresh tokens
        for (const [rt, data] of refreshTokenStore.entries()) {
            if (data.userId === user.id) {
                refreshTokenStore.delete(rt);
            }
        }

        // Soft delete or hard delete based on requirements
        await User.destroy({ where: { id: req.user.id } });

        // Send goodbye email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Account Deleted',
                template: 'account-deleted',
                data: { name: user.name }
            });
        } catch (emailError) {
            logger.error('Failed to send account deletion email:', emailError);
        }

        logger.info(`Account deleted: ${user.email}`);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        await user.update({
            emailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpires: null
        });

        logger.info(`Email verified for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
exports.resendVerification = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new verification token
        const verificationToken = generatePasswordResetToken();
        const verificationExpires = new Date(Date.now() + 24 * 3600000); // 24 hours

        await user.update({
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
        });

        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Verify Your Email',
            template: 'email-verification',
            data: {
                name: user.name,
                verificationUrl,
                expiresIn: '24 hours'
            }
        });

        res.json({
            success: true,
            message: 'Verification email sent'
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get user statistics
async function getUserStats(userId) {
    // This would typically query your database for various counts
    // Placeholder implementation
    return {
        totalLivestock: 0,
        totalConsultations: 0,
        activeConsultations: 0,
        completedConsultations: 0,
        totalHealthRecords: 0,
        joinedDate: null,
        lastActive: null
    };
}

// Clean up expired refresh tokens periodically (call this in a cron job)
function cleanupExpiredTokens() {
    const now = new Date();
    for (const [token, data] of refreshTokenStore.entries()) {
        if (data.expiresAt < now) {
            refreshTokenStore.delete(token);
        }
    }
}

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

module.exports = exports;