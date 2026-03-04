-- ============================================
-- EDUCAPTION CUTOFF CALCULATOR
-- RESET AND SETUP DATABASE
-- This will DROP all existing tables and recreate them
-- ============================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS counselling CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS streams CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop triggers and functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GROUPS
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

-- STREAMS
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

-- COURSES
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

-- COLLEGES
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

-- COUNSELLING
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

-- SITE SETTINGS
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_categories_code ON categories(code);
CREATE INDEX idx_groups_code ON groups(code);
CREATE INDEX idx_streams_name ON streams(name);
CREATE INDEX idx_courses_stream_id ON courses(stream_id);
CREATE INDEX idx_colleges_type ON colleges(type);
CREATE INDEX idx_colleges_district ON colleges(district);
CREATE INDEX idx_counselling_stream_id ON counselling(stream_id);

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_streams_updated_at BEFORE UPDATE ON streams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_counselling_updated_at BEFORE UPDATE ON counselling FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselling ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read groups" ON groups FOR SELECT USING (true);
CREATE POLICY "Public read streams" ON streams FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Public read counselling" ON counselling FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Categories
INSERT INTO categories (code, name, name_ta) VALUES
    ('OC', 'Open Category', 'திறந்த பிரிவு'),
    ('BC', 'Backward Class', 'பிற்படுத்தப்பட்ட வகுப்பு'),
    ('BCM', 'Backward Class (Muslim)', 'பிற்படுத்தப்பட்ட வகுப்பு (முஸ்லிம்)'),
    ('MBC', 'Most Backward Class', 'மிகவும் பிற்படுத்தப்பட்ட வகுப்பு'),
    ('DNC', 'Denotified Communities', 'நாடோடி சமூகங்கள்'),
    ('SC', 'Scheduled Caste', 'ஆதி திராவிடர்'),
    ('SCA', 'Scheduled Caste (Arunthathiyar)', 'ஆதி திராவிடர் (அருந்ததியர்)'),
    ('ST', 'Scheduled Tribe', 'பழங்குடியினர்');

-- Groups
INSERT INTO groups (code, name, name_ta, subjects, description) VALUES
    ('1', 'Physics, Chemistry, Mathematics, Biology', 'இயற்பியல், வேதியியல், கணிதம், உயிரியல்',
     '["Physics", "Chemistry", "Mathematics", "Biology", "English", "Tamil"]',
     'Science group eligible for Engineering, Medical, and Agriculture'),
    ('2', 'Physics, Chemistry, Mathematics, Computer Science', 'இயற்பியல், வேதியியல், கணிதம், கணினி அறிவியல்',
     '["Physics", "Chemistry", "Mathematics", "Computer Science", "English", "Tamil"]',
     'Science group eligible for Engineering and Computer Science'),
    ('3', 'Physics, Chemistry, Biology, Zoology', 'இயற்பியல், வேதியியல், உயிரியல், விலங்கியல்',
     '["Physics", "Chemistry", "Biology", "Zoology", "English", "Tamil"]',
     'Pure Science group eligible for Medical and Life Sciences'),
    ('4', 'Physics, Chemistry, Mathematics, Statistics', 'இயற்பியல், வேதியியல், கணிதம், புள்ளியியல்',
     '["Physics", "Chemistry", "Mathematics", "Statistics", "English", "Tamil"]',
     'Science group with Statistics'),
    ('5', 'Physics, Chemistry, Botany, Zoology', 'இயற்பியல், வேதியியல், தாவரவியல், விலங்கியல்',
     '["Physics", "Chemistry", "Botany", "Zoology", "English", "Tamil"]',
     'Biology focused group for Medical'),
    ('6', 'Accountancy, Commerce, Economics, Business Maths', 'கணக்கியல், வணிகவியல், பொருளியல், வணிக கணிதம்',
     '["Accountancy", "Commerce", "Economics", "Business Mathematics", "English", "Tamil"]',
     'Commerce group for Business and Management courses'),
    ('7', 'Accountancy, Commerce, Economics, Computer Applications', 'கணக்கியல், வணிகவியல், பொருளியல், கணினி பயன்பாடுகள்',
     '["Accountancy", "Commerce", "Economics", "Computer Applications", "English", "Tamil"]',
     'Commerce group with Computer Applications'),
    ('8', 'History, Geography, Economics, Political Science', 'வரலாறு, புவியியல், பொருளியல், அரசியல் அறிவியல்',
     '["History", "Geography", "Economics", "Political Science", "English", "Tamil"]',
     'Arts group for Humanities and Social Sciences'),
    ('9', 'History, Geography, Economics, Sociology', 'வரலாறு, புவியியல், பொருளியல், சமூகவியல்',
     '["History", "Geography", "Economics", "Sociology", "English", "Tamil"]',
     'Arts group with Sociology'),
    ('10', 'Tamil Literature, English Literature, History, Economics', 'தமிழ் இலக்கியம், ஆங்கில இலக்கியம், வரலாறு, பொருளியல்',
     '["Tamil Literature", "English Literature", "History", "Economics", "English", "Tamil"]',
     'Arts group with Literature focus');

