# New 12th Group List Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace existing groups with 40 new groups across 3 streams (Science, Arts, Vocational) and add 2 language subject inputs for all students.

**Architecture:** Update Airtable Groups data with new stream-based groups, modify Step1 dropdown to show stream prefix, add Language 1/2 inputs to Step2, and update calculator to map 6 subjects (2 languages + 4 group subjects) to positional codes S1-S6.

**Tech Stack:** React, Airtable REST API, TailwindCSS

---

### Task 1: Create New Groups CSV for Airtable Import

**Files:**
- Create: `scripts/airtable-import/4-groups-v2.csv`

**Step 1: Create the CSV file with all 40 groups**

```csv
Code,Stream,Name,Name_Tamil,Subjects
SCI-1,Science,"Physics, Chemistry, Mathematics, Computer Science","இயற்பியல், வேதியியல், கணிதம், கணினி அறிவியல்","[""Physics"", ""Chemistry"", ""Mathematics"", ""Computer Science""]"
SCI-2,Science,"Physics, Chemistry, Mathematics, Communicative English","இயற்பியல், வேதியியல், கணிதம், தொடர்பு ஆங்கிலம்","[""Physics"", ""Chemistry"", ""Mathematics"", ""Communicative English""]"
SCI-3,Science,"Physics, Chemistry, Mathematics, Home Science","இயற்பியல், வேதியியல், கணிதம், இல்ல அறிவியல்","[""Physics"", ""Chemistry"", ""Mathematics"", ""Home Science""]"
SCI-4,Science,"Physics, Chemistry, Mathematics, Statistics","இயற்பியல், வேதியியல், கணிதம், புள்ளியியல்","[""Physics"", ""Chemistry"", ""Mathematics"", ""Statistics""]"
SCI-5,Science,"Physics, Chemistry, Mathematics, Bio-Chemistry","இயற்பியல், வேதியியல், கணிதம், உயிர் வேதியியல்","[""Physics"", ""Chemistry"", ""Mathematics"", ""Bio-Chemistry""]"
SCI-6,Science,"Physics, Chemistry, Biology, Bio-Chemistry","இயற்பியல், வேதியியல், உயிரியல், உயிர் வேதியியல்","[""Physics"", ""Chemistry"", ""Biology"", ""Bio-Chemistry""]"
SCI-7,Science,"Physics, Chemistry, Biology, Computer Science","இயற்பியல், வேதியியல், உயிரியல், கணினி அறிவியல்","[""Physics"", ""Chemistry"", ""Biology"", ""Computer Science""]"
SCI-8,Science,"Physics, Chemistry, Biology, Communicative English","இயற்பியல், வேதியியல், உயிரியல், தொடர்பு ஆங்கிலம்","[""Physics"", ""Chemistry"", ""Biology"", ""Communicative English""]"
SCI-9,Science,"Physics, Chemistry, Biology, Home Science","இயற்பியல், வேதியியல், உயிரியல், இல்ல அறிவியல்","[""Physics"", ""Chemistry"", ""Biology"", ""Home Science""]"
SCI-10,Science,"Physics, Chemistry, Biology, Mathematics","இயற்பியல், வேதியியல், உயிரியல், கணிதம்","[""Physics"", ""Chemistry"", ""Biology"", ""Mathematics""]"
SCI-11,Science,"Physics, Chemistry, Biology, Micro-Biology","இயற்பியல், வேதியியல், உயிரியல், நுண்ணுயிரியல்","[""Physics"", ""Chemistry"", ""Biology"", ""Micro-Biology""]"
SCI-12,Science,"Physics, Chemistry, Biology, General Nursing","இயற்பியல், வேதியியல், உயிரியல், பொது நர்சிங்","[""Physics"", ""Chemistry"", ""Biology"", ""General Nursing""]"
SCI-13,Science,"Physics, Chemistry, Biology, Nutrition & Dietetics","இயற்பியல், வேதியியல், உயிரியல், ஊட்டச்சத்து & உணவியல்","[""Physics"", ""Chemistry"", ""Biology"", ""Nutrition & Dietetics""]"
SCI-14,Science,"Physics, Chemistry, Botany, Zoology","இயற்பியல், வேதியியல், தாவரவியல், விலங்கியல்","[""Physics"", ""Chemistry"", ""Botany"", ""Zoology""]"
ART-1,Arts,"Economics, Commerce, Accountancy, Computer Applications","பொருளியல், வணிகம், கணக்கியல், கணினி பயன்பாடுகள்","[""Economics"", ""Commerce"", ""Accountancy"", ""Computer Applications""]"
ART-2,Arts,"Economics, Commerce, Accountancy, Advanced Language - Tamil","பொருளியல், வணிகம், கணக்கியல், மேம்பட்ட மொழி - தமிழ்","[""Economics"", ""Commerce"", ""Accountancy"", ""Advanced Language - Tamil""]"
ART-3,Arts,"Economics, Commerce, Accountancy, Business Mathematics & Statistics","பொருளியல், வணிகம், கணக்கியல், வணிக கணிதம் & புள்ளியியல்","[""Economics"", ""Commerce"", ""Accountancy"", ""Business Mathematics & Statistics""]"
ART-4,Arts,"Economics, Commerce, Accountancy, Ethics and Indian Culture","பொருளியல், வணிகம், கணக்கியல், நெறிமுறைகள் மற்றும் இந்திய கலாச்சாரம்","[""Economics"", ""Commerce"", ""Accountancy"", ""Ethics and Indian Culture""]"
ART-5,Arts,"Economics, Commerce, Accountancy, Political Science","பொருளியல், வணிகம், கணக்கியல், அரசியல் அறிவியல்","[""Economics"", ""Commerce"", ""Accountancy"", ""Political Science""]"
ART-6,Arts,"Economics, Commerce, Accountancy, Communicative English","பொருளியல், வணிகம், கணக்கியல், தொடர்பு ஆங்கிலம்","[""Economics"", ""Commerce"", ""Accountancy"", ""Communicative English""]"
ART-7,Arts,"Economics, Commerce, Accountancy, History","பொருளியல், வணிகம், கணக்கியல், வரலாறு","[""Economics"", ""Commerce"", ""Accountancy"", ""History""]"
ART-8,Arts,"Economics, Commerce, Accountancy, Statistics","பொருளியல், வணிகம், கணக்கியல், புள்ளியியல்","[""Economics"", ""Commerce"", ""Accountancy"", ""Statistics""]"
ART-9,Arts,"Economics, Geography, History, Statistics","பொருளியல், புவியியல், வரலாறு, புள்ளியியல்","[""Economics"", ""Geography"", ""History"", ""Statistics""]"
ART-10,Arts,"Economics, Geography, History, Computer Applications","பொருளியல், புவியியல், வரலாறு, கணினி பயன்பாடுகள்","[""Economics"", ""Geography"", ""History"", ""Computer Applications""]"
ART-11,Arts,"Economics, Geography, History, Communicative English","பொருளியல், புவியியல், வரலாறு, தொடர்பு ஆங்கிலம்","[""Economics"", ""Geography"", ""History"", ""Communicative English""]"
ART-12,Arts,"Economics, Geography, History, Advanced Language - Tamil","பொருளியல், புவியியல், வரலாறு, மேம்பட்ட மொழி - தமிழ்","[""Economics"", ""Geography"", ""History"", ""Advanced Language - Tamil""]"
ART-13,Arts,"Economics, Geography, History, Ethics & Indian Culture","பொருளியல், புவியியல், வரலாறு, நெறிமுறைகள் & இந்திய கலாச்சாரம்","[""Economics"", ""Geography"", ""History"", ""Ethics & Indian Culture""]"
ART-14,Arts,"Economics, Geography, History, Political Science","பொருளியல், புவியியல், வரலாறு, அரசியல் அறிவியல்","[""Economics"", ""Geography"", ""History"", ""Political Science""]"
VOC-1,Vocational,"Biology, Agricultural Science","உயிரியல், வேளாண் அறிவியல்","[""Biology"", ""Agricultural Science- Theory"", ""Computer Technology"", ""Agricultural Science - Practical""]"
VOC-2,Vocational,"Biology, Nursing (Vocational)","உயிரியல், நர்சிங் (தொழில்)","[""Biology"", ""Nursing (Vocational)- Theory"", ""Computer Technology"", ""Nursing (Vocational)- Practical""]"
VOC-3,Vocational,"Commerce, Office Management","வணிகம், அலுவலக மேலாண்மை","[""Commerce"", ""Accountancy - Theory"", ""Office Management and Secretaryship - Theory"", ""Typography and Computer Application- Practical""]"
VOC-4,Vocational,"Commerce, Accountancy & Auditing","வணிகம், கணக்கியல் & தணிக்கை","[""Commerce"", ""Accountancy - Theory"", ""Computer Application"", ""Auditing - Practical""]"
VOC-5,Vocational,"Home Science, Food Service Management","இல்ல அறிவியல், உணவு சேவை மேலாண்மை","[""Home Science"", ""Food Service Management - Theory"", ""Computer Technology"", ""Food Service Management - Practical""]"
VOC-6,Vocational,"Home Science, Textile and Dress Designing","இல்ல அறிவியல், ஜவுளி மற்றும் ஆடை வடிவமைப்பு","[""Home Science"", ""Textile and Dress Designing - Theory"", ""Computer Technology"", ""Textile and Dress Designing - Practical""]"
VOC-7,Vocational,"Mathematics, Basic Automobile Engineering","கணிதம், அடிப்படை வாகன பொறியியல்","[""Mathematics"", ""Basic Automobile Engineering- Theory"", ""Computer Technology"", ""Basic Automobile Engineering- Practical""]"
VOC-8,Vocational,"Mathematics, Basic Civil Engineering","கணிதம், அடிப்படை சிவில் பொறியியல்","[""Mathematics"", ""Basic Civil Engineering- Theory"", ""Computer Technology"", ""Basic Civil Engineering- Practical""]"
VOC-9,Vocational,"Mathematics, Basic Electrical Engineering","கணிதம், அடிப்படை மின் பொறியியல்","[""Mathematics"", ""Basic Electrical Engineering- Theory"", ""Computer Technology"", ""Basic Electrical Engineering- Practical""]"
VOC-10,Vocational,"Mathematics, Basic Electronics Engineering","கணிதம், அடிப்படை எலக்ட்ரானிக்ஸ் பொறியியல்","[""Mathematics"", ""Basic Electronics Engineering- Theory"", ""Computer Technology"", ""Basic Electronics Engineering- Practical""]"
VOC-11,Vocational,"Mathematics, Basic Mechanical Engineering","கணிதம், அடிப்படை இயந்திர பொறியியல்","[""Mathematics"", ""Basic Mechanical Engineering- Theory"", ""Computer Technology"", ""Basic Mechanical Engineering- Practical""]"
VOC-12,Vocational,"Mathematics, Textile Technology","கணிதம், ஜவுளி தொழில்நுட்பம்","[""Mathematics"", ""Textile Technology- Theory"", ""Computer Technology"", ""Textile Technology - Practical""]"
```

