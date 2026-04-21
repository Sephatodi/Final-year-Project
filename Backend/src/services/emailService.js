const logger = require('../utils/logger');

/**
 * Send an email using a template
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name
 * @param {Object} options.data - Data for the template context
 */
const sendEmail = async ({ to, subject, template, data }) => {
    try {
        // Placeholder for actual email provider integration
        // You can integrate Nodemailer or an API-based service here

        logger.info(`[Email Service] Mock sending "${template}" email to: ${to}`);

        // Simulate network latency
        return {
            success: true,
            messageId: `mock_${Date.now()}`,
            to,
            subject
        };
    } catch (error) {
        logger.error(`[Email Service] Failed to send email to ${to}:`, error);
        throw error;
    }
};

module.exports = {
    sendEmail
};