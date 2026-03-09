# Airtable Import Guide

## Quick Start

1. Go to [airtable.com](https://airtable.com) and create a new base called **"Educaption Cutoff"**
2. Import CSVs in this order (number prefix indicates order):

| Order | File | Table Name |
|-------|------|------------|
| 1 | `1-admission-bodies.csv` | Admission Bodies |
| 2 | `2-subject-lists.csv` | Subject Lists |
| 3 | `3-categories.csv` | Categories |
| 4 | `4-groups.csv` | Groups |
| 5 | `5-courses.csv` | Courses |

## How to Import CSV in Airtable

1. In your Airtable base, click **"+ Add or import"** (top left)
2. Select **"CSV file"**
3. Upload the CSV file
4. Airtable will auto-detect columns
5. Review and click **"Import"**

## After Import: Set Up Linked Fields

After importing all CSVs, you need to convert some text fields to linked records:

### In the Courses table:
1. Click on the **Admission_Body** column header
2. Select **"Customize field type"**
3. Change to **"Link to another record"**
4. Select **"Admission Bodies"** table
5. Repeat for **Subject_List** column → link to **"Subject Lists"** table

## Get API Credentials

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Name it "Educaption Cutoff"
4. Add scope: `data.records:read`
5. Add access to your "Educaption Cutoff" base
6. Copy the token

### Get Base ID
1. Open your base in Airtable
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The `appXXXXXXXXXXXXXX` part is your Base ID

## Environment Variables

Add these to your `.env.local`:

```
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

---

## Formula Reference

### Admission Bodies & Formulas

| Admission Body | Formula | Max Cutoff |
|----------------|---------|------------|
| TNEA | Maths + Physics/2 + Chemistry/2 | 200 |
| TNEA - Vocational | Maths + theory/2 + practical/2 | 200 |
| TNDALU | (S3 + S4 + S5 + S6) / 4 | 100 |
| TANUVAS - BVSC | Biology + Physics/2 + Chemistry/2 | 200 |
| TANUVAS - BVSC - Vocational | Biology + theory/2 + practical/2 | 200 |
| TANUVAS - B.Tech | Biology/2 + Physics/2 + Chemistry/2 + Maths/2 | 200 |
| TNAU - Agriculture | Biology/2 + Physics/2 + Chemistry/2 + LIST_A/2 | 200 |
| TNAU - Agriculture - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | 200 |
| TNAU - Agriculture - Vocational | Biology/2 + computer tech/2 + theory/2 + practical/2 | 200 |
| TNAU - Food Nutrition | Biology/2 + Physics/2 + Chemistry/2 + LIST_B/2 | 200 |
| TNAU - Food Nutrition - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | 200 |
| TNAU - Agri Engineering | Biology/2 + Physics/2 + Chemistry/2 + LIST_C/2 | 200 |
| TNJFU - Fisheries | Biology/2 + Physics/2 + Chemistry/2 + LIST_D/2 | 200 |
| TNJFU - Fisheries - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | 200 |
| TNJFU - Fisheries - Vocational | Biology/2 + computer tech/2 + theory/2 + practical/2 | 200 |
| TNJFU - B.Tech | Maths/2 + Physics/2 + Chemistry/2 + LIST_E/2 | 200 |
| TNJFU - B.Voc | AVG (average of all subjects) | 100 |
| TN Paramedical - Pharmacy | Physics/2 + Chemistry/2 + LIST_F/2 | 200 |
| TN Paramedical - Pharmacy - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | 200 |
| TN Paramedical - Nursing | Biology + Physics/2 + Chemistry/2 | 200 |
| TN Paramedical - Nursing - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | 200 |

### Subject Lists

| List | Subjects |
|------|----------|
| LIST_A | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science |
| LIST_B | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science, Nutrition and Dietetics |
| LIST_C | Mathematics, Computer Science |
| LIST_D | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science |
| LIST_E | Biology, Computer Science |
| LIST_F | Biology, Mathematics (Priority: Biology first, then Mathematics) |

### Formula Variables

| Code | Subject |
|------|---------|
| Maths / M | Mathematics |
| Physics / P | Physics |
| Chemistry / C | Chemistry |
| Biology / B | Biology |
| Botany / BOT | Botany |
| Zoology / ZOO | Zoology |
| S3-S6 | 3rd to 6th subjects (for Law) |
| theory | Vocational theory subject |
| practical | Vocational practical subject |
| computer tech | Computer Technology (Vocational) |
| LIST_A-F | Best matching subject from list |

---

## Key Rules

1. **Vocational students** use different formulas with theory/practical subjects
2. **Paramedical courses** do NOT accept vocational stream students
3. **BotZoo formula** is only for SCI-14 (Botany+Zoology) group
4. **Law courses** accept ALL groups
5. **LIST_F priority**: Use Biology first; only use Mathematics if Biology not available

See `MAPPING-LOGIC.md` for detailed group eligibility mapping.
