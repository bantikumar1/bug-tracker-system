const { getPool } = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByEmailExcept(email, userId) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    return rows[0] || null;
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT 
        id, name, email, role, profile_photo, 
        COALESCE(status, 'active') as status,
        COALESCE(theme, 'dark') as theme,
        COALESCE(language, 'English') as language,
        COALESCE(default_dashboard_view, 'available') as default_dashboard_view,
        COALESCE(notify_bug_assigned, 1) as notify_bug_assigned,
        COALESCE(notify_status_change, 1) as notify_status_change,
        COALESCE(notify_comment, 1) as notify_comment,
        COALESCE(twofa_enabled, 0) as twofa_enabled,
        created_at, updated_at, last_login
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByIdWithPassword(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT *, COALESCE(status, 'active') as status FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password, role, status = 'active' }) {
    const pool = getPool();
    const userStatus = status && status.trim() !== '' ? status.trim().toLowerCase() : 'active';
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, role, userStatus]
    );
    return this.findById(result.insertId);
  },

  async updateProfile(id, { name, email, profile_photo }) {
    const pool = getPool();
    if (profile_photo !== undefined) {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, profile_photo = ? WHERE id = ?',
        [name, email, profile_photo, id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
    }
    return this.findById(id);
  },

  async updatePassword(id, hashedPassword) {
    const pool = getPool();
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return true;
  },

  async updatePreferences(id, { theme, language, default_dashboard_view }) {
    const pool = getPool();
    const safeTheme = theme && theme.trim() !== '' ? theme.trim() : 'dark';
    const safeLang = language && language.trim() !== '' ? language.trim() : 'English';
    const safeView = default_dashboard_view && default_dashboard_view.trim() !== '' ? default_dashboard_view.trim() : 'available';

    await pool.query(
      `UPDATE users 
       SET theme = ?, language = ?, default_dashboard_view = ?
       WHERE id = ?`,
      [
        safeTheme, 
        safeLang, 
        safeView,
        id
      ]
    );
    return this.findById(id);
  },

  async set2FASecret(id, secret) {
    const pool = getPool();
    await pool.query('UPDATE users SET twofa_secret = ? WHERE id = ?', [secret, id]);
    return true;
  },

  async update2FAStatus(id, enabled) {
    const pool = getPool();
    await pool.query('UPDATE users SET twofa_enabled = ? WHERE id = ?', [enabled ? 1 : 0, id]);
    return this.findById(id);
  },

  async toggleStatus(id, newStatus) {
    const pool = getPool();
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    return this.findById(id);
  },

  async getActivityStats(developerId) {
    const pool = getPool();
    
    // Total bugs fixed by me
    const [fixedRows] = await pool.query(
      "SELECT COUNT(*) as fixedCount FROM bugs WHERE assigned_to = ? AND status = 'FIXED'",
      [developerId]
    );

    // Currently assigned bugs
    const [assignedRows] = await pool.query(
      "SELECT COUNT(*) as assignedCount FROM bugs WHERE assigned_to = ? AND status = 'IN_PROGRESS'",
      [developerId]
    );

    // Average time to fix (difference between updated_at and created_at for FIXED bugs)
    const [timeRows] = await pool.query(
      `SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)) as avgMinutes 
       FROM bugs 
       WHERE assigned_to = ? AND status = 'FIXED'`,
      [developerId]
    );

    const fixedCount = fixedRows[0]?.fixedCount || 0;
    const assignedCount = assignedRows[0]?.assignedCount || 0;
    const avgMinutes = Math.round(timeRows[0]?.avgMinutes || 0);

    let avgTimeToFixFormatted = 'N/A';
    if (fixedCount > 0 && avgMinutes > 0) {
      if (avgMinutes < 60) {
        avgTimeToFixFormatted = `${avgMinutes} mins`;
      } else {
        const hours = (avgMinutes / 60).toFixed(1);
        avgTimeToFixFormatted = `${hours} hrs`;
      }
    }

    return {
      fixedCount,
      assignedCount,
      avgTimeToFix: avgTimeToFixFormatted
    };
  },

  async getAll(role) {
    const pool = getPool();
    if (role) {
      const [rows] = await pool.query(
        `SELECT id, name, email, role, profile_photo, COALESCE(status, 'active') as status, created_at, updated_at 
         FROM users WHERE LOWER(role) = LOWER(?) ORDER BY id DESC`,
        [role]
      );
      return rows;
    }
    const [rows] = await pool.query(
      `SELECT id, name, email, role, profile_photo, COALESCE(status, 'active') as status, created_at, updated_at 
       FROM users WHERE LOWER(role) != "admin" ORDER BY id DESC`
    );
    return rows;
  },

  async setResetToken(userId, resetToken, expiryDate) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, expiryDate, userId]
    );
    return true;
  },

  async findByResetToken(resetToken) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [resetToken]
    );
    return rows[0] || null;
  },

  async updatePasswordAndClearResetToken(userId, hashedPassword) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, userId]
    );
    return true;
  },

  async setOTP(userId, hashedOtp, expiryDate) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET otp_code = ?, otp_expiry = ?, otp_attempts = 0 WHERE id = ?',
      [hashedOtp, expiryDate, userId]
    );
    return true;
  },

  async incrementOtpAttempts(userId) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET otp_attempts = COALESCE(otp_attempts, 0) + 1 WHERE id = ?',
      [userId]
    );
    return true;
  },

  async updatePasswordAndClearOTP(userId, hashedPassword) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET password = ?, otp_code = NULL, otp_expiry = NULL, otp_attempts = 0 WHERE id = ?',
      [hashedPassword, userId]
    );
    return true;
  },

  async setLoginOTP(userId, hashedOtp, tempToken, expiryDate) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET login_otp_code = ?, login_temp_token = ?, login_otp_expiry = ?, login_otp_attempts = 0 WHERE id = ?',
      [hashedOtp, tempToken, expiryDate, userId]
    );
    return true;
  },

  async findByLoginTempToken(tempToken) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE login_temp_token = ? AND login_otp_expiry > NOW()',
      [tempToken]
    );
    return rows[0] || null;
  },

  async incrementLoginOtpAttempts(userId) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET login_otp_attempts = COALESCE(login_otp_attempts, 0) + 1 WHERE id = ?',
      [userId]
    );
    return true;
  },

  async clearLoginOTP(userId) {
    const pool = getPool();
    await pool.query(
      'UPDATE users SET login_otp_code = NULL, login_temp_token = NULL, login_otp_expiry = NULL, login_otp_attempts = 0 WHERE id = ?',
      [userId]
    );
    return true;
  }
};

module.exports = UserModel;
