-- ============================================
-- EDUCAPTION CUTOFF CALCULATOR
-- Complete Database Setup Script
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_code ON categories(code);

-- GROUPS TABLE
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_ta TEXT,
    subjects JSONB NOT NULL DEFAULT '[]',
    subjects_ta JSONB DEFAULT '[]',
    description TEXT,
    description_ta TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_groups_code ON groups(code);
CREATE INDEX idx_groups_subjects ON groups USING GIN (subjects);

-- STREAMS TABLE
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

CREATE INDEX idx_streams_name ON streams(name);

-- COURSES TABLE
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

CREATE INDEX idx_courses_stream_id ON courses(stream_id);
CREATE INDEX idx_courses_name ON courses(name);

-- COLLEGES TABLE
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

CREATE INDEX idx_colleges_type ON colleges(type);
CREATE INDEX idx_colleges_district ON colleges(district);
CREATE INDEX idx_colleges_streams ON colleges USING GIN (streams);

-- COUNSELLING TABLE
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

CREATE INDEX idx_counselling_stream_id ON counselling(stream_id);

-- SITE SETTINGS TABLE
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Public read policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read groups" ON groups FOR SELECT USING (true);
CREATE POLICY "Public read streams" ON streams FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Public read counselling" ON counselling FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- ============================================
-- STEP 2: SEED DATA
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
INSERT INTO groups (code, name, name_ta, subjects, subjects_ta, description, description_ta) VALUES
    ('1', 'Physics, Chemistry, Mathematics, Biology', 'இயற்பியல், வேதியியல், கணிதம், உயிரியல்',
     '["Physics", "Chemistry", "Mathematics", "Biology", "English", "Tamil"]',
     '["இயற்பியல்", "வேதியியல்", "கணிதம்", "உயிரியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Science group eligible for Engineering, Medical, and Agriculture',
     'பொறியியல், மருத்துவம் மற்றும் வேளாண்மைக்கு தகுதியான அறிவியல் குழு'),
    ('2', 'Physics, Chemistry, Mathematics, Computer Science', 'இயற்பியல், வேதியியல், கணிதம், கணினி அறிவியல்',
     '["Physics", "Chemistry", "Mathematics", "Computer Science", "English", "Tamil"]',
     '["இயற்பியல்", "வேதியியல்", "கணிதம்", "கணினி அறிவியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Science group eligible for Engineering and Computer Science',
     'பொறியியல் மற்றும் கணினி அறிவியலுக்கு தகுதியான அறிவியல் குழு'),
    ('3', 'Physics, Chemistry, Biology, Zoology', 'இயற்பியல், வேதியியல், உயிரியல், விலங்கியல்',
     '["Physics", "Chemistry", "Biology", "Zoology", "English", "Tamil"]',
     '["இயற்பியல்", "வேதியியல்", "உயிரியல்", "விலங்கியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Pure Science group eligible for Medical and Life Sciences',
     'மருத்துவம் மற்றும் உயிர் அறிவியலுக்கு தகுதியான தூய அறிவியல் குழு'),
    ('4', 'Physics, Chemistry, Mathematics, Statistics', 'இயற்பியல், வேதியியல், கணிதம், புள்ளியியல்',
     '["Physics", "Chemistry", "Mathematics", "Statistics", "English", "Tamil"]',
     '["இயற்பியல்", "வேதியியல்", "கணிதம்", "புள்ளியியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Science group with Statistics',
     'புள்ளியியல் கொண்ட அறிவியல் குழு'),
    ('5', 'Physics, Chemistry, Botany, Zoology', 'இயற்பியல், வேதியியல், தாவரவியல், விலங்கியல்',
     '["Physics", "Chemistry", "Botany", "Zoology", "English", "Tamil"]',
     '["இயற்பியல்", "வேதியியல்", "தாவரவியல்", "விலங்கியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Biology focused group for Medical',
     'மருத்துவத்திற்கான உயிரியல் மையக் குழு'),
    ('6', 'Accountancy, Commerce, Economics, Business Maths', 'கணக்கியல், வணிகவியல், பொருளியல், வணிக கணிதம்',
     '["Accountancy", "Commerce", "Economics", "Business Mathematics", "English", "Tamil"]',
     '["கணக்கியல்", "வணிகவியல்", "பொருளியல்", "வணிக கணிதம்", "ஆங்கிலம்", "தமிழ்"]',
     'Commerce group for Business and Management courses',
     'வணிகம் மற்றும் மேலாண்மை படிப்புகளுக்கான வணிகக் குழு'),
    ('7', 'Accountancy, Commerce, Economics, Computer Applications', 'கணக்கியல், வணிகவியல், பொருளியல், கணினி பயன்பாடுகள்',
     '["Accountancy", "Commerce", "Economics", "Computer Applications", "English", "Tamil"]',
     '["கணக்கியல்", "வணிகவியல்", "பொருளியல்", "கணினி பயன்பாடுகள்", "ஆங்கிலம்", "தமிழ்"]',
     'Commerce group with Computer Applications',
     'கணினி பயன்பாடுகள் கொண்ட வணிகக் குழு'),
    ('8', 'History, Geography, Economics, Political Science', 'வரலாறு, புவியியல், பொருளியல், அரசியல் அறிவியல்',
     '["History", "Geography", "Economics", "Political Science", "English", "Tamil"]',
     '["வரலாறு", "புவியியல்", "பொருளியல்", "அரசியல் அறிவியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Arts group for Humanities and Social Sciences',
     'மனிதநேயம் மற்றும் சமூக அறிவியலுக்கான கலைக் குழு'),
    ('9', 'History, Geography, Economics, Sociology', 'வரலாறு, புவியியல், பொருளியல், சமூகவியல்',
     '["History", "Geography", "Economics", "Sociology", "English", "Tamil"]',
     '["வரலாறு", "புவியியல்", "பொருளியல்", "சமூகவியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Arts group with Sociology',
     'சமூகவியல் கொண்ட கலைக் குழு'),
    ('10', 'Tamil Literature, English Literature, History, Economics', 'தமிழ் இலக்கியம், ஆங்கில இலக்கியம், வரலாறு, பொருளியல்',
     '["Tamil Literature", "English Literature", "History", "Economics", "English", "Tamil"]',
     '["தமிழ் இலக்கியம்", "ஆங்கில இலக்கியம்", "வரலாறு", "பொருளியல்", "ஆங்கிலம்", "தமிழ்"]',
     'Arts group with Literature focus',
     'இலக்கிய மையக் கலைக் குழு');