-- Streams
INSERT INTO streams (name, name_ta, formula, max_cutoff, description) VALUES
    ('Engineering', 'பொறியியல்', 'M/2 + P/4 + C/4', 200, 'Professional engineering courses'),
    ('Medical', 'மருத்துவம்', 'B/2 + P/4 + C/4', 200, 'Medical and health sciences'),
    ('Agriculture', 'விவசாயம்', 'M/4 + P/4 + C/4 + B/4', 200, 'Agricultural sciences'),
    ('Veterinary', 'கால்நடை மருத்துவம்', 'B/2 + P/4 + C/4', 200, 'Veterinary sciences'),
    ('Pharmacy', 'மருந்தியல்', 'P/4 + C/4 + M/4 + B/4', 200, 'Pharmaceutical sciences'),
    ('Arts & Science', 'கலை மற்றும் அறிவியல்', 'Average of best 4 subjects', 100, 'Undergraduate arts and science'),
    ('Law', 'சட்டம்', 'Average of best 4 subjects', 100, 'Law programs'),
    ('Architecture', 'கட்டடக்கலை', 'M/2 + P/4 + C/4', 200, 'Bachelor of Architecture');

-- Update eligible groups
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '4')) WHERE name = 'Engineering';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')) WHERE name = 'Medical';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')) WHERE name = 'Agriculture';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')) WHERE name = 'Veterinary';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '3', '4', '5')) WHERE name = 'Pharmacy';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups) WHERE name = 'Arts & Science';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups) WHERE name = 'Law';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '4')) WHERE name = 'Architecture';

-- Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, career_prospects) VALUES
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Computer Science', 'கணினி அறிவியல் பொறியியல்', '4 years', 'Computer hardware, software, algorithms', 'Software Engineer, Data Scientist'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Electronics & Communication', 'மின்னணு தகவல் தொடர்பு', '4 years', 'Electronic devices, circuits, communication', 'Electronics Engineer, VLSI Designer'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Mechanical', 'இயந்திர பொறியியல்', '4 years', 'Mechanics, thermodynamics, manufacturing', 'Design Engineer, Automotive Engineer'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Civil', 'குடிசார் பொறியியல்', '4 years', 'Construction, structural design', 'Structural Engineer, Urban Planner'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Electrical', 'மின் பொறியியல்', '4 years', 'Electrical systems, power generation', 'Power Systems Engineer'),
    ((SELECT id FROM streams WHERE name = 'Medical'), 'MBBS', 'எம்.பி.பி.எஸ்', '5.5 years', 'Bachelor of Medicine and Surgery', 'Doctor, Surgeon, Specialist'),
    ((SELECT id FROM streams WHERE name = 'Medical'), 'BDS', 'பி.டி.எஸ்', '5 years', 'Bachelor of Dental Surgery', 'Dentist, Oral Surgeon'),
    ((SELECT id FROM streams WHERE name = 'Medical'), 'B.Sc Nursing', 'பி.எஸ்சி நர்சிங்', '4 years', 'Bachelor of Science in Nursing', 'Registered Nurse'),
    ((SELECT id FROM streams WHERE name = 'Agriculture'), 'B.Sc Agriculture', 'பி.எஸ்சி வேளாண்மை', '4 years', 'Agricultural sciences, crop production', 'Agricultural Officer'),
    ((SELECT id FROM streams WHERE name = 'Agriculture'), 'B.Sc Horticulture', 'பி.எஸ்சி தோட்டக்கலை', '4 years', 'Fruit, vegetable cultivation', 'Horticulturist'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'B.Sc Computer Science', 'பி.எஸ்சி கணினி அறிவியல்', '3 years', 'Programming, software development', 'Software Developer'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'B.Com', 'பி.காம்', '3 years', 'Commerce, accounting, business', 'Accountant, Financial Analyst'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'BA English', 'பி.ஏ ஆங்கிலம்', '3 years', 'English language and literature', 'Writer, Teacher'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'BBA', 'பி.பி.ஏ', '3 years', 'Business Administration', 'Business Manager');

