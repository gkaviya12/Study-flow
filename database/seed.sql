-- StudyFlow V2 — Development Seed Data
-- Insert a test user, two subjects, three tasks, and a focus session
-- To apply: docker compose exec -T mysql mysql -uroot -proot studyflow_db < seed.sql

USE studyflow_db;

-- --- Helper for password hash (password: 'Test1234!') ---
-- Generated with bcrypt salt round 12
--   bcrypt.hashSync('Test1234!', 12) = '$2a$12$eImiTXuWVxfM37uY4JANj.Q6KzK5.rT0l2xEzTQ5gWi2uHdVG8VdC'
-- Change in production or via registration flow.

INSERT INTO users (id, name, email, password_hash, college, semester, study_goal, theme, lumi_visible, daily_focus_goal_minutes)
VALUES
  (1, 'Demo User', 'demo@studyflow.com', '$2a$12$eImiTXuWVxfM37uY4JANj.Q6KzK5.rT0l2xEzTQ5gWi2uHdVG8VdC', 'Demo College', 'Sophomore', 'Graduate with honors', 'light', 1, 120)
ON DUPLICATE KEY UPDATE email=email;

-- --- Subjects (user_id: 1) ---
INSERT INTO subjects (id, user_id, name, color)
VALUES
  (101, 1, 'Mathematics', '#6FAF8F'),
  (102, 1, 'History', '#F6C453')
ON DUPLICATE KEY UPDATE id=id;

-- --- Tasks (user_id: 1) ---
INSERT INTO tasks (id, user_id, subject_id, title, category, priority, status, due_date, estimated_minutes, recurrence, completed_at)
VALUES
  (201, 1, 101, 'Complete calculus homework', 'Assignment', 'High', 'todo', CURDATE() + INTERVAL 2 DAY, 90, 'none', NULL),
  (202, 1, 102, 'Review WWII chapters', 'Assignment', 'Medium', 'in_progress', CURDATE() + INTERVAL 5 DAY, 60, 'weekly', NULL),
  (203, 1, NULL, 'Call mom', 'Personal', 'Low', 'completed', CURDATE(), 15, 'none', CURDATE() - INTERVAL 1 HOUR)
ON DUPLICATE KEY UPDATE id=id;

-- --- Focus Sessions (user_id: 1) ---
INSERT INTO focus_sessions (id, user_id, task_id, status, planned_minutes, elapsed_minutes, started_at, ended_at)
VALUES
  (301, 1, 202, 'completed', 25, 25, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 95 MINUTE)
ON DUPLICATE KEY UPDATE id=id;