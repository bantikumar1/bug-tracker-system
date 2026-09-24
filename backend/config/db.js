const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'MySQL@12345'
};

const dbName = process.env.DB_NAME || 'bug_tracker_db';

let pool;

async function initializeDatabase() {
  try {
    // Connect to MySQL server without selecting database first
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    // Create pool connected to bug_tracker_db
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log(`Connected to MySQL database: ${dbName}`);

    // Create users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'developer', 'tester') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;
    await pool.query(createUsersTableQuery);

    // Create bugs table
    const createBugsTableQuery = `
      CREATE TABLE IF NOT EXISTS bugs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
        status ENUM('OPEN', 'IN_PROGRESS', 'FIXED') DEFAULT 'OPEN',
        bug_screenshot VARCHAR(255) NULL DEFAULT NULL,
        bug_video VARCHAR(255) NULL DEFAULT NULL,
        code_file VARCHAR(255) NULL DEFAULT NULL,
        code_line INT NULL DEFAULT NULL,
        created_by INT NOT NULL,
        assigned_to INT NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;
    await pool.query(createBugsTableQuery);

    // Auto-migration for existing tables: add columns if they do not exist
    try {
      await pool.query("ALTER TABLE bugs ADD COLUMN bug_screenshot VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE bugs ADD COLUMN bug_video VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE bugs ADD COLUMN code_file VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE bugs ADD COLUMN code_line INT NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active';");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'dark';");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN language VARCHAR(20) DEFAULT 'English';");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN default_dashboard_view VARCHAR(50) DEFAULT 'available';");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN notify_bug_assigned TINYINT(1) DEFAULT 1;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN notify_status_change TINYINT(1) DEFAULT 1;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN notify_comment TINYINT(1) DEFAULT 1;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN twofa_enabled TINYINT(1) DEFAULT 0;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN twofa_secret VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN otp_code VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN otp_expiry DATETIME NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN reset_otp VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN reset_otp_expiry DATETIME NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN otp_attempts INT DEFAULT 0;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN login_otp_code VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN login_otp_expiry DATETIME NULL DEFAULT NULL;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN login_otp_attempts INT DEFAULT 0;");
    } catch (e) {}
    try {
      await pool.query("ALTER TABLE users ADD COLUMN login_temp_token VARCHAR(255) NULL DEFAULT NULL;");
    } catch (e) {}

    // Create notifications table
    const createNotificationsTableQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NULL DEFAULT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;
    await pool.query(createNotificationsTableQuery);

    try {
      await pool.query("ALTER TABLE notifications ADD COLUMN is_read TINYINT(1) DEFAULT 0;");
    } catch (e) {}

    // Seed default admin if no admin exists
    const [rows] = await pool.query("SELECT * FROM users WHERE role = 'admin'");
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['System Admin', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log("Default admin account created: admin@example.com / admin123");
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool has not been initialized.");
  }
  return pool;
}

module.exports = {
  initializeDatabase,
  getPool
};
