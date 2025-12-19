-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cars table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  price DECIMAL(12, 2),
  show_price BOOLEAN DEFAULT true,
  description TEXT,
  engine TEXT,
  mileage TEXT,
  transmission TEXT,
  fuel_type TEXT,
  interior_features TEXT,
  exterior_features TEXT,
  condition TEXT,
  warranty TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Car images table
CREATE TABLE car_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (extends Supabase auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'agent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test drive bookings table
CREATE TABLE test_drive_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  assigned_agent_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_amount DECIMAL(10, 2),
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table (for WhatsApp, contact info, etc.)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Supercars', 'supercars', 'High-performance luxury sports cars'),
  ('SUVs', 'suvs', 'Luxury sport utility vehicles'),
  ('Sedans', 'sedans', 'Premium luxury sedans'),
  ('Performance Cars', 'performance-cars', 'Track-ready performance vehicles'),
  ('Electric Cars', 'electric-cars', 'Luxury electric vehicles');

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '+1234567890'),
  ('contact_phone', '+1234567890'),
  ('contact_email', 'contact@luxurycars.com'),
  ('test_drive_fee', '99.99'),
  ('brand_name', 'Elite Motors'),
  ('brand_tagline', 'Where Luxury Meets Performance');

-- Create indexes for better performance
CREATE INDEX idx_cars_category ON cars(category_id);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_featured ON cars(is_featured);
CREATE INDEX idx_car_images_car_id ON car_images(car_id);
CREATE INDEX idx_test_drive_bookings_car_id ON test_drive_bookings(car_id);
CREATE INDEX idx_test_drive_bookings_status ON test_drive_bookings(status);
