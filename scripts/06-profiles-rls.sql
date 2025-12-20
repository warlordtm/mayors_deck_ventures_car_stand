-- Row Level Security for profiles table
-- Run this after `scripts/05-create-profiles.sql` has been applied.

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own profile
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile (only for their uid)
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins: allow full access via a role check (assumes admin_users table where id references auth.users.id)
-- If you prefer to avoid role check here, manage admin access at the API level.
CREATE POLICY "admin_full_access" ON profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'
    )
  );

-- Notes:
-- 1) auth.uid() works in Supabase Postgres functions (set up via Postgres auth helpers). If your DB does not have auth.uid(), use current_setting('request.jwt.claims.sub') or adjust accordingly.
-- 2) Run this SQL in your Supabase SQL editor or via psql connected to the DB.
