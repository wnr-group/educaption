-- Educaption Cutoff Calculator Database Schema
-- Database: Supabase (PostgreSQL)
-- Last Updated: 2026-03-04

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- Stores community categories (OC, BC, MBC, SC, ST)
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category lookups
CREATE INDEX idx_categories_code ON categories(code);

-- ============================================
-- GROUPS TABLE
-- Stores 12th standard subject group combinations (106 groups)
-- ============================================
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_ta TEXT,
    subjects JSONB NOT NULL DEFAULT '[]',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for group lookups
CREATE INDEX idx_groups_code ON groups(code);
CREATE INDEX idx_groups_subjects ON groups USING GIN (subjects);

-- ============================================
-- STREAMS TABLE
-- Stores educational streams (Engineering, Medical, etc.)
-- ============================================
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ta TEXT,
    formula TEXT NOT NULL,
    max_cutoff INTEGER NOT NULL DEFAULT 200,
    eligible_groups UUID[] DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for stream lookups
CREATE INDEX idx_streams_name ON streams(name);

-- ============================================
-- COURSES TABLE
-- Stores courses under each stream
-- ============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ta TEXT,
    duration TEXT,
    description TEXT,
    eligibility_criteria TEXT,
    career_prospects TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for course lookups
CREATE INDEX idx_courses_stream_id ON courses(stream_id);
CREATE INDEX idx_courses_name ON courses(name);

-- ============================================
-- COLLEGES TABLE
-- Stores college directory information
-- ============================================
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ta TEXT,
    type TEXT NOT NULL CHECK (type IN ('government', 'private', 'aided')),
    district TEXT NOT NULL,
    address TEXT,
    streams UUID[] DEFAULT '{}',
    website TEXT,
    phone TEXT,
    email TEXT,
    seats JSONB DEFAULT '{}',
    established_year INTEGER,
    accreditation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for college lookups
CREATE INDEX idx_colleges_type ON colleges(type);
CREATE INDEX idx_colleges_district ON colleges(district);
CREATE INDEX idx_colleges_streams ON colleges USING GIN (streams);

-- ============================================
-- COUNSELLING TABLE
-- Stores counselling process information
-- ============================================
CREATE TABLE counselling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ta TEXT,
    stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
    description TEXT,
    description_ta TEXT,
    documents JSONB DEFAULT '[]',
    important_dates JSONB DEFAULT '[]',
    fees JSONB DEFAULT '{}',
    website TEXT,
    steps JSONB DEFAULT '[]',
    eligibility TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for counselling lookups
CREATE INDEX idx_counselling_stream_id ON counselling(stream_id);

-- ============================================
-- ADMINS TABLE
-- Stores admin user information linked to auth.users
-- ============================================
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'editor')) DEFAULT 'editor',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin lookups
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_email ON admins(email);

-- ============================================
-- AUDIT_LOGS TABLE
-- Stores audit trail of admin actions
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    changes JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit log queries
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- SITE_SETTINGS TABLE
-- Stores configurable site settings
-- ============================================
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES admins(id) ON DELETE SET NULL
);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically updates the updated_at column
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streams_updated_at
    BEFORE UPDATE ON streams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at
    BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_counselling_updated_at
    BEFORE UPDATE ON counselling
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselling ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for student-facing tables
CREATE POLICY "Public read access for categories"
    ON categories FOR SELECT
    USING (true);

CREATE POLICY "Public read access for groups"
    ON groups FOR SELECT
    USING (true);

CREATE POLICY "Public read access for streams"
    ON streams FOR SELECT
    USING (true);

CREATE POLICY "Public read access for courses"
    ON courses FOR SELECT
    USING (true);

CREATE POLICY "Public read access for colleges"
    ON colleges FOR SELECT
    USING (true);

CREATE POLICY "Public read access for counselling"
    ON counselling FOR SELECT
    USING (true);

CREATE POLICY "Public read access for site_settings"
    ON site_settings FOR SELECT
    USING (true);

-- Admin-only write access
CREATE POLICY "Admin write access for categories"
    ON categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

CREATE POLICY "Admin write access for groups"
    ON groups FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

CREATE POLICY "Admin write access for streams"
    ON streams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

CREATE POLICY "Admin write access for courses"
    ON courses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

CREATE POLICY "Admin write access for colleges"
    ON colleges FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

CREATE POLICY "Admin write access for counselling"
    ON counselling FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

-- Super admin only access for admins table
CREATE POLICY "Super admin access for admins"
    ON admins FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.role = 'super_admin'
            AND admins.is_active = true
        )
    );

-- Self-read access for admins
CREATE POLICY "Admin can read own profile"
    ON admins FOR SELECT
    USING (auth.uid() = id);

-- Admin access for audit logs (read only for non-super admins)
CREATE POLICY "Admin read access for audit_logs"
    ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.is_active = true
        )
    );

CREATE POLICY "System insert for audit_logs"
    ON audit_logs FOR INSERT
    WITH CHECK (true);

-- Super admin only write access for site_settings
CREATE POLICY "Super admin write access for site_settings"
    ON site_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.id = auth.uid()
            AND admins.role = 'super_admin'
            AND admins.is_active = true
        )
    );

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE categories IS 'Community categories for reservation system (OC, BC, MBC, SC, ST)';
COMMENT ON TABLE groups IS '12th standard subject group combinations (106 groups)';
COMMENT ON TABLE streams IS 'Educational streams (Engineering, Medical, Agriculture, etc.)';
COMMENT ON TABLE courses IS 'Courses available under each stream';
COMMENT ON TABLE colleges IS 'College directory with details and seat matrix';
COMMENT ON TABLE counselling IS 'Counselling process information for each stream';
COMMENT ON TABLE admins IS 'Admin users with role-based access';
COMMENT ON TABLE audit_logs IS 'Audit trail of all admin actions';
COMMENT ON TABLE site_settings IS 'Configurable site settings';
