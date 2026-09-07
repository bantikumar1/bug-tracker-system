const { getPool } = require('../config/db');

const NotificationModel = {
  async getByUserId(userId) {
    const pool = getPool();
    // Check if user has any notifications, if 0, seed sample notifications
    const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ?', [userId]);
    if (existing[0].cnt === 0) {
      await this.seedSampleNotifications(userId);
    }

    const [rows] = await pool.query(
      `SELECT id, user_id, title, message, type, COALESCE(is_read, 0) as is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  async markAsRead(id, userId) {
    const pool = getPool();
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async markAsUnread(id, userId) {
    const pool = getPool();
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 0 WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async deleteById(id, userId) {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async clearAllByUserId(userId) {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM notifications WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  },

  async seedSampleNotifications(userId) {
    const pool = getPool();
    const samples = [
      { title: 'Bug #14 status changed to FIXED', message: 'The high priority issue has been resolved.', type: 'success', is_read: 0 },
      { title: 'New bug assigned to you: #15', message: 'Login flow failure on Safari mobile browser.', type: 'warning', is_read: 0 },
      { title: 'Welcome to BugTracker', message: 'Explore assigned bugs and system metrics from your dashboard.', type: 'info', is_read: 1 }
    ];

    for (const item of samples) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, ?)',
        [userId, item.title, item.message, item.type, item.is_read]
      );
    }
  }
};

module.exports = NotificationModel;
