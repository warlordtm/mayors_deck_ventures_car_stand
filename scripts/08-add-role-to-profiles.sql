-- Add role field to profiles table for RBAC
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- Add car-related fields
ALTER TABLE profiles ADD COLUMN driver_license TEXT;
ALTER TABLE profiles ADD COLUMN preferred_car_type TEXT;

-- Update existing admin users to have 'admin' role
UPDATE profiles SET role = 'admin' WHERE id IN (SELECT id FROM admin_users WHERE role = 'admin');

-- Create index for role
CREATE INDEX idx_profiles_role ON profiles(role);