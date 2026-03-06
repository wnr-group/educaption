# Airtable Setup Guide

This project uses Airtable as the backend database. The client can directly edit data through Airtable's spreadsheet-like interface.

## Quick Setup

### 1. Create Airtable Base

1. Go to [airtable.com](https://airtable.com) and sign in/create account
2. Click "Add a base" → "Start from scratch"
3. Name it **"Educaption Cutoff"**

### 2. Import CSV Data

Import the CSV files from `scripts/airtable-import/` in this order:

| Order | File | Table Name |
|-------|------|------------|
| 1 | `1-admission-bodies.csv` | Admission Bodies |
| 2 | `2-subject-lists.csv` | Subject Lists |
| 3 | `3-categories.csv` | Categories |
| 4 | `4-groups.csv` | Groups |
| 5 | `5-courses.csv` | Courses |

**To import:**
1. In Airtable, click **"+ Add or import"** → **"CSV file"**
2. Upload each CSV
3. Review columns and click **"Import"**

### 3. Set Up Linked Fields (Important!)

After importing, convert text references to linked records:

**In the Courses table:**
1. Click **Admission_Body** column header → "Customize field type"
2. Change to **"Link to another record"** → Select **"Admission Bodies"**
3. Do the same for **Subject_List** → Link to **"Subject Lists"**

### 4. Get API Credentials

**API Key:**
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create new token with scope: `data.records:read`
3. Add access to your "Educaption Cutoff" base
4. Copy the token (starts with `pat`)

**Base ID:**
1. Open your base in Airtable
2. Look at URL: `https://airtable.com/appXXXXXXXX/...`
3. Copy the `appXXXXXXXX` part

### 5. Configure Environment

Create `.env.local` in project root:

```env
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

---

## Table Schema

### Admission Bodies
| Field | Type | Description |
|-------|------|-------------|
| Name | Text | e.g., "TNEA" |
| Name_Tamil | Text | Tamil translation |
| Description | Long Text | What this admission is for |
| Website | URL | Official website |
| Max_Cutoff | Number | Maximum cutoff (200 or 100) |
| Default_Formula | Text | Cutoff formula (e.g., `M + P/2 + C/2`) |

### Subject Lists
| Field | Type | Description |
|-------|------|-------------|
| Name | Text | e.g., "LIST_A" |
| Subjects | Long Text | Comma-separated subjects |

### Categories
| Field | Type | Description |
|-------|------|-------------|
| Code | Text | e.g., "BC", "MBC" |
| Name | Text | Full name |
| Name_Tamil | Text | Tamil translation |

### Groups
| Field | Type | Description |
|-------|------|-------------|
| Code | Text | Group number (1-10+) |
| Name | Text | Subject combination |
| Name_Tamil | Text | Tamil translation |
| Subjects | Long Text | JSON array of subjects |

### Courses
| Field | Type | Description |
|-------|------|-------------|
| Name | Text | Course name |
| Name_Tamil | Text | Tamil translation |
| Admission_Body | Link | Link to Admission Bodies |
| Duration | Text | e.g., "4 years" |
| Eligible_Groups | Text | Comma-separated group codes |
| Formula_Override | Text | Override default formula (optional) |
| Subject_List | Link | Link to Subject Lists (for TNAU) |

---

## Formula Reference

### Correct Tamil Nadu Formulas

| Admission | Formula | Max |
|-----------|---------|-----|
| **TNEA** (Engineering) | `M + P/2 + C/2` | 200 |
| **TNDALU** (Law) | `(S3 + S4 + S5 + S6) / 4` | 100 |
| **TANUVAS - BVSC** | `B + P/2 + C/2` | 200 |
| **TANUVAS - B.Tech** | `B/2 + P/2 + C/2 + M/2` | 200 |
| **TNAU - Agriculture** | `B/2 + P/2 + C/2 + LIST_A/2` | 200 |
| **TNAU - Agri Engineering** | `M + P/2 + C/2` | 200 |
| **TNJFU - Fisheries** | `B + P/2 + C/2` | 200 |
| **Paramedical** | `B + P/2 + C/2` | 200 |

### Formula Variables

| Code | Subject |
|------|---------|
| M | Mathematics |
| P | Physics |
| C | Chemistry |
| B | Biology |
| BOT | Botany |
| ZOO | Zoology |
| CS | Computer Science |
| S3-S6 | 3rd to 6th subjects (for Law) |
| LIST_A-E | Subject from optional list |
| AVG | Average of all subjects |

---

## Managing Data

### Adding a New Course

1. Open **Courses** table in Airtable
2. Add new row
3. Fill in Name, Name_Tamil, Duration
4. Link to appropriate **Admission Body**
5. Set **Eligible_Groups** (comma-separated: "1, 2, 4")
6. If TNAU course, link to appropriate **Subject List**

### Updating a Formula

1. Open **Admission Bodies** table
2. Find the admission (e.g., TNEA)
3. Edit the **Default_Formula** field
4. Changes reflect immediately on the website

### Adding a New Group

1. Open **Groups** table
2. Add new row with Code, Name, Name_Tamil
3. Set **Subjects** as JSON array:
   ```json
   ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Tamil"]
   ```

---

## Troubleshooting

### "Cannot fetch from Airtable"
- Check API key is valid and not expired
- Verify Base ID is correct
- Ensure token has `data.records:read` scope

### Formulas not calculating
- Check formula syntax matches the codes (M, P, C, B, etc.)
- Ensure no typos in formula
- Verify subjects in group match formula variables

### Courses not showing
- Check **Eligible_Groups** matches student's group code
- Verify **Admission_Body** link is set correctly
