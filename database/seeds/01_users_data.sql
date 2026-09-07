-- ===================================================
-- Seed Data for `users` Table
-- Default Accounts:
-- Admin:     admin@example.com / admin123
-- Developer: amit@example.com  / password123
-- Tester:    rahul@example.com / password123
-- ===================================================

INSERT INTO users (id, name, email, password, role) VALUES
(1, 'System Admin', 'admin@example.com', '$2a$10$5Pi8K7GQrGCJaVCNEy85XuC3sV94mtCJYf2CB3GYHqqQQVy6UJZXa', 'admin'),
(2, 'Amit', 'amit@example.com', '$2a$10$LoW6V0fkZFAktssVORDwKe5UL9xoxZRktiCtg0zF8OVhnsOCigR6i', 'developer'),
(3, 'Rahul', 'rahul@example.com', '$2a$10$qY1IcEPRESQAwxgicHGVAOrEASS28mdpH2sXsJ9xN3PmcjhfMfspC', 'tester'),
(4, 'Ravi', 'ravi@example.com', '$2a$10$Cgncz3Th/PHVIQK.a9D3vehsZxg7w/OdNYpti30Q4gniMxXjk4FSm', 'developer')
ON DUPLICATE KEY UPDATE name=VALUES(name);
