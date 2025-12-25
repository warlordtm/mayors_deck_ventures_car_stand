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
   brand TEXT,
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
   video_url TEXT,
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
    type TEXT DEFAULT 'inquiry' CHECK (type IN ('purchase', 'inquiry')),
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

-- User favorites/watchlist table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, car_id)
  );

-- Car impressions table (for analytics)
CREATE TABLE car_impressions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_source TEXT, -- 'listing', 'detail', 'search', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Insert default categories (brands)
DELETE FROM categories;
INSERT INTO categories (name, slug, image_url, seo_title, seo_description, description) VALUES
   ('Toyota', 'toyota', '/category-images/toyota.jpg', 'Toyota - Gaskiya Auto', 'Reliable and efficient Toyota vehicles for everyday driving.', 'Trusted Toyota brand vehicles'),
   ('Mercedes-Benz', 'mercedes-benz', '/category-images/mercedes.jpg', 'Mercedes-Benz - Gaskiya Auto', 'Luxury Mercedes-Benz vehicles with premium features.', 'German engineering excellence'),
   ('Hyundai', 'hyundai', '/category-images/hyundai.jpg', 'Hyundai - Gaskiya Auto', 'Modern Hyundai vehicles with advanced technology.', 'Innovative Korean automotive brand'),
   ('Honda', 'honda', '/category-images/honda.jpg', 'Honda - Gaskiya Auto', 'Dependable Honda vehicles known for reliability.', 'Japanese quality and performance'),
   ('Ford', 'ford', '/category-images/ford.jpg', 'Ford - Gaskiya Auto', 'American-made Ford vehicles for every need.', 'Iconic American automotive brand'),
   ('BMW', 'bmw', '/category-images/bmw.jpg', 'BMW - Gaskiya Auto', 'Performance-oriented BMW vehicles with sporty design.', 'Bavarian Motor Works excellence'),
   ('Audi', 'audi', '/category-images/audi.jpg', 'Audi - Gaskiya Auto', 'Premium Audi vehicles with quattro technology.', 'German luxury and innovation'),
   ('Nissan', 'nissan', '/category-images/nissan.jpg', 'Nissan - Gaskiya Auto', 'Versatile Nissan vehicles for modern lifestyles.', 'Japanese innovation and reliability'),
   ('Volkswagen', 'volkswagen', '/category-images/volkswagen.jpg', 'Volkswagen - Gaskiya Auto', 'Quality Volkswagen vehicles for families.', 'German engineering for everyone'),
   ('Kia', 'kia', '/category-images/kia.jpg', 'Kia - Gaskiya Auto', 'Stylish Kia vehicles with modern features.', 'Korean design and value'),
   ('Ferrari', 'ferrari', '/category-images/ferrari.jpg', 'Ferrari - Gaskiya Auto', 'Exotic Ferrari supercars and sports cars.', 'Italian performance excellence'),
   ('Aston Martin', 'aston-martin', '/category-images/aston-martin.jpg', 'Aston Martin - Gaskiya Auto', 'British luxury and performance vehicles.', 'Iconic British automotive heritage'),
   ('Lamborghini', 'lamborghini', '/category-images/lamborghini.jpg', 'Lamborghini - Gaskiya Auto', 'Extreme performance Lamborghini supercars.', 'Italian supercar mastery'),
   ('Porsche', 'porsche', '/category-images/porsche.jpg', 'Porsche - Gaskiya Auto', 'Precision-engineered Porsche sports cars.', 'German sports car innovation'),
   ('Rolls-Royce', 'rolls-royce', '/category-images/rolls-royce.jpg', 'Rolls-Royce - Gaskiya Auto', 'Ultimate luxury Rolls-Royce motor cars.', 'British luxury automotive excellence');

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '+1234567890'),
  ('contact_phone', '+1234567890'),
  ('contact_email', 'contact@luxurycars.com'),
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
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_car_id ON user_favorites(car_id);
CREATE INDEX idx_car_impressions_car_id ON car_impressions(car_id);
CREATE INDEX idx_car_impressions_created_at ON car_impressions(created_at);
