/**
 * AuditLog.js - Audit log model for FarmAid
 * Tracks all admin actions and system events.
 *
 * Uses the shared Sequelize connection (`pgPool` = the Sequelize instance) with
 * raw SQL against the `audit_logs` table. Column names match the Sequelize
 * `AuditLog` model defined in models/index.js (camelCase), which is created by
 * `sequelize.sync()`.
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
          "userId", action, resource, "resourceId", details, changes, "oldValues",
          "ipAddress", "userAgent", created_at
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
      return result[0]?.[0] || result.rows?.[0];
    } catch (error) {
      logger.error('Error creating audit log:', error);
      // Audit logging must never break the primary operation.
      return null;
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
  } = {}) {
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
        query += ` AND "userId" = $${paramIndex}`;
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

      // Total count
      const countResult = await pgPool.query(
        query.replace('SELECT *', 'SELECT COUNT(*)'),
        values
      );
      const total = parseInt(countResult[0]?.[0]?.count ?? countResult.rows?.[0]?.count ?? 0);

      // Pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);

      const result = await pgPool.query(query, values);
      const items = result[0] || result.rows || [];

      return {
        items,
        logs: items,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      };
    } catch (error) {
      logger.error('Error finding audit logs:', error);
      return { items: [], logs: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
    }
  }

  /**
   * Get audit logs by user
   */
  static async getByUser(userId, { page = 1, limit = 20, from, to } = {}) {
    const res = await this.findWithFilters({ userId, from, to, page, limit });
    return { logs: res.logs, items: res.items, pagination: res.pagination };
  }

  /**
   * Get recent audit logs
   */
  static async getRecent(limit = 50) {
    try {
      const query = `
        SELECT al.*, u.name AS user_name, u.email AS user_email
        FROM audit_logs al
        LEFT JOIN users u ON al."userId" = u.id
        ORDER BY al.created_at DESC
        LIMIT $1
      `;
      const result = await pgPool.query(query, [limit]);
      return result[0] || result.rows || [];
    } catch (error) {
      logger.error('Error getting recent audit logs:', error);
      return [];
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
          COUNT(DISTINCT "userId") as unique_users,
          COUNT(DISTINCT action) as unique_actions,
          COUNT(DISTINCT resource) as unique_resources
        FROM audit_logs
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;
      if (from) { query += ` AND created_at >= $${paramIndex}`; values.push(from); paramIndex++; }
      if (to) { query += ` AND created_at <= $${paramIndex}`; values.push(to); paramIndex++; }

      const result = await pgPool.query(query, values);
      return { summary: result[0]?.[0] || result.rows?.[0], topActions: [] };
    } catch (error) {
      logger.error('Error getting audit log stats:', error);
      return { summary: {}, topActions: [] };
    }
  }

  /**
   * Clean up old audit logs
   */
  static async cleanup(daysToKeep = 90) {
    try {
      const query = `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'`;
      await pgPool.query(query);
      return 0;
    } catch (error) {
      logger.error('Error cleaning up audit logs:', error);
      return 0;
    }
  }
}

module.exports = AuditLog;