-- Colleges
INSERT INTO colleges (name, name_ta, type, district, website) VALUES
    ('Anna University', 'அண்ணா பல்கலைக்கழகம்', 'government', 'Chennai', 'https://annauniv.edu'),
    ('PSG College of Technology', 'பி.எஸ்.ஜி தொழில்நுட்பக் கல்லூரி', 'aided', 'Coimbatore', 'https://psgtech.edu'),
    ('Madras Medical College', 'சென்னை மருத்துவக் கல்லூரி', 'government', 'Chennai', 'https://mmc.tn.gov.in'),
    ('Tamil Nadu Agricultural University', 'தமிழ்நாடு வேளாண் பல்கலைக்கழகம்', 'government', 'Coimbatore', 'https://tnau.ac.in'),
    ('SRM Institute of Technology', 'எஸ்.ஆர்.எம் தொழில்நுட்ப நிறுவனம்', 'private', 'Chennai', 'https://srmist.edu.in'),
    ('VIT University', 'வி.ஐ.டி பல்கலைக்கழகம்', 'private', 'Vellore', 'https://vit.ac.in');

-- Counselling
INSERT INTO counselling (name, name_ta, stream_id, description, documents, important_dates, website) VALUES
    ('TNEA (Tamil Nadu Engineering Admissions)', 'தமிழ்நாடு பொறியியல் சேர்க்கை',
     (SELECT id FROM streams WHERE name = 'Engineering'),
     'Centralized counselling for engineering admissions in Tamil Nadu',
     '[{"name": "12th Mark Sheet"}, {"name": "Community Certificate"}, {"name": "Income Certificate"}, {"name": "Transfer Certificate"}, {"name": "Aadhaar Card"}]',
     '[{"event": "Registration Opens", "date": "May 2026"}, {"event": "Counselling Begins", "date": "July 2026"}]',
     'https://tneaonline.org'),
    ('NEET Medical Counselling', 'நீட் மருத்துவ ஆலோசனை',
     (SELECT id FROM streams WHERE name = 'Medical'),
     'NEET-based counselling for medical admissions',
     '[{"name": "NEET Score Card"}, {"name": "12th Mark Sheet"}, {"name": "Community Certificate"}, {"name": "Aadhaar Card"}]',
     '[{"event": "NEET Exam", "date": "May 2026"}, {"event": "Counselling Begins", "date": "July 2026"}]',
     'https://mcc.nic.in');

-- Site Settings
INSERT INTO site_settings (key, value, description) VALUES
    ('academic_year', '"2026-2027"', 'Current academic year'),
    ('cutoff_calculation_enabled', 'true', 'Enable cutoff calculator'),
    ('contact_email', '"contact@educaption.org"', 'Contact email');

-- Done!
SELECT 'Database reset and setup complete!' AS status;