**Step 2: Verify CSV structure**

Run: `head -5 scripts/airtable-import/4-groups-v2.csv`
Expected: CSV headers and first 4 data rows displayed correctly

**Step 3: Commit**

```bash
git add scripts/airtable-import/4-groups-v2.csv
git commit -m "feat: add new groups CSV with 3 streams (40 groups total)"
```

---

### Task 2: Update useGroups Hook to Include Stream Field

**Files:**
- Modify: `src/hooks/queries/useGroups.js:13-19`

**Step 1: Update the select transform to include stream**

Replace lines 13-19 with:

```javascript
    select: (data) => data.map(group => ({
      id: group.id,
      code: group.Code,
      stream: group.Stream,
      name: group.Name,
      name_ta: group.Name_Tamil,
      subjects: JSON.parse(group.Subjects || '[]')
    }))
```

**Step 2: Verify no syntax errors**

Run: `npm run build 2>&1 | head -20`
Expected: No errors related to useGroups.js

**Step 3: Commit**

```bash
git add src/hooks/queries/useGroups.js
git commit -m "feat: add stream field to groups data mapping"
```

---

### Task 3: Update Step1GroupSelect Dropdown Label Format

**Files:**
- Modify: `src/components/calculator/Step1GroupSelect.jsx:26-31`

