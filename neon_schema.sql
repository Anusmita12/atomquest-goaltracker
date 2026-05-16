-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. TRIGGERS & FUNCTIONS
-- =====================================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================================================
-- 2. TABLES
-- =====================================================================================

-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
    department VARCHAR(100) NOT NULL,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GOALS
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    thrust_area VARCHAR(100) NOT NULL,
    goal_title VARCHAR(255) NOT NULL,
    description TEXT,
    uom_type VARCHAR(50) NOT NULL CHECK (uom_type IN ('Percentage', 'Currency', 'Numeric', 'Boolean')),
    target_value NUMERIC NOT NULL,
    weightage NUMERIC NOT NULL CHECK (weightage >= 10),
    deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Approved', 'Pending', 'Rejected', 'Completed')),
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- QUARTERLY CHECKINS
CREATE TABLE quarterly_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    quarter VARCHAR(10) NOT NULL,
    planned_target NUMERIC NOT NULL,
    actual_achievement NUMERIC NOT NULL,
    achievement_percent NUMERIC NOT NULL,
    progress_status VARCHAR(50) NOT NULL CHECK (progress_status IN ('On Track', 'At Risk', 'Delayed', 'Completed')),
    employee_comment TEXT,
    manager_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SHARED GOALS
CREATE TABLE shared_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    assigned_employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    editable_weightage_only BOOLEAN NOT NULL DEFAULT TRUE,
    synced_updates BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(primary_goal_id, assigned_employee_id)
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    old_value TEXT,
    new_value TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 3. INDEXES