-- Streams (Formulas based on official TNEA guidelines)
-- Engineering/Architecture: Mathematics + Physics/2 + Chemistry/2 = 200
-- Medical/Veterinary: Biology + Physics/2 + Chemistry/2 = 200
-- Agriculture: Biology/2 + Physics/2 + Chemistry = 200
-- Pharmacy: Physics/2 + Chemistry/2 + Biology/2 + Mathematics/2 = 200
INSERT INTO streams (name, name_ta, formula, max_cutoff, description) VALUES
    ('Engineering', 'பொறியியல்', 'M + P/2 + C/2', 200, 'Professional engineering courses'),
    ('Medical', 'மருத்துவம்', 'B + P/2 + C/2', 200, 'Medical and health sciences'),
    ('Agriculture', 'விவசாயம்', 'B/2 + P/2 + C', 200, 'Agricultural sciences'),
    ('Veterinary', 'கால்நடை மருத்துவம்', 'B + P/2 + C/2', 200, 'Veterinary sciences'),
    ('Pharmacy', 'மருந்தியல்', 'P/2 + C/2 + B/2 + M/2', 200, 'Pharmaceutical sciences'),
    ('Arts & Science', 'கலை மற்றும் அறிவியல்', 'Average of best 4 subjects', 100, 'Undergraduate arts and science'),
    ('Law', 'சட்டம்', 'Average of best 4 subjects', 100, 'Law programs'),
    ('Architecture', 'கட்டடக்கலை', 'M + P/2 + C/2', 200, 'Bachelor of Architecture');

-- Update eligible groups
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '4')) WHERE name = 'Engineering';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')) WHERE name = 'Medical';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')) WHERE name = 'Agriculture';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')) WHERE name = 'Veterinary';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '3', '4', '5')) WHERE name = 'Pharmacy';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups) WHERE name = 'Arts & Science';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups) WHERE name = 'Law';
UPDATE streams SET eligible_groups = (SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '4')) WHERE name = 'Architecture';

