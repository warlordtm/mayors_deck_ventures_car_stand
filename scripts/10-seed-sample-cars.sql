-- Seed sample cars for testing
INSERT INTO cars (name, model, year, category_id, brand, price, show_price, description, engine, mileage, transmission, fuel_type, interior_features, exterior_features, condition, warranty, location, status, is_featured) VALUES
  ('Ferrari Roma', 'Roma', 2022, (SELECT id FROM categories WHERE slug = 'supercars' LIMIT 1), 'Ferrari', 392000000, true, 'The Ferrari Roma is a grand tourer produced by Ferrari. It is a two-door 2+2 hard top coupe based on the Ferrari Portofino.', '3.9L V8 Twin-Turbo', '5,000 km', 'Automatic', 'Petrol', 'Leather seats, Premium audio, Climate control', 'Carbon fiber trim, LED headlights, Alloy wheels', 'Excellent', '2 years', 'Lagos', 'available', true),
  ('Aston Martin DB11', 'DB11', 2021, (SELECT id FROM categories WHERE slug = 'luxury-sedans' LIMIT 1), 'Aston Martin', 316800000, true, 'The Aston Martin DB11 is a grand tourer produced by British manufacturer Aston Martin.', '4.0L V8 Twin-Turbo', '8,000 km', 'Automatic', 'Petrol', 'Leather upholstery, Navigation, Premium sound', 'Carbon fiber accents, LED matrix lights, 20" wheels', 'Excellent', '3 years', 'Abuja', 'available', true),
  ('Mercedes AMG GT', 'GT', 2023, (SELECT id FROM categories WHERE slug = 'performance-cars' LIMIT 1), 'Mercedes-Benz', 264000000, true, 'The Mercedes-AMG GT is a series of grand tourer cars produced by Mercedes-AMG.', '4.0L V8 Biturbo', '2,000 km', 'Automatic', 'Petrol', 'Nappa leather, Burmester sound, Ambient lighting', 'AMG styling, Carbon fiber elements, Performance tires', 'Excellent', '4 years', 'Kano', 'available', true),
  ('Lamborghini Huracan', 'Huracan', 2022, (SELECT id FROM categories WHERE slug = 'supercars' LIMIT 1), 'Lamborghini', 496000000, true, 'The Lamborghini Huracán is a sports car manufactured by Italian automotive manufacturer Lamborghini.', '5.2L V10', '3,000 km', 'Automatic', 'Petrol', 'Alcantara upholstery, Carbon fiber trim, Sport seats', 'Carbon fiber body, LED lights, 20" alloys', 'Excellent', '2 years', 'Lagos', 'available', true),
  ('Porsche 911 Carrera', '911 Carrera', 2023, (SELECT id FROM categories WHERE slug = 'performance-cars' LIMIT 1), 'Porsche', 296000000, true, 'The Porsche 911 is a two-door, two-seater sports car made by Porsche AG.', '3.0L Flat-6 Turbo', '1,000 km', 'Automatic', 'Petrol', 'Leather interior, Bose audio, Digital cockpit', 'Sport design, LED matrix, 21" wheels', 'Excellent', '3 years', 'Abuja', 'available', true),
  ('Rolls-Royce Phantom', 'Phantom', 2020, (SELECT id FROM categories WHERE slug = 'luxury-sedans' LIMIT 1), 'Rolls-Royce', 720000000, true, 'The Rolls-Royce Phantom is a full-sized luxury saloon car made by Rolls-Royce Motor Cars.', '6.75L V12', '10,000 km', 'Automatic', 'Petrol', 'Starlight headliner, Premium leather, Rear entertainment', 'Spirit of Ecstasy, LED lighting, Chrome accents', 'Excellent', '5 years', 'Lagos', 'available', true)
ON CONFLICT DO NOTHING;

-- Add sample images for the cars
INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES
  ((SELECT id FROM cars WHERE name = 'Ferrari Roma' LIMIT 1), '/car-images/ferrari-roma.jpg', true, 1),
  ((SELECT id FROM cars WHERE name = 'Aston Martin DB11' LIMIT 1), '/car-images/aston-martin-db11.jpg', true, 1),
  ((SELECT id FROM cars WHERE name = 'Mercedes AMG GT' LIMIT 1), '/car-images/mercedes-amg-gt.jpg', true, 1),
  ((SELECT id FROM cars WHERE name = 'Lamborghini Huracan' LIMIT 1), '/car-images/lamborghini-huracan.jpg', true, 1),
  ((SELECT id FROM cars WHERE name = 'Porsche 911 Carrera' LIMIT 1), '/car-images/porsche-911-carrera.jpg', true, 1),
  ((SELECT id FROM cars WHERE name = 'Rolls-Royce Phantom' LIMIT 1), '/car-images/rolls-royce-phantom.jpg', true, 1);

  