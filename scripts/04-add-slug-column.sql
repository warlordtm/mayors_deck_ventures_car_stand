-- Add a slug column for cars (human-friendly URLs) and an index
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS slug text;

-- Create a unique index on slug to enforce uniqueness when present
CREATE UNIQUE INDEX IF NOT EXISTS idx_cars_slug_unique ON cars ((lower(slug))) WHERE slug IS NOT NULL;

-- Optional: populate slug for existing rows using name (developer can adjust)
-- WARNING: This simple slugifier may need adjustments for collisions or special characters.
-- Uncomment and review before running in production.
--
-- UPDATE cars
-- SET slug = regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g')
-- WHERE slug IS NULL;

-- Note: Run this migration against your database and update any seed scripts to insert slugs for new sample data.
