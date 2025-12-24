-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drive_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
DROP POLICY IF EXISTS "Only admins can insert cars" ON cars;
DROP POLICY IF EXISTS "Only admins can update cars" ON cars;
DROP POLICY IF EXISTS "Only admins can delete cars" ON cars;

DROP POLICY IF EXISTS "Anyone can view car images" ON car_images;
DROP POLICY IF EXISTS "Only admins can insert car images" ON car_images;
DROP POLICY IF EXISTS "Only admins can update car images" ON car_images;
DROP POLICY IF EXISTS "Only admins can delete car images" ON car_images;

DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;

DROP POLICY IF EXISTS "Anyone can create test drive bookings" ON test_drive_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON test_drive_bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON test_drive_bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON test_drive_bookings;

DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can insert site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can delete site settings" ON site_settings;

-- Categories: Public read, admin write
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete categories" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cars: Public read, admin write
CREATE POLICY "Anyone can view available cars" ON cars
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert cars" ON cars
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update cars" ON cars
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete cars" ON cars
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Car images: Public read, admin write
CREATE POLICY "Anyone can view car images" ON car_images
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations on car images" ON car_images
  FOR ALL USING (true) WITH CHECK (true);

-- Admin users: Allow all operations (used by seed scripts)
CREATE POLICY "Allow all operations on admin_users" ON admin_users
  FOR ALL USING (true) WITH CHECK (true);

-- Test drive bookings: Public insert, admin manage
CREATE POLICY "Anyone can create test drive bookings" ON test_drive_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all bookings" ON test_drive_bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update bookings" ON test_drive_bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete bookings" ON test_drive_bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Site settings: Public read, admin write
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Only admins can update site settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Only admins can delete site settings" ON site_settings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );
