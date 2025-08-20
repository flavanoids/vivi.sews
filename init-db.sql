-- Initialize Vivisews Database
-- This script creates all necessary tables for the application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'es')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_email_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP
);

-- Fabrics table
CREATE TABLE IF NOT EXISTS fabrics (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    fiber_content VARCHAR(255),
    weight VARCHAR(255),
    color VARCHAR(255),
    pattern VARCHAR(255),
    width DECIMAL(5,2),
    total_yards DECIMAL(8,2) NOT NULL,
    cost_per_yard DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    source VARCHAR(255),
    notes TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    start_date DATE,
    target_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project materials table
CREATE TABLE IF NOT EXISTS project_materials (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fabric_id VARCHAR(255) REFERENCES fabrics(id) ON DELETE SET NULL,
    material_name VARCHAR(255) NOT NULL,
    yards_needed DECIMAL(8,2),
    yards_used DECIMAL(8,2) DEFAULT 0,
    cost_per_yard DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project patterns table
CREATE TABLE IF NOT EXISTS project_patterns (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    pattern_name VARCHAR(255) NOT NULL,
    pattern_company VARCHAR(255),
    pattern_number VARCHAR(255),
    size VARCHAR(255),
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patterns table
CREATE TABLE IF NOT EXISTS patterns (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    pattern_number VARCHAR(255),
    category VARCHAR(255),
    difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    sizes TEXT,
    fabric_recommendations TEXT,
    notes TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage history table
CREATE TABLE IF NOT EXISTS usage_history (
    id VARCHAR(255) PRIMARY KEY,
    fabric_id VARCHAR(255) NOT NULL REFERENCES fabrics(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(255) REFERENCES projects(id) ON DELETE SET NULL,
    yards_used DECIMAL(8,2) NOT NULL,
    project_name VARCHAR(255),
    usage_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
    id VARCHAR(255) PRIMARY KEY,
    allow_signups BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT TRUE,
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fabrics_user_id ON fabrics(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_patterns_user_id ON patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_history_fabric_id ON usage_history(fabric_id);
CREATE INDEX IF NOT EXISTS idx_usage_history_user_id ON usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_project_materials_project_id ON project_materials(project_id);
CREATE INDEX IF NOT EXISTS idx_project_patterns_project_id ON project_patterns(project_id);

-- Insert default app settings
INSERT INTO app_settings (id, allow_signups, require_approval, max_login_attempts, lockout_duration)
VALUES ('default', TRUE, TRUE, 5, 15)
ON CONFLICT (id) DO NOTHING;

-- Create default ADMIN account
INSERT INTO users (id, email, username, password_hash, role, status, language, created_at, is_email_verified)
VALUES (
    'admin-default',
    'admin@vivisews.com',
    'ADMIN',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'ADMIN'
    'admin',
    'active',
    'en',
    CURRENT_TIMESTAMP,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fabrics_updated_at BEFORE UPDATE ON fabrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
