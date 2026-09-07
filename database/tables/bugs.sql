-- ===================================================
-- Table Structure for `bugs`
-- ===================================================

CREATE TABLE IF NOT EXISTS bugs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'FIXED') DEFAULT 'OPEN',
  bug_screenshot VARCHAR(255) NULL DEFAULT NULL,
  bug_video VARCHAR(255) NULL DEFAULT NULL,
  created_by INT NOT NULL,
  assigned_to INT NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_bugs_status (status),
  INDEX idx_bugs_priority (priority),
  INDEX idx_bugs_created_by (created_by),
  INDEX idx_bugs_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
