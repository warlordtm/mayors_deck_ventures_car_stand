-- Add video_url column to cars table
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Optional: Add comment for documentation
COMMENT ON COLUMN cars.video_url IS 'URL to video showcasing the car';