-- ===================================================
-- Seed Data for `bugs` Table
-- ===================================================

INSERT INTO bugs (id, title, description, priority, status, created_by, assigned_to, bug_screenshot, bug_video) VALUES
(1, 'Login button not working', 'User cannot login after entering valid credentials.', 'HIGH', 'FIXED', 3, 2, NULL, NULL),
(2, 'Dropdown menu overlaps header on resize', 'When window width is under 600px, navigation dropdown covers the logo.', 'MEDIUM', 'IN_PROGRESS', 3, 2, NULL, NULL),
(3, 'Profile avatar fails to render', 'User avatar image broken after upload.', 'LOW', 'OPEN', 3, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE title=VALUES(title);
