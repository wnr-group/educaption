-- Educaption Cutoff Calculator Seed Data
-- Run this after schema.sql to populate initial data
-- Last Updated: 2026-03-04

-- ============================================
-- CATEGORIES (Community Categories)
-- ============================================
INSERT INTO categories (code, name, name_ta) VALUES
    ('OC', 'Open Category', 'திறந்த பிரிவு'),
    ('BC', 'Backward Class', 'பிற்படுத்தப்பட்ட வகுப்பு'),
    ('BCM', 'Backward Class (Muslim)', 'பிற்படுத்தப்பட்ட வகுப்பு (முஸ்லிம்)'),
    ('MBC', 'Most Backward Class', 'மிகவும் பிற்படுத்தப்பட்ட வகுப்பு'),
    ('DNC', 'Denotified Communities', 'நாடோடி சமூகங்கள்'),
    ('SC', 'Scheduled Caste', 'ஆதி திராவிடர்'),
    ('SCA', 'Scheduled Caste (Arunthathiyar)', 'ஆதி திராவிடர் (அருந்ததியர்)'),
    ('ST', 'Scheduled Tribe', 'பழங்குடியினர்');

-- ============================================
-- GROUPS (12th Standard Subject Groups)
-- Sample of key groups - full 106 groups would be added via admin panel
-- ============================================
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

-- ============================================
-- STREAMS (Educational Streams)
-- ============================================
INSERT INTO streams (name, name_ta, formula, max_cutoff, description) VALUES
    ('Engineering', 'பொறியியல்', 'M/2 + P/4 + C/4', 200,
     'Professional engineering courses including B.E., B.Tech in various disciplines'),

    ('Medical', 'மருத்துவம்', 'B/2 + P/4 + C/4', 200,
     'Medical and health sciences including MBBS, BDS, and allied health courses'),

    ('Agriculture', 'விவசாயம்', 'M/4 + P/4 + C/4 + B/4', 200,
     'Agricultural sciences including B.Sc Agriculture, Horticulture'),

    ('Veterinary', 'கால்நடை மருத்துவம்', 'B/2 + P/4 + C/4', 200,
     'Veterinary sciences - B.V.Sc and related courses'),

    ('Pharmacy', 'மருந்தியல்', 'P/4 + C/4 + M/4 + B/4', 200,
     'Pharmaceutical sciences - B.Pharm, D.Pharm'),

    ('Arts & Science', 'கலை மற்றும் அறிவியல்', 'Average of best 4 subjects', 100,
     'Undergraduate arts and science programs'),

    ('Law', 'சட்டம்', 'Average of best 4 subjects', 100,
     'Law programs - BA LLB, BBA LLB, B.Com LLB'),

    ('Architecture', 'கட்டடக்கலை', 'M/2 + P/4 + C/4', 200,
     'Bachelor of Architecture - B.Arch');

-- Update streams with eligible groups
-- Engineering: Groups 1, 2, 4
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '4')
) WHERE name = 'Engineering';

-- Medical: Groups 1, 3, 5
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')
) WHERE name = 'Medical';

-- Agriculture: Groups 1, 3, 5
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')
) WHERE name = 'Agriculture';

-- Veterinary: Groups 1, 3, 5
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '3', '5')
) WHERE name = 'Veterinary';

-- Pharmacy: Groups 1, 2, 3, 4, 5
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '3', '4', '5')
) WHERE name = 'Pharmacy';

-- Arts & Science: All groups
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups
) WHERE name = 'Arts & Science';

-- Law: All groups
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups
) WHERE name = 'Law';

-- Architecture: Groups 1, 2, 4
UPDATE streams SET eligible_groups = (
    SELECT ARRAY_AGG(id) FROM groups WHERE code IN ('1', '2', '4')
) WHERE name = 'Architecture';

-- ============================================
-- COURSES (Sample Courses)
-- ============================================

-- Engineering Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, eligibility_criteria, career_prospects)
SELECT
    id,
    course_name,
    course_name_ta,
    duration,
    description,
    eligibility,
    careers
