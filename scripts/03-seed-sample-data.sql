-- Sample seed data for local development
-- Inserts categories, a few cars, and car images used by the development fallback

BEGIN;

-- Categories
INSERT INTO categories (id, name, slug, description, created_at)
VALUES
  ('sample-supercars', 'Supercars', 'supercars', 'Ultra-high-performance road cars from the world\'s top marques.', now()),
  ('sample-performance', 'Performance Cars', 'performance-cars', 'Track-capable and driver-focused models with sport-tuned dynamics.', now()),
  ('sample-luxury', 'Luxury Sedans', 'luxury-sedans', 'Refined executive saloons with best-in-class comfort and craftsmanship.', now())
ON CONFLICT (id) DO NOTHING;

-- Cars (linked to sample categories)
INSERT INTO cars (id, name, model, year, category_id, brand, price, show_price, description, status, is_featured, created_at, updated_at)
VALUES
  ('sample-car-1', 'Ferrari Roma', 'Roma', 2022, 'sample-supercars', 'Ferrari', 245000, true, 'Sample Ferrari Roma for development', 'available', true, now(), now()),
  ('sample-car-2', 'Lamborghini Huracan', 'Huracan', 2022, 'sample-supercars', 'Lamborghini', 310000, true, 'Sample Lamborghini Huracan for development', 'available', false, now(), now()),
  ('sample-car-3', 'Mercedes AMG GT', 'AMG GT', 2023, 'sample-performance', 'Mercedes', 165000, true, 'Sample Mercedes AMG GT for development', 'available', false, now(), now()),
  ('sample-car-4', 'Rolls-Royce Phantom', 'Phantom', 2020, 'sample-luxury', 'Rolls-Royce', 450000, true, 'Sample Rolls-Royce Phantom for development', 'available', false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Car images
INSERT INTO car_images (id, car_id, image_url, is_primary, display_order, created_at)
VALUES
  ('img-s1-1', 'sample-car-1', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=60', true, 0, now()),
  ('img-s2-1', 'sample-car-2', 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=60', true, 0, now()),
  ('img-s3-1', 'sample-car-3', 'https://images.unsplash.com/photo-1549921296-3a4e6d0f3f6b?auto=format&fit=crop&w=1400&q=60', true, 0, now()),
  ('img-s4-1', 'sample-car-4', 'https://images.unsplash.com/photo-1541446654331-6f4d3b7e4c6a?auto=format&fit=crop&w=1400&q=60', true, 0, now())
ON CONFLICT (id) DO NOTHING;

COMMIT;
