-- Essential categories for the dealership
-- Only creates categories, no fake vehicle data

BEGIN;

-- Categories (including Powerbikes for admin to add real motorcycles)
INSERT INTO categories (name, slug, description)
VALUES
  ('Supercars', 'supercars', 'Ultra-high-performance road cars from the world''s top marques.'),
  ('SUVs', 'suvs', 'Premium SUVs blending space, presence, and performance.'),
  ('Sedans', 'sedans', 'Refined saloons offering comfort and craftsmanship.'),
  ('Performance Cars', 'performance-cars', 'Track-capable and driver-focused models with sport-tuned dynamics.'),
  ('Electric Cars', 'electric-cars', 'Cutting-edge electric vehicles offering range, tech, and instant torque.'),
  ('Powerbikes', 'powerbikes', 'High-performance motorcycles and powerbikes for the ultimate riding experience.')
ON CONFLICT (slug) DO NOTHING;

COMMIT;
