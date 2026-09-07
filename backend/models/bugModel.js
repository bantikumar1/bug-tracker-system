const { getPool } = require('../config/db');

const BugModel = {
  async create({ title, description, priority, created_by, bug_screenshot = null, bug_video = null }) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO bugs (title, description, priority, status, created_by, assigned_to, bug_screenshot, bug_video) 
       VALUES (?, ?, ?, 'OPEN', ?, NULL, ?, ?)`,
      [title, description, priority, created_by, bug_screenshot, bug_video]
    );
    return this.getById(result.insertId);
  },

  async getAll(filters = {}) {
    const pool = getPool();
    let query = `
      SELECT 
        b.id,
        b.title,
        b.description,
        b.priority,
        b.status,
        b.bug_screenshot,
        b.bug_video,
        b.code_file,
        b.code_line,
        b.created_by,
        b.assigned_to,
        b.created_at,
        b.updated_at,
        u1.name AS creator_name,
        u1.email AS creator_email,
        u2.name AS assignee_name,
        u2.email AS assignee_email
       FROM bugs b
       JOIN users u1 ON b.created_by = u1.id
       LEFT JOIN users u2 ON b.assigned_to = u2.id
    `;

    const whereClauses = [];
    const queryParams = [];

    if (filters.status) {
      whereClauses.push('b.status = ?');
      queryParams.push(filters.status.toUpperCase());
    }

    if (filters.assigned_to === 'unassigned' || filters.assigned_to === 'null') {
      whereClauses.push('b.assigned_to IS NULL');
    } else if (filters.assigned_to) {
      whereClauses.push('b.assigned_to = ?');
      queryParams.push(filters.assigned_to);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY b.id DESC`;

    const [rows] = await pool.query(query, queryParams);
    return rows;
  },

  async getById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT 
        b.id,
        b.title,
        b.description,
        b.priority,
        b.status,
        b.bug_screenshot,
        b.bug_video,
        b.code_file,
        b.code_line,
        b.created_by,
        b.assigned_to,
        b.created_at,
        b.updated_at,
        u1.name AS creator_name,
        u1.email AS creator_email,
        u2.name AS assignee_name,
        u2.email AS assignee_email
       FROM bugs b
       JOIN users u1 ON b.created_by = u1.id
       LEFT JOIN users u2 ON b.assigned_to = u2.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async assignToUser(bugId, userId) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE bugs 
         SET assigned_to = ?, status = 'IN_PROGRESS' 
         WHERE id = ?`,
        [userId, bugId]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return this.getById(bugId);
  },

  async updateStatus(bugId, status) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE bugs 
         SET status = ? 
         WHERE id = ?`,
        [status, bugId]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return this.getById(bugId);
  }
};

module.exports = BugModel;