FROM streams,
(VALUES
    ('B.E. Computer Science and Engineering', 'கணினி அறிவியல் மற்றும் பொறியியல்', '4 years',
     'Study of computer hardware, software, algorithms, and programming',
     'Physics, Chemistry, Mathematics in 12th',
     'Software Engineer, Data Scientist, System Architect'),
    ('B.E. Electronics and Communication', 'மின்னணு மற்றும் தகவல் தொடர்பு பொறியியல்', '4 years',
     'Study of electronic devices, circuits, and communication systems',
     'Physics, Chemistry, Mathematics in 12th',
     'Electronics Engineer, Network Engineer, VLSI Designer'),
    ('B.E. Mechanical Engineering', 'இயந்திர பொறியியல்', '4 years',
     'Study of mechanics, thermodynamics, and manufacturing',
     'Physics, Chemistry, Mathematics in 12th',
     'Design Engineer, Manufacturing Engineer, Automotive Engineer'),
    ('B.E. Civil Engineering', 'குடிசார் பொறியியல்', '4 years',
     'Study of construction, structural design, and infrastructure',
     'Physics, Chemistry, Mathematics in 12th',
     'Structural Engineer, Construction Manager, Urban Planner'),
    ('B.E. Electrical and Electronics', 'மின் மற்றும் மின்னணு பொறியியல்', '4 years',
     'Study of electrical systems, power generation, and electronics',
     'Physics, Chemistry, Mathematics in 12th',
     'Power Systems Engineer, Control Engineer, Electrical Designer')
) AS courses(course_name, course_name_ta, duration, description, eligibility, careers)
WHERE streams.name = 'Engineering';

-- Medical Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, eligibility_criteria, career_prospects)
SELECT
    id,
    course_name,
    course_name_ta,
    duration,
    description,
    eligibility,
    careers
FROM streams,
(VALUES
    ('MBBS', 'எம்.பி.பி.எஸ்', '5.5 years',
     'Bachelor of Medicine and Bachelor of Surgery - Primary medical degree',
     'Physics, Chemistry, Biology in 12th with minimum 50% marks',
     'Doctor, Surgeon, Medical Specialist'),
    ('BDS', 'பி.டி.எஸ்', '5 years',
     'Bachelor of Dental Surgery - Dental medicine degree',
     'Physics, Chemistry, Biology in 12th',
     'Dentist, Oral Surgeon, Orthodontist'),
    ('B.Sc Nursing', 'பி.எஸ்சி நர்சிங்', '4 years',
     'Bachelor of Science in Nursing',
     'Physics, Chemistry, Biology in 12th',
     'Registered Nurse, Nursing Supervisor, Healthcare Administrator'),
    ('BAMS', 'பி.ஏ.எம்.எஸ்', '5.5 years',
     'Bachelor of Ayurvedic Medicine and Surgery',
     'Physics, Chemistry, Biology in 12th',
     'Ayurvedic Doctor, Wellness Consultant'),
    ('B.Sc Allied Health Sciences', 'பி.எஸ்சி அலைட் ஹெல்த் சயின்ஸ்', '3 years',
     'Various paramedical and allied health programs',
     'Physics, Chemistry, Biology in 12th',
     'Lab Technician, Radiographer, Physiotherapist')
) AS courses(course_name, course_name_ta, duration, description, eligibility, careers)
WHERE streams.name = 'Medical';

-- Agriculture Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, eligibility_criteria, career_prospects)
SELECT
    id,
    course_name,
    course_name_ta,
    duration,
    description,
    eligibility,
    careers
FROM streams,
(VALUES
    ('B.Sc Agriculture', 'பி.எஸ்சி வேளாண்மை', '4 years',
     'Study of agricultural sciences, crop production, and farm management',
     'Physics, Chemistry, Biology/Mathematics in 12th',
     'Agricultural Officer, Farm Manager, Agri-business Consultant'),
    ('B.Sc Horticulture', 'பி.எஸ்சி தோட்டக்கலை', '4 years',
     'Study of fruit, vegetable, and ornamental plant cultivation',
     'Physics, Chemistry, Biology in 12th',
     'Horticulturist, Landscape Designer, Plant Breeder'),
    ('B.Sc Forestry', 'பி.எஸ்சி வனவியல்', '4 years',
     'Study of forest management and conservation',
     'Physics, Chemistry, Biology in 12th',
     'Forest Officer, Wildlife Manager, Environmental Consultant'),
    ('B.Tech Food Technology', 'பி.டெக் உணவு தொழில்நுட்பம்', '4 years',
     'Study of food processing, preservation, and quality control',
     'Physics, Chemistry, Biology/Mathematics in 12th',
     'Food Technologist, Quality Manager, R&D Scientist')
) AS courses(course_name, course_name_ta, duration, description, eligibility, careers)
WHERE streams.name = 'Agriculture';