-- Engineering Courses (using explicit stream_id lookup)
INSERT INTO courses (stream_id, name, name_ta, duration, description, career_prospects)
VALUES
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Computer Science', 'கணினி அறிவியல் பொறியியல்', '4 years', 'Computer hardware, software, algorithms', 'Software Engineer, Data Scientist'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Electronics & Communication', 'மின்னணு தகவல் தொடர்பு', '4 years', 'Electronic devices, circuits, communication', 'Electronics Engineer, VLSI Designer'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Mechanical', 'இயந்திர பொறியியல்', '4 years', 'Mechanics, thermodynamics, manufacturing', 'Design Engineer, Automotive Engineer'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Civil', 'குடிசார் பொறியியல்', '4 years', 'Construction, structural design', 'Structural Engineer, Urban Planner'),
    ((SELECT id FROM streams WHERE name = 'Engineering'), 'B.E. Electrical', 'மின் பொறியியல்', '4 years', 'Electrical systems, power generation', 'Power Systems Engineer');

-- Medical Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, career_prospects)
VALUES
    ((SELECT id FROM streams WHERE name = 'Medical'), 'MBBS', 'எம்.பி.பி.எஸ்', '5.5 years', 'Bachelor of Medicine and Surgery', 'Doctor, Surgeon, Specialist'),
    ((SELECT id FROM streams WHERE name = 'Medical'), 'BDS', 'பி.டி.எஸ்', '5 years', 'Bachelor of Dental Surgery', 'Dentist, Oral Surgeon'),
    ((SELECT id FROM streams WHERE name = 'Medical'), 'B.Sc Nursing', 'பி.எஸ்சி நர்சிங்', '4 years', 'Bachelor of Science in Nursing', 'Registered Nurse');

-- Agriculture Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, career_prospects)
VALUES
    ((SELECT id FROM streams WHERE name = 'Agriculture'), 'B.Sc Agriculture', 'பி.எஸ்சி வேளாண்மை', '4 years', 'Agricultural sciences, crop production', 'Agricultural Officer'),
    ((SELECT id FROM streams WHERE name = 'Agriculture'), 'B.Sc Horticulture', 'பி.எஸ்சி தோட்டக்கலை', '4 years', 'Fruit, vegetable cultivation', 'Horticulturist');

-- Arts & Science Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, career_prospects)
VALUES
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'B.Sc Computer Science', 'பி.எஸ்சி கணினி அறிவியல்', '3 years', 'Programming, software development', 'Software Developer'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'B.Com', 'பி.காம்', '3 years', 'Commerce, accounting, business', 'Accountant, Financial Analyst'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'BA English', 'பி.ஏ ஆங்கிலம்', '3 years', 'English language and literature', 'Writer, Teacher'),
    ((SELECT id FROM streams WHERE name = 'Arts & Science'), 'BBA', 'பி.பி.ஏ', '3 years', 'Business Administration', 'Business Manager');

-- Sample Colleges
INSERT INTO colleges (name, name_ta, type, district, website) VALUES
    ('Anna University', 'அண்ணா பல்கலைக்கழகம்', 'government', 'Chennai', 'https://annauniv.edu'),
    ('PSG College of Technology', 'பி.எஸ்.ஜி தொழில்நுட்பக் கல்லூரி', 'aided', 'Coimbatore', 'https://psgtech.edu'),
    ('Madras Medical College', 'சென்னை மருத்துவக் கல்லூரி', 'government', 'Chennai', 'https://mmc.tn.gov.in'),
    ('Tamil Nadu Agricultural University', 'தமிழ்நாடு வேளாண் பல்கலைக்கழகம்', 'government', 'Coimbatore', 'https://tnau.ac.in'),
    ('SRM Institute of Technology', 'எஸ்.ஆர்.எம் தொழில்நுட்ப நிறுவனம்', 'private', 'Chennai', 'https://srmist.edu.in'),
    ('VIT University', 'வி.ஐ.டி பல்கலைக்கழகம்', 'private', 'Vellore', 'https://vit.ac.in');

-- Counselling Data
INSERT INTO counselling (name, name_ta, stream_id, description, documents, important_dates, website)
VALUES
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
SELECT 'Database setup complete!' AS status;