-- =====================================================================================
CREATE INDEX idx_goals_profile_id ON goals(profile_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_profiles_manager_id ON profiles(manager_id);
CREATE INDEX idx_profiles_department ON profiles(department);
CREATE INDEX idx_checkins_goal_id ON quarterly_checkins(goal_id);
CREATE INDEX idx_audit_actor_id ON audit_logs(actor_id);

-- =====================================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Note: We use `current_setting('app.current_user_id', true)` for Neon auth context.
-- Before making a query, your app should run: 
-- SET LOCAL app.current_user_id = 'user-uuid-here';

-- Profiles Policies
CREATE POLICY "Users can view their own profile and reports" 
ON profiles FOR SELECT 
USING (
    id::text = current_setting('app.current_user_id', true) 
    OR manager_id::text = current_setting('app.current_user_id', true)
    OR (SELECT role FROM profiles WHERE id::text = current_setting('app.current_user_id', true)) = 'admin'
);

-- Goals Policies
CREATE POLICY "Users can manage their own goals" 
ON goals FOR ALL 
USING (
    profile_id::text = current_setting('app.current_user_id', true)
    OR (SELECT manager_id FROM profiles WHERE id = goals.profile_id)::text = current_setting('app.current_user_id', true)
    OR (SELECT role FROM profiles WHERE id::text = current_setting('app.current_user_id', true)) = 'admin'
);

-- Quarterly Checkins Policies
CREATE POLICY "Users can manage checkins for accessible goals" 
ON quarterly_checkins FOR ALL 
USING (
    (SELECT profile_id FROM goals WHERE id = quarterly_checkins.goal_id)::text = current_setting('app.current_user_id', true)
    OR (SELECT manager_id FROM profiles WHERE id = (SELECT profile_id FROM goals WHERE id = quarterly_checkins.goal_id))::text = current_setting('app.current_user_id', true)
    OR (SELECT role FROM profiles WHERE id::text = current_setting('app.current_user_id', true)) = 'admin'
);

-- Audit Logs Policies
CREATE POLICY "Admins can view all audit logs" 
ON audit_logs FOR SELECT 
USING (
    (SELECT role FROM profiles WHERE id::text = current_setting('app.current_user_id', true)) = 'admin'
);

CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (true);

-- Notifications Policies
CREATE POLICY "Users can view and update their own notifications" 
ON notifications FOR ALL 
USING (recipient_id::text = current_setting('app.current_user_id', true));

-- =====================================================================================
-- 5. ANALYTICS VIEWS
-- =====================================================================================

-- View: Department Completion
CREATE OR REPLACE VIEW view_department_completion AS
SELECT 
    p.department,
    COUNT(g.id) as total_goals,
    SUM(CASE WHEN g.status = 'Completed' THEN 1 ELSE 0 END) as completed_goals,
    ROUND((SUM(CASE WHEN g.status = 'Completed' THEN 1 ELSE 0 END)::NUMERIC / NULLIF(COUNT(g.id), 0)) * 100, 2) as completion_percentage
FROM profiles p
LEFT JOIN goals g ON p.id = g.profile_id
GROUP BY p.department;

-- View: Manager Effectiveness
CREATE OR REPLACE VIEW view_manager_effectiveness AS
SELECT 
    m.id as manager_id,
    m.full_name as manager_name,
    COUNT(DISTINCT e.id) as team_size,
    COUNT(g.id) as total_team_goals,
    SUM(CASE WHEN g.status = 'Approved' THEN 1 ELSE 0 END) as approved_goals,
    SUM(CASE WHEN g.status = 'Pending' THEN 1 ELSE 0 END) as pending_approvals
FROM profiles m
JOIN profiles e ON e.manager_id = m.id
LEFT JOIN goals g ON g.profile_id = e.id
WHERE m.role IN ('manager', 'admin')
GROUP BY m.id, m.full_name;

-- View: Goal Status Distribution
CREATE OR REPLACE VIEW view_goal_status_distribution AS
SELECT 
    status,
    COUNT(*) as status_count
FROM goals
GROUP BY status;

-- =====================================================================================
-- 6. SEED DATA
-- =====================================================================================

-- Temporarily bypass RLS to insert seed data
SET LOCAL app.current_user_id = ''; 

-- Insert Admin
INSERT INTO profiles (id, email, full_name, role, department, manager_id) VALUES
('33333333-3333-3333-3333-333333333333', 'admin@demo.com', 'Charlie Admin', 'admin', 'HR', NULL);

-- Insert Managers
INSERT INTO profiles (id, email, full_name, role, department, manager_id) VALUES
('22222222-2222-2222-2222-222222222222', 'manager@demo.com', 'Bob Jones', 'manager', 'Marketing', '33333333-3333-3333-3333-333333333333');

-- Insert Employees
INSERT INTO profiles (id, email, full_name, role, department, manager_id) VALUES
('11111111-1111-1111-1111-111111111111', 'employee@demo.com', 'Alice Smith', 'employee', 'Sales', '22222222-2222-2222-2222-222222222222'),
('44444444-4444-4444-4444-444444444444', 'david@demo.com', 'David Lee', 'employee', 'Engineering', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555555', 'eva@demo.com', 'Eva Davis', 'employee', 'Product', '22222222-2222-2222-2222-222222222222');

-- Insert Goals for Employee (Alice)
INSERT INTO goals (id, profile_id, thrust_area, goal_title, description, uom_type, target_value, weightage, deadline, status, locked) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Revenue Growth', 'Increase Quarterly Sales Revenue', 'Achieve a 15% increase in Q3 sales revenue.', 'Currency', 500000, 40, '2026-09-30', 'Approved', false),
('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Customer Success', 'Improve Customer Satisfaction Score', 'Raise CSAT score from 4.2 to 4.8.', 'Numeric', 4.8, 30, '2026-09-30', 'Pending', false),
('aaaa3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Learning & Development', 'Complete Cloud Certification Program', 'Pass the AWS Solutions Architect exam.', 'Boolean', 100, 15, '2026-06-15', 'Completed', false),
('aaaa4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Operational Efficiency', 'Reduce Ticket Resolution Time', 'Decrease average resolution time to under 4 hours.', 'Numeric', 4, 15, '2026-08-01', 'Rejected', false);

-- Insert Pending Approvals for Manager Queue (David & Eva)
INSERT INTO goals (id, profile_id, thrust_area, goal_title, description, uom_type, target_value, weightage, deadline, status, locked) VALUES
('bbbb1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Brand Awareness', 'Launch New Marketing Campaign', 'Execute Q3 campaign across all social channels.', 'Percentage', 100, 25, '2026-08-31', 'Pending', false),
('bbbb2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Infrastructure', 'Migrate Legacy Database', 'Move user data to new Postgres cluster.', 'Percentage', 100, 50, '2026-10-15', 'Pending', false);

-- Insert Quarterly Check-ins
INSERT INTO quarterly_checkins (goal_id, quarter, planned_target, actual_achievement, achievement_percent, progress_status, employee_comment, manager_comment) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'Q3-2026', 300000, 350000, 70, 'On Track', 'I have closed 3 enterprise deals this month. On track to hit target.', 'Excellent work Alice, keep up the momentum.'),
('aaaa3333-3333-3333-3333-333333333333', 'Q2-2026', 100, 100, 100, 'Completed', 'Passed the exam on June 10th.', 'Great job upskilling!');

-- Insert Audit Logs
INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value) VALUES
('22222222-2222-2222-2222-222222222222', 'Manager approved Sales KPI', 'Goal', 'aaaa1111-1111-1111-1111-111111111111', 'Pending', 'Approved'),
('33333333-3333-3333-3333-333333333333', 'Admin unlocked goal sheet', 'Goal', 'aaaa2222-2222-2222-2222-222222222222', 'Locked', 'Unlocked');