**Step 1: Update formattedOptions to show stream prefix and subjects**

Replace lines 26-31 with:

```javascript
  const formattedOptions = groups.map(g => {
    const subjectList = (language === 'ta' && g.subjects_ta?.length)
      ? g.subjects_ta.slice(0, 2).join(', ')
      : (g.subjects || []).slice(0, 2).join(', ')
    const streamLabel = g.stream || 'Group'
    const groupNum = g.code.split('-')[1] || g.code
    return {
      value: g.id,
      label: `${streamLabel} - Group ${groupNum} (${subjectList}...)`
    }
  })
```

**Step 2: Verify the component renders**

Run: `npm run dev` and open browser to check dropdown
Expected: Dropdown shows "Science - Group 1 (Physics, Chemistry...)"

**Step 3: Commit**

```bash
git add src/components/calculator/Step1GroupSelect.jsx
git commit -m "feat: update group dropdown to show stream prefix and subjects"
```

---

### Task 4: Add Language Subject Inputs to Step2MarksInput

**Files:**
- Modify: `src/components/calculator/Step2MarksInput.jsx`

**Step 1: Add language subjects constant and update subjects array**

Add after line 18 (after `const validation = ...`):

```javascript
  // Language subjects are always required (fixed labels)
  const languageSubjects = ['Language 1', 'Language 2']

  // All subjects: 2 languages + 4 group subjects
  const allSubjects = [...languageSubjects, ...subjects]
  const allTranslatedSubjects = [
    language === 'ta' ? 'மொழி 1' : 'Language 1',
    language === 'ta' ? 'மொழி 2' : 'Language 2',
    ...translatedSubjects
  ]
```

