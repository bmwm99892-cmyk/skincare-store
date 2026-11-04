USE skincare_store;

INSERT INTO categories (name, slug, description)
VALUES
  ('Face Care', 'face-care', 'Everyday essentials for a simple face-care routine.'),
  ('Cleansers', 'cleansers', 'Gentle cleansers for the start of your routine.'),
  ('Moisturizers', 'moisturizers', 'Comforting creams and moisturizers for daily use.'),
  ('Serums', 'serums', 'Lightweight serum options for a considered routine.')
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO products
  (category_id, name, slug, description, price, image_url, stock_quantity)
VALUES
  ((SELECT id FROM categories WHERE slug = 'cleansers'),
   'Rosewater Daily Cleanser', 'rosewater-daily-cleanser',
   'A gentle daily cleanser with a light, fresh feel. Rinse clean and follow with the next step in your routine.',
   1850.00, 'https://images.pexels.com/photos/15854292/pexels-photo-15854292.jpeg?auto=compress&cs=tinysrgb&w=900', 24),
  ((SELECT id FROM categories WHERE slug = 'moisturizers'),
   'Cloud Soft Face Cream', 'cloud-soft-face-cream',
   'A soft, comforting face cream for everyday use. Apply a small amount to clean skin as part of your routine.',
   2450.00, 'https://images.pexels.com/photos/7797121/pexels-photo-7797121.jpeg?auto=compress&cs=tinysrgb&w=900', 32),
  ((SELECT id FROM categories WHERE slug = 'serums'),
   'Dew Drops Face Serum', 'dew-drops-face-serum',
   'A lightweight serum with a smooth texture that layers easily with a daily moisturizer.',
   2850.00, 'https://images.pexels.com/photos/8148742/pexels-photo-8148742.jpeg?auto=compress&cs=tinysrgb&w=900', 20),
  ((SELECT id FROM categories WHERE slug = 'face-care'),
   'Petal Glow Face Oil', 'petal-glow-face-oil',
   'A small-batch style face oil for a simple evening ritual. Use a few drops and adjust to your preference.',
   2250.00, 'https://images.pexels.com/photos/6738804/pexels-photo-6738804.jpeg?auto=compress&cs=tinysrgb&w=900', 22),
  ((SELECT id FROM categories WHERE slug = 'cleansers'),
   'Gentle Milk Cleanser', 'gentle-milk-cleanser',
   'A creamy-feel cleanser designed for a comfortable daily cleanse. Massage onto damp skin and rinse well.',
   1650.00, 'https://images.pexels.com/photos/6847858/pexels-photo-6847858.jpeg?auto=compress&cs=tinysrgb&w=900', 18),
  ((SELECT id FROM categories WHERE slug = 'moisturizers'),
   'Everyday Comfort Moisturizer', 'everyday-comfort-moisturizer',
   'An easy-to-layer moisturizer for morning or evening use, with a smooth finish for everyday routines.',
   2650.00, 'https://images.pexels.com/photos/8066773/pexels-photo-8066773.jpeg?auto=compress&cs=tinysrgb&w=900', 14),
  ((SELECT id FROM categories WHERE slug = 'serums'),
   'Soft Focus Hydrating Serum', 'soft-focus-hydrating-serum',
   'A lightweight serum that fits neatly between cleansing and moisturizing in a simple routine.',
   3100.00, 'https://images.pexels.com/photos/10819535/pexels-photo-10819535.jpeg?auto=compress&cs=tinysrgb&w=900', 16),
  ((SELECT id FROM categories WHERE slug = 'face-care'),
   'The Simple Face Ritual', 'the-simple-face-ritual',
   'A curated face-care set with everyday steps for a straightforward morning or evening ritual.',
   3950.00, 'https://images.pexels.com/photos/8989957/pexels-photo-8989957.jpeg?auto=compress&cs=tinysrgb&w=900', 10)
ON DUPLICATE KEY UPDATE slug = slug;
