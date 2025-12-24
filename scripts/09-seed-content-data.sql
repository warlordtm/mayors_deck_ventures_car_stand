-- Seed initial content blocks
INSERT INTO content_blocks (key, title, content, image_url, display_order, is_active) VALUES
  ('hero', 'Majestic Collection', 'Driving Excellence. Defining Prestige.', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Ftcnl8ZW58MHx8MHx8fDA%3D', 1, true),
  ('trust_pillar_1', 'Verified Vehicles', 'Comprehensive inspection and certification for every car in our collection.', NULL, 1, true),
  ('trust_pillar_2', 'Trusted Dealers', 'Long-standing relationships with factory-trained dealers and partners.', NULL, 2, true),
  ('trust_pillar_3', 'Transparent Pricing', 'Clear, upfront pricing — no hidden fees, straightforward offers.', NULL, 3, true),
  ('trust_pillar_4', 'Premium Experience', 'White-glove service from inquiry to delivery.', NULL, 4, true)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- Update site settings with additional fields
INSERT INTO site_settings (key, value) VALUES
  ('brand_name', 'Gaskiya Auto'),
  ('brand_tagline', 'Luxury. Confidence. Trust.'),
  ('contact_phone', '+234 814 449 3084'),
  ('contact_email', 'contact.gaskiyaautos@gmail.com'),
  ('whatsapp_number', '+234 814 449 3084')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;