**Step 2: Update allMarksFilled check**

Replace line 40-43 with:

```javascript
  const allMarksFilled = allSubjects.every(subject => {
    const mark = marks[subject]
    return mark !== undefined && mark !== '' && mark !== null
  })
```

**Step 3: Update totalMarks and maxMarks calculations**

Replace lines 45-47 with:

```javascript
  const totalMarks = Object.values(marks).reduce((sum, mark) => sum + (parseFloat(mark) || 0), 0)
  const maxMarks = allSubjects.length * 100
  const percentComplete = allMarksFilled ? (totalMarks / maxMarks) * 100 : 0
```

**Step 4: Update the marks input grid to use allSubjects**

Replace lines 72-133 (the map over subjects) with:

```javascript
        {allSubjects.map((subject, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-4
              p-4
              ${index < 2 ? 'bg-saffron-50 border-saffron-200' : 'bg-cream-50 border-navy-100'}
              border
              rounded-xl
              transition-all duration-200
              focus-within:border-saffron-300
              focus-within:shadow-soft
            `}
          >
            {/* Subject Number */}
            <span className={`
              w-10 h-10 flex-shrink-0
              ${index < 2 ? 'bg-saffron-100 text-saffron-700' : 'bg-white text-navy-600'}
              rounded-xl
              flex items-center justify-center
              font-display font-bold text-sm
              border border-navy-100
            `}>
              {index < 2 ? 'L' + (index + 1) : index - 1}
            </span>

            {/* Subject Name */}
            <div className="flex-1 min-w-0">
              <label className="font-body font-medium text-navy-800 block mb-1">
                {allTranslatedSubjects[index] || subject}
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={t('calculator.step2.enterMarks') || "Enter marks (0-100)"}
                value={marks[subject] || ''}
                onChange={(e) => handleMarkChange(subject, e.target.value)}
                className="
                  w-full
                  bg-transparent
                  border-none
                  p-0
                  font-body text-lg
                  text-navy-900
                  placeholder:text-navy-300
                  focus:outline-none focus:ring-0
                "
              />
            </div>

            {/* Max Marks */}
            <div className="flex items-center gap-2">
              <span className="font-body text-navy-400">/100</span>
              {marks[subject] && parseFloat(marks[subject]) >= 0 && parseFloat(marks[subject]) <= 100 && (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          </div>
        ))}
```

**Step 5: Verify the component renders with 6 inputs**

Run: `npm run dev` and select a group
Expected: 6 input fields shown (2 for languages with different styling, 4 for group subjects)

**Step 6: Commit**

```bash
git add src/components/calculator/Step2MarksInput.jsx
git commit -m "feat: add Language 1 and Language 2 inputs to marks entry"
```

---

### Task 5: Update Calculator to Map 6 Subjects with S1-S6 Codes

**Files:**
- Modify: `src/lib/calculator.js:62-88`

**Step 1: Update createMarksLookup to handle language subjects**

Replace the `createMarksLookup` function (lines 62-88) with:

```javascript
/**
 * Creates marks lookup from subjects array and marks object
 * Handles special cases like Botany+Zoology = Biology average
 * Also creates positional codes (S1-S6) for formulas
 * S1, S2 = Language subjects
 * S3-S6 = Group subjects
 *
 * @param {Array<string>} subjects - Array of group subject names (4 subjects)
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @returns {Object} Object with subject codes as keys and marks as values
 */