-- Arts & Science Courses
INSERT INTO courses (stream_id, name, name_ta, duration, description, eligibility_criteria, career_prospects)
SELECT
    id,
    course_name,
    course_name_ta,
    duration,
    description,
    eligibility,
    careers
FROM streams,
(VALUES
    ('B.Sc Computer Science', 'பி.எஸ்சி கணினி அறிவியல்', '3 years',
     'Study of computer fundamentals, programming, and software development',
     'Mathematics in 12th preferred',
     'Software Developer, System Analyst, IT Support'),
    ('B.Com', 'பி.காம்', '3 years',
     'Study of commerce, accounting, and business principles',
     'Commerce subjects in 12th preferred',
     'Accountant, Auditor, Financial Analyst'),
    ('BA English', 'பி.ஏ ஆங்கிலம்', '3 years',
     'Study of English language and literature',
     'Any 12th group',
     'Writer, Teacher, Content Creator, Translator'),
    ('B.Sc Mathematics', 'பி.எஸ்சி கணிதம்', '3 years',
     'Study of pure and applied mathematics',
     'Mathematics in 12th',
     'Mathematician, Data Analyst, Actuary'),
    ('BBA', 'பி.பி.ஏ', '3 years',
     'Bachelor of Business Administration',
     'Any 12th group',
     'Business Manager, Marketing Executive, HR Professional'),
    ('B.Sc Physics', 'பி.எஸ்சி இயற்பியல்', '3 years',
     'Study of physics fundamentals and applications',
     'Physics, Mathematics in 12th',
     'Physicist, Research Scientist, Lab Technician'),
    ('B.Sc Chemistry', 'பி.எஸ்சி வேதியியல்', '3 years',
     'Study of chemistry and chemical applications',
     'Chemistry in 12th',
     'Chemist, Lab Analyst, Quality Control Officer')
) AS courses(course_name, course_name_ta, duration, description, eligibility, careers)
WHERE streams.name = 'Arts & Science';

-- ============================================
-- SITE SETTINGS (Initial Configuration)
-- ============================================
INSERT INTO site_settings (key, value, description) VALUES
    ('academic_year', '"2026-2027"', 'Current academic year for counselling'),
    ('cutoff_calculation_enabled', 'true', 'Enable/disable cutoff calculator'),
    ('contact_email', '"contact@educaption.org"', 'Contact email for inquiries'),
    ('contact_phone', '"+91-XXXXXXXXXX"', 'Contact phone number'),
    ('social_links', '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}', 'Social media links'),
    ('hero_banner', '{"title": "Calculate Your Cutoff", "subtitle": "Discover your path to higher education", "cta_text": "Start Calculating"}', 'Home page hero banner content'),
    ('announcement', '{"enabled": false, "message": "", "type": "info"}', 'Site-wide announcement banner'),
    ('maintenance_mode', 'false', 'Enable maintenance mode');

