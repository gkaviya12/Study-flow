-- StudyFlow V2 — MySQL Schema
-- Mirrors TRD §2 "Core Schema Sketch" exactly, with one addition:
--   Users.daily_focus_goal_minutes INT NOT NULL DEFAULT 120 (user answer #7)
-- Analytics is derived at query time from Tasks + FocusSessions — no analytics table
-- Apply with: docker compose exec -T mysql mysql -uroot -proot studyflow_db < schema.sql
-- Reset with: npm run db:reset

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- --- Users ---

CREATE TABLE IF NOT EXISTS users (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  name                        VARCHAR(120) NOT NULL,
  email                       VARCHAR(180) NOT NULL UNIQUE,
  password_hash               VARCHAR(255) NOT NULL,
  college                     VARCHAR(180) DEFAULT NULL,
  semester                    VARCHAR(40) DEFAULT NULL,
  study_goal                  VARCHAR(255) DEFAULT NULL,
  theme                       ENUM('light', 'dark') NOT NULL DEFAULT 'light',
  lumi_visible                TINYINT(1) NOT NULL DEFAULT 1,
  daily_focus_goal_minutes    INT NOT NULL DEFAULT 120,
  reset_token                 VARCHAR(255) DEFAULT NULL,
  reset_token_expires         DATETIME DEFAULT NULL,
  created_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- Subjects ---

CREATE TABLE IF NOT EXISTS subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  name        VARCHAR(120) NOT NULL,
  color       VARCHAR(20) NOT NULL DEFAULT '#6FAF8F',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_subjects_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- Tasks ---

CREATE TABLE IF NOT EXISTS tasks (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  user_id               INT NOT NULL,
  subject_id            INT DEFAULT NULL,
  title                 VARCHAR(255) NOT NULL,
  category              ENUM('Assignment', 'Exam', 'Placement', 'Personal', 'Project') NOT NULL DEFAULT 'Personal',
  priority              ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  status                ENUM('todo', 'in_progress', 'completed') NOT NULL DEFAULT 'todo',
  due_date              DATE DEFAULT NULL,
  estimated_minutes     INT DEFAULT NULL,
  recurrence            ENUM('none', 'daily', 'weekly', 'weekdays') NOT NULL DEFAULT 'none',
  recurrence_parent_id  INT DEFAULT NULL,
  completed_at          DATETIME DEFAULT NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tasks_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT fk_tasks_parent
    FOREIGN KEY (recurrence_parent_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- Notes ---

CREATE TABLE IF NOT EXISTS notes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  subject_id  INT DEFAULT NULL,
  title       VARCHAR(255) NOT NULL,
  content     MEDIUMTEXT NOT NULL,
  tags        JSON DEFAULT NULL,
  is_checklist TINYINT(1) NOT NULL DEFAULT 0,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notes_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- Focus Sessions ---

CREATE TABLE IF NOT EXISTS focus_sessions (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  task_id           INT DEFAULT NULL,
  status            ENUM('in_progress', 'completed', 'abandoned') NOT NULL DEFAULT 'in_progress',
  planned_minutes   INT NOT NULL DEFAULT 25,
  elapsed_minutes   INT NOT NULL DEFAULT 0,
  started_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at          DATETIME DEFAULT NULL,
  CONSTRAINT fk_focus_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_focus_task
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --- Indexes for common query patterns ---

CREATE INDEX idx_tasks_user_status      ON tasks (user_id, status);
CREATE INDEX idx_tasks_user_due         ON tasks (user_id, due_date);
CREATE INDEX idx_tasks_recurrence_parent ON tasks (recurrence_parent_id);
CREATE INDEX idx_subjects_user          ON subjects (user_id);
CREATE INDEX idx_notes_user             ON notes (user_id);
CREATE INDEX idx_focus_user_started     ON focus_sessions (user_id, started_at);