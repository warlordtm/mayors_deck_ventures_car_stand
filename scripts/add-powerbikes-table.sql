-- Add powerbikes table
CREATE TABLE powerbikes (
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

-- Powerbike images table
CREATE TABLE powerbike_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  powerbike_id UUID REFERENCES powerbikes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for powerbikes
ALTER TABLE powerbikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE powerbike_images ENABLE ROW LEVEL SECURITY;

-- Policies for powerbikes
CREATE POLICY "Public read access for powerbikes" ON powerbikes
  FOR SELECT USING (true);

CREATE POLICY "Admin full access for powerbikes" ON powerbikes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policies for powerbike_images
CREATE POLICY "Public read access for powerbike_images" ON powerbike_images
  FOR SELECT USING (true);

CREATE POLICY "Admin full access for powerbike_images" ON powerbike_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add slug column to powerbikes
ALTER TABLE powerbikes ADD COLUMN slug TEXT;

-- Add unique constraint on slug
ALTER TABLE powerbikes ADD CONSTRAINT powerbikes_slug_unique UNIQUE (slug);

-- Create index on slug
CREATE INDEX idx_powerbikes_slug ON powerbikes(slug);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_powerbikes_updated_at
  BEFORE UPDATE ON powerbikes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();