-- ============================================
-- SAMPLE COUNSELLING DATA
-- ============================================
INSERT INTO counselling (name, name_ta, stream_id, description, description_ta, documents, important_dates, fees, website, steps, eligibility)
SELECT
    'TNEA (Tamil Nadu Engineering Admissions)',
    'தமிழ்நாடு பொறியியல் சேர்க்கை',
    id,
    'Tamil Nadu Engineering Admissions is the centralized counselling process for admission to undergraduate engineering courses in Tamil Nadu.',
    'தமிழ்நாடு பொறியியல் சேர்க்கை என்பது தமிழ்நாட்டில் இளங்கலை பொறியியல் படிப்புகளுக்கான மையப்படுத்தப்பட்ட ஆலோசனை செயல்முறை ஆகும்.',
    '[
        {"name": "12th Mark Sheet", "name_ta": "12ஆம் வகுப்பு மதிப்பெண் பட்டியல்"},
        {"name": "Community Certificate", "name_ta": "சமூகச் சான்றிதழ்"},
        {"name": "Income Certificate", "name_ta": "வருமானச் சான்றிதழ்"},
        {"name": "Transfer Certificate", "name_ta": "மாற்றுச் சான்றிதழ்"},
        {"name": "Aadhaar Card", "name_ta": "ஆதார் அட்டை"},
        {"name": "Passport Size Photos", "name_ta": "பாஸ்போர்ட் அளவு புகைப்படங்கள்"},
        {"name": "Nativity Certificate", "name_ta": "பிறப்பிடச் சான்றிதழ்"}
    ]',
    '[
        {"event": "Registration Opens", "date": "May 2026"},
        {"event": "Registration Closes", "date": "June 2026"},
        {"event": "Rank List Publication", "date": "June 2026"},
        {"event": "Counselling Begins", "date": "July 2026"},
        {"event": "Classes Commence", "date": "August 2026"}
    ]',
    '{
        "registration": 500,
        "counselling": 5000,
        "tuition_govt": 50000,
        "tuition_private": 150000
    }',
    'https://tneaonline.org',
    '[
        {"step": 1, "title": "Register Online", "description": "Create account and fill application form"},
        {"step": 2, "title": "Pay Registration Fee", "description": "Pay the registration fee online"},
        {"step": 3, "title": "Upload Documents", "description": "Upload all required documents"},
        {"step": 4, "title": "Verify Application", "description": "Verify and submit application"},
        {"step": 5, "title": "Attend Counselling", "description": "Participate in online counselling"},
        {"step": 6, "title": "Choose College", "description": "Select college based on rank and preference"}
    ]',
    'Candidates must have studied Physics, Chemistry, and Mathematics in 12th standard from a recognized board.'
FROM streams WHERE name = 'Engineering';

-- Medical Counselling
INSERT INTO counselling (name, name_ta, stream_id, description, description_ta, documents, important_dates, fees, website, steps, eligibility)
SELECT
    'Medical Counselling Committee (MCC)',
    'மருத்துவ ஆலோசனைக் குழு',
    id,
    'Medical Counselling Committee conducts counselling for admission to MBBS and BDS courses based on NEET scores.',
    'மருத்துவ ஆலோசனைக் குழு NEET மதிப்பெண்களின் அடிப்படையில் MBBS மற்றும் BDS படிப்புகளுக்கான ஆலோசனையை நடத்துகிறது.',
    '[
        {"name": "NEET Score Card", "name_ta": "NEET மதிப்பெண் அட்டை"},
        {"name": "12th Mark Sheet", "name_ta": "12ஆம் வகுப்பு மதிப்பெண் பட்டியல்"},
        {"name": "Community Certificate", "name_ta": "சமூகச் சான்றிதழ்"},
        {"name": "Income Certificate", "name_ta": "வருமானச் சான்றிதழ்"},
        {"name": "Transfer Certificate", "name_ta": "மாற்றுச் சான்றிதழ்"},
        {"name": "Aadhaar Card", "name_ta": "ஆதார் அட்டை"},
        {"name": "Passport Size Photos", "name_ta": "பாஸ்போர்ட் அளவு புகைப்படங்கள்"}
    ]',
    '[
        {"event": "NEET Exam", "date": "May 2026"},
        {"event": "Results Declaration", "date": "June 2026"},
        {"event": "Counselling Registration", "date": "June-July 2026"},
        {"event": "Round 1 Counselling", "date": "July 2026"},
        {"event": "Round 2 Counselling", "date": "August 2026"}
    ]',
    '{
        "registration": 1000,
        "counselling": 10000,
        "tuition_govt": 25000,
        "tuition_private": 1500000
    }',
    'https://mcc.nic.in',
    '[
        {"step": 1, "title": "Appear for NEET", "description": "Take the NEET-UG examination"},
        {"step": 2, "title": "Register for Counselling", "description": "Register on MCC website"},
        {"step": 3, "title": "Fill Choice", "description": "Enter college and course preferences"},
        {"step": 4, "title": "Attend Counselling", "description": "Participate in counselling rounds"},
        {"step": 5, "title": "Report to College", "description": "Complete admission at allotted college"}
    ]',
    'Candidates must have qualified NEET-UG with required minimum percentile based on category.'
FROM streams WHERE name = 'Medical';
