# Database Setup Guide

This guide explains how to set up the Supabase database for the Educaption Cutoff Calculator.

## Prerequisites

- A Supabase account (free tier works)
- Access to Supabase SQL Editor

## Setup Steps

### 1. Create a New Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Name: `educaption-cutoff`
   - Database Password: (save this securely)
   - Region: Choose closest to Tamil Nadu (Mumbai recommended)
4. Wait for the project to be created

### 2. Run the Schema Migration

1. Go to SQL Editor in your Supabase dashboard
2. Open the file `docs/database/schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run" to execute

This will create:
- All required tables (categories, groups, streams, courses, colleges, counselling, admins, audit_logs, site_settings)
- Indexes for performance
- Row Level Security (RLS) policies
- Auto-update triggers for `updated_at` columns

### 3. Seed Initial Data

1. In SQL Editor, click "New Query"
2. Open the file `scripts/seed-data.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run" to execute

This will populate:
- Community categories (OC, BC, MBC, SC, ST, etc.)
- Sample subject groups
- Educational streams with cutoff formulas
- Sample courses
- Initial site settings
- Sample counselling information

### 4. Get API Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key

### 5. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** Never commit `.env` to version control.

## Database Schema Overview

### Tables

| Table | Purpose |
|-------|---------|
| `categories` | Community categories (OC, BC, MBC, SC, ST) |
| `groups` | 12th standard subject groups (106 combinations) |
| `streams` | Educational streams (Engineering, Medical, etc.) |
| `courses` | Courses under each stream |
| `colleges` | College directory |
| `counselling` | Counselling process information |
| `admins` | Admin users (linked to auth.users) |
| `audit_logs` | Admin action audit trail |
| `site_settings` | Configurable site settings |

### Key Relationships

```
streams ─┬─> courses
         └─> counselling

groups ──> streams (via eligible_groups array)

admins ──> audit_logs
```

### Row Level Security (RLS)

- **Public Read Access:** categories, groups, streams, courses, colleges, counselling, site_settings
- **Admin Write Access:** All content tables (requires active admin role)
- **Super Admin Only:** admins table, site_settings write

## Adding the First Admin

Since RLS is enabled, you need to manually add the first admin:

1. First, create a user through Supabase Auth:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter email and password
   - Copy the user's UUID

2. Insert the admin record:
   ```sql
   INSERT INTO admins (id, name, email, role)
   VALUES (
     'user-uuid-here',
     'Admin Name',
     'admin@educaption.org',
     'super_admin'
   );
   ```

## Cutoff Formulas

Formulas are stored in the `streams.formula` column and follow this pattern:

| Stream | Formula | Variables |
|--------|---------|-----------|
| Engineering | `M/2 + P/4 + C/4` | M=Maths, P=Physics, C=Chemistry |
| Medical | `B/2 + P/4 + C/4` | B=Biology, P=Physics, C=Chemistry |
| Agriculture | `M/4 + P/4 + C/4 + B/4` | All four subjects |

The formula is parsed and evaluated in the frontend calculator.

## Backup and Restore

### Backup
```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### Restore
```bash
# Using Supabase CLI
supabase db reset
psql -h db.xxxxx.supabase.co -U postgres -f backup.sql
```

## Troubleshooting

### RLS Policy Errors
If you get "permission denied" errors:
1. Check if the user is logged in
2. Verify admin record exists in admins table
3. Check `is_active` is true for the admin

### Migration Errors
If schema migration fails:
1. Check for existing tables (drop if this is a fresh setup)
2. Ensure UUID extension is enabled
3. Run statements in order (categories before streams, etc.)

### Connection Issues
1. Verify environment variables are correct
2. Check Supabase project is active (not paused)
3. Ensure API keys haven't been regenerated

## Next Steps

After database setup:
1. Add all 106 subject groups via admin panel
2. Import complete course data
3. Add college directory
4. Configure counselling dates for current year
