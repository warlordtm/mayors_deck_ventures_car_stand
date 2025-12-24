-- Seed an admin user by email. Replace the email value below with the admin's email.
-- Run this in Supabase SQL editor

-- Admin email: mail.incometree@gmail.com
INSERT INTO admin_users (id, email, full_name, role, is_active, created_at)
SELECT id, email, 'Administrator', 'admin', true, NOW()
FROM auth.users
WHERE email = 'mail.incometree@gmail.com'
ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active,
      created_at = COALESCE(admin_users.created_at, EXCLUDED.created_at);

-- Update profiles table to set role to 'admin' for admin users
UPDATE profiles SET role = 'admin' WHERE id IN (
  SELECT id FROM admin_users WHERE email = 'mail.incometree@gmail.com'
);

-- Also manually ensure profile exists and has admin role
INSERT INTO profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'mail.incometree@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Quick check: show the row we just inserted
SELECT * FROM admin_users WHERE email = 'mail.incometree@gmail.com';
SELECT * FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'mail.incometree@gmail.com');
