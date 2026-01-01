-- Seed initial content blocks for the website
INSERT INTO content_blocks (key, title, content, image_url, display_order, is_active) VALUES
  ('hero', 'Premium Collection', 'Experience luxury redefined. Discover our exclusive collection of premium and supercars.', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Ftcnl8ZW58MHx8MHx8fDA%3D', 1, true),
  ('trust_title', 'Why Coja Motors?', NULL, NULL, 0, true),
  ('trust_verified_vehicles', 'Verified Vehicles', 'Comprehensive inspection and certification for every car in our collection.', NULL, 1, true),
  ('trust_trusted_dealers', 'Trusted Dealers', 'Long-standing relationships with factory-trained dealers and partners.', NULL, 2, true),
  ('trust_transparent_pricing', 'Transparent Pricing', 'Clear, upfront pricing — no hidden fees, straightforward offers.', NULL, 3, true),
  ('trust_premium_experience', 'Premium Experience', 'White-glove service from inquiry to delivery.', NULL, 4, true),
  ('about_title', 'About Gaskiya Auto', 'Nigeria''s premier luxury automobile marketplace, connecting discerning buyers with the world''s most prestigious vehicles.', NULL, 1, true),
  ('about_content', 'About Our Story', 'With over a decade of experience in the luxury automotive market, Gaskiya Auto has established itself as the trusted source for premium vehicles in Nigeria. Our commitment to excellence, transparency, and customer satisfaction sets us apart in the industry.', NULL, 2, true),
  ('contact_title', 'Get In Touch', 'Ready to find your dream car? Contact our expert team today.', NULL, 1, true),
  ('contact_subtitle', 'Contact Support', 'We''re here to help you every step of the way', NULL, 2, true)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;