function createMarksLookup(subjects, marks) {
  const lookup = {}

  // Language subjects are always S1 and S2
  const lang1Mark = parseFloat(marks['Language 1']) || 0
  const lang2Mark = parseFloat(marks['Language 2']) || 0
  lookup['S1'] = lang1Mark
  lookup['S2'] = lang2Mark

  // Map each group subject to its code and positional code (S3-S6)
  subjects.forEach((subject, index) => {
    const code = getSubjectCode(subject)
    const mark = parseFloat(marks[subject]) || 0
    lookup[code] = mark

    // S3 through S6 for the 4 group subjects
    lookup[`S${index + 3}`] = mark
  })

  // Handle Biology = Botany + Zoology average if both present but B is not
  if (lookup['BOT'] !== undefined && lookup['ZOO'] !== undefined && lookup['B'] === undefined) {
    lookup['B'] = (lookup['BOT'] + lookup['ZOO']) / 2
  }

  // If Biology exists, also set BOT and ZOO to same value (for formulas using both)
  if (lookup['B'] !== undefined && lookup['BOT'] === undefined) {
    lookup['BOT'] = lookup['B']
    lookup['ZOO'] = lookup['B']
  }

  return lookup
}
```

**Step 2: Update SUBJECT_CODE_MAP to include new subjects**

Replace lines 16-33 with:

```javascript
const SUBJECT_CODE_MAP = {
  'M': ['Mathematics', 'Maths', 'MATHEMATICS', 'MATHS', 'Business Mathematics', 'Business Mathematics & Statistics'],
  'P': ['Physics', 'PHYSICS'],
  'C': ['Chemistry', 'CHEMISTRY'],
  'B': ['Biology', 'BIOLOGY'],
  'BOT': ['Botany', 'BOTANY'],
  'ZOO': ['Zoology', 'ZOOLOGY'],
  'CS': ['Computer Science', 'COMPUTER SCIENCE', 'Computer Applications', 'Computer Technology', 'Computer Application'],
  'IT': ['Information Technology', 'INFORMATION TECHNOLOGY'],
  'IP': ['Informatics Practices', 'INFORMATICS PRACTICES'],
  'A': ['Accountancy', 'ACCOUNTANCY', 'Accounts', 'Accountancy - Theory'],
  'E': ['Economics', 'ECONOMICS'],
  'CO': ['Commerce', 'COMMERCE'],
  'H': ['History', 'HISTORY'],
  'G': ['Geography', 'GEOGRAPHY'],
  'PS': ['Political Science', 'POLITICAL SCIENCE'],
  'SO': ['Sociology', 'SOCIOLOGY'],
  'HS': ['Home Science', 'HOME SCIENCE'],
  'BC': ['Bio-Chemistry', 'BIO-CHEMISTRY', 'Biochemistry'],
  'MB': ['Micro-Biology', 'MICRO-BIOLOGY', 'Microbiology'],
  'ST': ['Statistics', 'STATISTICS']
}
```

**Step 3: Verify build passes**

Run: `npm run build 2>&1 | head -20`
Expected: No errors

**Step 4: Commit**

```bash
git add src/lib/calculator.js
git commit -m "feat: update calculator to map 6 subjects with S1-S6 positional codes"
```

---

### Task 6: Update validateMarks to Include Language Subjects

**Files:**
- Modify: `src/lib/calculator.js:393-417`

**Step 1: Update validateMarks function**

Replace the `validateMarks` function with:

```javascript
/**
 * Validates marks input
 * @param {Object} marks - Object with subject names as keys and marks as values
 * @param {Array<string>} subjects - Required group subject names
 * @returns {Object} Validation result with isValid and errors
 */
