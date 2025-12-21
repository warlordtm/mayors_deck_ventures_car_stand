-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
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
   color TEXT,
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

-- Customers table
CREATE TABLE customers (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   email TEXT NOT NULL UNIQUE,
   phone TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW()
 );

-- Inquiries table
CREATE TABLE inquiries (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
   customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
   type TEXT DEFAULT 'inquiry' CHECK (type IN ('test-drive', 'purchase', 'inquiry')),
   status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
   message TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW()
 );

-- Sales table
CREATE TABLE sales (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
   customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
   sale_price DECIMAL(12, 2) NOT NULL,
   payment_method TEXT,
   sale_date DATE DEFAULT CURRENT_DATE,
   created_at TIMESTAMPTZ DEFAULT NOW()
 );

-- Activity logs table
CREATE TABLE activity_logs (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
   action TEXT NOT NULL,
   details JSONB,
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

-- Content blocks table (for managing site content)
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, image_url, seo_title, seo_description, description) VALUES
   ('Supercars', 'supercars', '/category-images/supercars.jpg', 'Supercars - Gaskiya Auto', 'Ultra-high-performance road cars from the world''s top marques.', 'High-performance luxury sports cars'),
   ('Performance Cars', 'performance-cars', '/category-images/performance-cars.jpg', 'Performance Cars - Gaskiya Auto', 'Track-capable and driver-focused models with sport-tuned dynamics.', 'Track-ready performance vehicles'),
   ('Luxury Sedans', 'luxury-sedans', '/category-images/luxury-sedans.jpg', 'Luxury Sedans - Gaskiya Auto', 'Refined executive saloons with best-in-class comfort and craftsmanship.', 'Premium luxury sedans'),
   ('SUVs & Crossovers', 'suvs', '/category-images/suvs.jpg', 'SUVs & Crossovers - Gaskiya Auto', 'Premium SUVs blending space, presence, and performance.', 'Luxury sport utility vehicles'),
   ('Electric Cars', 'electric-cars', '/category-images/electric-cars.jpg', 'Electric Cars - Gaskiya Auto', 'Cutting-edge electric vehicles offering range, tech, and instant torque.', 'Luxury electric vehicles'),
   ('Convertibles & Coupes', 'coupes-convertibles', '/category-images/coupes-convertibles.jpg', 'Convertibles & Coupes - Gaskiya Auto', 'Designer two-doors for dramatic styling and spirited driving.', 'Designer two-doors for dramatic styling and spirited driving'),
   ('Classic & Collector', 'classic-cars', '/category-images/classic-cars.jpg', 'Classic & Collector - Gaskiya Auto', 'Iconic and collectible cars maintained to exacting standards.', 'Iconic and collectible cars maintained to exacting standards');

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '+1234567890'),
  ('contact_phone', '+1234567890'),
  ('contact_email', 'contact@luxurycars.com'),
  ('test_drive_fee', '99.99'),
  ('brand_name', 'Gaskiya Auto'),
  ('brand_tagline', 'Where Luxury Meets Performance');

-- Create indexes for better performance
CREATE INDEX idx_cars_category ON cars(category_id);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_featured ON cars(is_featured);
CREATE INDEX idx_car_images_car_id ON car_images(car_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_inquiries_car_id ON inquiries(car_id);
CREATE INDEX idx_inquiries_customer_id ON inquiries(customer_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_sales_car_id ON sales(car_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_activity_logs_admin_id ON activity_logs(admin_id);
CREATE INDEX idx_test_drive_bookings_car_id ON test_drive_bookings(car_id);
CREATE INDEX idx_test_drive_bookings_status ON test_drive_bookings(status);
