const photo = (id, width = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const products = [
  { id: 'rosewater-cleanser', name: 'Rosewater Daily Cleanser', category: 'Cleansers', price: 1850, rating: 4.8, image: photo(15854292) },
  { id: 'cloud-cream', name: 'Cloud Soft Face Cream', category: 'Moisturizers', price: 2450, rating: 4.9, image: photo(7797121) },
  { id: 'dew-drops-serum', name: 'Dew Drops Face Serum', category: 'Serums', price: 2850, rating: 4.7, image: photo(8148742) },
  { id: 'daily-face-oil', name: 'Petal Glow Face Oil', category: 'Face Care', price: 2250, rating: 4.8, image: photo(6738804) },
  { id: 'gentle-cleanse', name: 'Gentle Milk Cleanser', category: 'Cleansers', price: 1650, rating: 4.6, image: photo(15854292) },
  { id: 'comfort-moisture', name: 'Everyday Comfort Moisturizer', category: 'Moisturizers', price: 2650, rating: 4.9, image: photo(7797121) },
  { id: 'soft-focus-serum', name: 'Soft Focus Hydrating Serum', category: 'Serums', price: 3100, rating: 4.8, image: photo(8148742) },
  { id: 'ritual-face-set', name: 'The Simple Face Ritual', category: 'Face Care', price: 3950, rating: 4.9, image: photo(8989957) },
];

export const formatPrice = (price) => `PKR ${new Intl.NumberFormat('en-PK').format(price)}`;