export function validateMarks(marks, subjects) {
  const errors = {}

  // All subjects to validate: 2 languages + group subjects
  const allSubjects = ['Language 1', 'Language 2', ...subjects]

  for (const subject of allSubjects) {
    const mark = marks[subject]

    if (mark === undefined || mark === '' || mark === null) {
      errors[subject] = 'Mark is required'
    } else {
      const numMark = parseFloat(mark)
      if (isNaN(numMark)) {
        errors[subject] = 'Must be a number'
      } else if (numMark < 0) {
        errors[subject] = 'Cannot be negative'
      } else if (numMark > 100) {
        errors[subject] = 'Cannot exceed 100'
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

**Step 2: Verify build passes**

Run: `npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/calculator.js
git commit -m "feat: update validateMarks to include language subjects"
```

---

### Task 7: Update Airtable Groups Table

**Manual Step - Airtable UI:**

1. Open Airtable base
2. Go to Groups table
3. Add new column "Stream" (Single line text)
4. Delete all existing rows
5. Import `scripts/airtable-import/4-groups-v2.csv`
6. Verify 40 rows imported with correct Stream values

**Verification:**

Run the app and check:
1. Dropdown shows 40 groups with stream prefixes
2. Selecting a group shows 4 subjects
3. Marks input shows 6 fields (2 languages + 4 subjects)

**Step 1: Commit any remaining changes**

```bash
git add .
git commit -m "docs: update airtable import instructions for new groups"
```

---

### Task 8: Update Eligible_Groups in Courses Table

**Manual Step - Airtable UI:**

The existing courses have `Eligible_Groups` like "1, 2, 4". These need to be updated to use new codes like "SCI-1, SCI-2, SCI-10".

**Mapping logic:**
- TNEA (Engineering): Needs M + P/2 + C/2 → Science groups with Mathematics: SCI-1 to SCI-5, SCI-10, VOC-7 to VOC-12
- Medical/Veterinary/Paramedical: Needs B + P/2 + C/2 → Science groups with Biology: SCI-6 to SCI-14
- Law (TNDALU): Uses (S3+S4+S5+S6)/4 → All groups eligible
- Arts courses: ART-1 to ART-14

Update each course's Eligible_Groups field in Airtable accordingly.

---

### Task 9: End-to-End Testing

**Step 1: Test Science group with Engineering formula**

1. Select "Science - Group 1 (Physics, Chemistry, Mathematics, Computer Science)"
2. Enter marks:
   - Language 1: 90
   - Language 2: 85
   - Physics: 95
   - Chemistry: 92
   - Mathematics: 98
   - Computer Science: 88
3. Calculate cutoff
4. Expected TNEA cutoff: 98 + 95/2 + 92/2 = 98 + 47.5 + 46 = 191.5

**Step 2: Test Biology group with Medical formula**

1. Select "Science - Group 6 (Physics, Chemistry, Biology, Bio-Chemistry)"
2. Enter marks:
   - Language 1: 85
   - Language 2: 80
   - Physics: 90
   - Chemistry: 88
   - Biology: 95
   - Bio-Chemistry: 82
3. Calculate cutoff
4. Expected Paramedical cutoff: 95 + 90/2 + 88/2 = 95 + 45 + 44 = 184

**Step 3: Test Law formula (all subjects average)**

1. Select any group
2. Enter marks for all 6 subjects
3. Check TNDALU cutoff = (S3 + S4 + S5 + S6) / 4

**Step 4: Commit test verification**

```bash
git add .
git commit -m "test: verify new group list with cutoff calculations"
```

---

### Task 10: Final Cleanup and Documentation

**Files:**
- Modify: `docs/AIRTABLE_SETUP.md`

**Step 1: Update Airtable setup docs with new Groups schema**

Add Stream field to Groups table documentation:

```markdown
### Groups
| Field | Type | Description |
|-------|------|-------------|
| Code | Text | Group code (SCI-1, ART-1, VOC-1, etc.) |
| Stream | Text | Science, Arts, or Vocational |
| Name | Text | Subject combination |
| Name_Tamil | Text | Tamil translation |
| Subjects | Long Text | JSON array of 4 subjects |
```

**Step 2: Commit documentation**

```bash
git add docs/AIRTABLE_SETUP.md
git commit -m "docs: update airtable setup for new group structure"
```

**Step 3: Final commit**

```bash
git log --oneline -10
```

Expected: Series of commits for new group list implementation
