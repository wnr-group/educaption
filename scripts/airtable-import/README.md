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

## Formula Reference

| Admission Body | Formula | Max Cutoff |
|----------------|---------|------------|
| TNEA | `M + P/2 + C/2` | 200 |
| TNDALU | `(S3 + S4 + S5 + S6) / 4` | 100 |
| TANUVAS - BVSC | `B + P/2 + C/2` | 200 |
| TANUVAS - B.Tech | `B/2 + P/2 + C/2 + M/2` | 200 |
| TNAU - Agriculture | `B/2 + P/2 + C/2 + LIST_A/2` | 200 |
| TNAU - Agri Engineering | `M + P/2 + C/2` | 200 |
| TNJFU - Fisheries | `B + P/2 + C/2` | 200 |
| TN Paramedical | `B + P/2 + C/2` | 200 |

### Formula Variables

| Code | Subject |
|------|---------|
| M | Mathematics |
| P | Physics |
| C | Chemistry |
| B | Biology |
| BOT | Botany |
| ZOO | Zoology |
| S3-S6 | 3rd to 6th subjects (for Law) |
| LIST_A-E | Optional subject from list |
