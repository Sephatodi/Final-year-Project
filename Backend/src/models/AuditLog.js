/**
 * AuditLog.js - Audit log model for FarmAid
 * Tracks all admin actions and system events
 */

const { pgPool } = require('../config/database');
const logger = require('../utils/logger');

class AuditLog {
  /**
   * Create a new audit log entry
   */
  static async create({
    userId,
    action,
    resource,
    resourceId,
    details,
    changes,
    oldValues,
    ipAddress,
    userAgent
  }) {
    try {
      const query = `
        INSERT INTO audit_logs (
          user_id, action, resource, resource_id, details, changes, old_values,
          ip_address, user_agent, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, created_at
      `;

      const values = [
        userId,
        action,
        resource,
        resourceId,
        details ? JSON.stringify(details) : null,
        changes ? JSON.stringify(changes) : null,
        oldValues ? JSON.stringify(oldValues) : null,
        ipAddress,
        userAgent,
        new Date()
      ];

      const result = await pgPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Get audit logs with filters
   */
  static async findWithFilters({
    action,
    userId,
    resource,
    from,
    to,
    page = 1,
    limit = 50
  }) {
    try {
      let query = 'SELECT * FROM audit_logs WHERE 1=1';
      const values = [];
      let paramIndex = 1;

      if (action) {
        query += ` AND action = $${paramIndex}`;
        values.push(action);
        paramIndex++;
      }

      if (userId) {
        query += ` AND user_id = $${paramIndex}`;
        values.push(userId);
        paramIndex++;
      }

      if (resource) {
        query += ` AND resource = $${paramIndex}`;
        values.push(resource);
        paramIndex++;
      }

      if (from) {
        query += ` AND created_at >= $${paramIndex}`;
        values.push(from);
        paramIndex++;
      }

      if (to) {
        query += ` AND created_at <= $${paramIndex}`;
        values.push(to);
        paramIndex++;
      }

      // Get total count
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
      const countResult = await pgPool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count);

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);

      const result = await pgPool.query(query, values);

      return {
        items: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error finding audit logs:', error);
      throw error;
    }
  }

  /**
   * Get audit logs by user
   */
  static async getByUser(userId, { page = 1, limit = 20, from, to }) {
    return this.findWithFilters({
      userId,
      from,
      to,
      page,
      limit
    });
  }

  /**
   * Get recent audit logs
   */
  static async getRecent(limit = 50) {
    try {
      const query = `
        SELECT al.*, u.first_name, u.last_name, u.email
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT $1
      `;

      const result = await pgPool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting recent audit logs:', error);
      throw error;
    }
  }

  /**
   * Get audit log statistics
   */
  static async getStats({ from, to } = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_logs,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT action) as unique_actions,
          COUNT(DISTINCT resource) as unique_resources
        FROM audit_logs
        WHERE 1=1
      `;
      
      const values = [];
      let paramIndex = 1;

      if (from) {
        query += ` AND created_at >= $${paramIndex}`;
        values.push(from);
        paramIndex++;
      }

      if (to) {
        query += ` AND created_at <= $${paramIndex}`;
        values.push(to);
        paramIndex++;
      }

      const result = await pgPool.query(query, values);
      
      // Get action breakdown
      const actionQuery = `
        SELECT action, COUNT(*) as count
        FROM audit_logs
        WHERE 1=1
        ${from ? `AND created_at >= $1` : ''}
        ${to ? `AND created_at <= $2` : ''}
        GROUP BY action
        ORDER BY count DESC
        LIMIT 10
      `;
      
      const actionValues = [];
      if (from) actionValues.push(from);
      if (to) actionValues.push(to);
      
      const actionResult = await pgPool.query(actionQuery, actionValues);

      return {
        summary: result.rows[0],
        topActions: actionResult.rows
      };
    } catch (error) {
      logger.error('Error getting audit log stats:', error);
      throw error;
    }
  }

  /**
   * Clean up old audit logs
   */
  static async cleanup(daysToKeep = 90) {
    try {
      const query = `
        DELETE FROM audit_logs
        WHERE created_at < NOW() - INTERVAL '$${daysToKeep} days'
        RETURNING COUNT(*) as deleted_count
      `;

      const result = await pgPool.query(query);
      logger.info(`Cleaned up ${result.rows[0].deleted_count} old audit logs`);
      return result.rows[0].deleted_count;
    } catch (error) {
      logger.error('Error cleaning up audit logs:', error);
      throw error;
    }
  }
}

module.exports = AuditLog;