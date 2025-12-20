-- Profiles table for customers
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  nin TEXT,
  nin_status TEXT DEFAULT 'unverified' CHECK (nin_status IN ('unverified','pending','verified','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_nin_status ON profiles(nin_status);
