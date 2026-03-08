# New 12th Group List Implementation Design

**Date:** 2026-03-09
**Status:** Approved

## Overview

Replace the existing group list with the client's updated PDF containing 3 streams (Science, Arts, Vocational) with 40 total groups. Add 2 language subject inputs for all students.

## Current State

- Groups stored in Airtable with flat numbering (Group 1, 2, 3...)
- Each group has 4-6 subjects in a JSON array
- Calculator uses subject codes (M, P, C, B) and positional codes (S3-S6)
- No language subjects collected separately

## New Requirements

1. **3 Streams:** Science (14 groups), Arts (14 groups), Vocational (12 groups)
2. **4 subjects per group** from the PDF
3. **2 language subjects** collected for all students (Language 1, Language 2)
4. **6 total subjects** for marks entry: 2 languages + 4 group subjects
5. **Single dropdown** with format: "Science - Group 1 (Physics, Chemistry, Mathematics, Computer Science)"

## New Group Data

### Science Stream (14 groups)

| # | Subject 1 | Subject 2 | Subject 3 | Subject 4 |
|---|-----------|-----------|-----------|-----------|
| 1 | Physics | Chemistry | Mathematics | Computer Science |
| 2 | Physics | Chemistry | Mathematics | Communicative English |
| 3 | Physics | Chemistry | Mathematics | Home Science |
| 4 | Physics | Chemistry | Mathematics | Statistics |
| 5 | Physics | Chemistry | Mathematics | Bio-Chemistry |
| 6 | Physics | Chemistry | Biology | Bio-Chemistry |
| 7 | Physics | Chemistry | Biology | Computer Science |
| 8 | Physics | Chemistry | Biology | Communicative English |
| 9 | Physics | Chemistry | Biology | Home Science |
| 10 | Physics | Chemistry | Biology | Mathematics |
| 11 | Physics | Chemistry | Biology | Micro-Biology |
| 12 | Physics | Chemistry | Biology | General Nursing |
| 13 | Physics | Chemistry | Biology | Nutrition & Dietetics |
| 14 | Physics | Chemistry | Botany | Zoology |

### Arts Stream (14 groups)

| # | Subject 1 | Subject 2 | Subject 3 | Subject 4 |
|---|-----------|-----------|-----------|-----------|
| 1 | Economics | Commerce | Accountancy | Computer Applications |
| 2 | Economics | Commerce | Accountancy | Advanced Language - Tamil |
| 3 | Economics | Commerce | Accountancy | Business Mathematics & Statistics |
| 4 | Economics | Commerce | Accountancy | Ethics and Indian Culture |
| 5 | Economics | Commerce | Accountancy | Political Science |
| 6 | Economics | Commerce | Accountancy | Communicative English |
| 7 | Economics | Commerce | Accountancy | History |
| 8 | Economics | Commerce | Accountancy | Statistics |
| 9 | Economics | Geography | History | Statistics |
| 10 | Economics | Geography | History | Computer Applications |
| 11 | Economics | Geography | History | Communicative English |
| 12 | Economics | Geography | History | Advanced Language - Tamil |
| 13 | Economics | Geography | History | Ethics & Indian Culture |
| 14 | Economics | Geography | History | Political Science |

### Vocational Stream (12 groups)

| # | Subject 1 | Subject 2 | Subject 3 | Subject 4 |
|---|-----------|-----------|-----------|-----------|
| 1 | Biology | Agricultural Science- Theory | Computer Technology | Agricultural Science - Practical |
| 2 | Biology | Nursing (Vocational)- Theory | Computer Technology | Nursing (Vocational)- Practical |
| 3 | Commerce | Accountancy - Theory | Office Management and Secretaryship - Theory | Typography and Computer Application- Practical |
| 4 | Commerce | Accountancy - Theory | Computer Application | Auditing - Practical |
| 5 | Home Science | Food Service Management - Theory | Computer Technology | Food Service Management - Practical |
| 6 | Home Science | Textile and Dress Designing - Theory | Computer Technology | Textile and Dress Designing - Practical |
| 7 | Mathematics | Basic Automobile Engineering- Theory | Computer Technology | Basic Automobile Engineering- Practical |
| 8 | Mathematics | Basic Civil Engineering- Theory | Computer Technology | Basic Civil Engineering- Practical |
| 9 | Mathematics | Basic Electrical Engineering- Theory | Computer Technology | Basic Electrical Engineering- Practical |
| 10 | Mathematics | Basic Electronics Engineering- Theory | Computer Technology | Basic Electronics Engineering- Practical |
| 11 | Mathematics | Basic Mechanical Engineering- Theory | Computer Technology | Basic Mechanical Engineering- Practical |
| 12 | Mathematics | Textile Technology- Theory | Computer Technology | Textile Technology - Practical |

## Positional Code Mapping

For formulas like `(S3 + S4 + S5 + S6) / 4`:

- S1 = Language 1 marks
- S2 = Language 2 marks
- S3 = Group Subject 1 marks
- S4 = Group Subject 2 marks
- S5 = Group Subject 3 marks
- S6 = Group Subject 4 marks

## Subject Code Mapping

Existing codes continue to work based on subject name matching:

| Code | Subjects |
|------|----------|
| M | Mathematics, Business Mathematics & Statistics |
| P | Physics |
| C | Chemistry |
| B | Biology |
| BOT | Botany |
| ZOO | Zoology |
| CS | Computer Science, Computer Applications, Computer Technology |
| A | Accountancy, Accountancy - Theory |
| E | Economics |
| CO | Commerce |
| H | History |
| G | Geography |
| HS | Home Science |

## UI Changes

### Step 1 - Group Selection

Single dropdown with format:
```
Science - Group 1 (Physics, Chemistry, Mathematics, Computer Science)
Science - Group 2 (Physics, Chemistry, Mathematics, Communicative English)
...
Arts - Group 1 (Economics, Commerce, Accountancy, Computer Applications)
...
Vocational - Group 1 (Biology, Agricultural Science...)
```

### Step 2 - Marks Input

6 input fields:
1. Language 1: ___/100
2. Language 2: ___/100
3. [Subject 1 from group]: ___/100
4. [Subject 2 from group]: ___/100
5. [Subject 3 from group]: ___/100
6. [Subject 4 from group]: ___/100

## Files to Modify

1. **Airtable Groups table** - Replace 40 new groups with stream field
2. **`src/hooks/queries/useGroups.js`** - Add stream field mapping
3. **`src/components/calculator/Step1GroupSelect.jsx`** - Update dropdown label format
4. **`src/components/calculator/Step2MarksInput.jsx`** - Add Language 1 & 2 inputs
5. **`src/lib/calculator.js`** - Update createMarksLookup for 6 subjects
6. **`src/context/CalculatorContext.jsx`** - Initialize language marks

## What Stays the Same

- All cutoff formulas in Admission Bodies table
- Courses table and eligibility logic
- Subject Lists table (for TNAU courses)
- Results display components
- Category grouping logic
