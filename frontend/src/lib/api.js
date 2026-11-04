// Central API base URL – change once here if port changes
export const API_BASE = 'http://localhost:5000/api';

/**
 * Format price in PKR
 */
export const formatPrice = (price) =>
  `PKR ${new Intl.NumberFormat('en-PK').format(price)}`;

/**
 * Normalise a DB product row so it is compatible with the
 * existing ProductCard / QuickView components.
 *
 * DB row shape:
 *   { id, name, slug, description, price, image_url,
 *     stock_quantity, is_active, category, category_slug }
 */
export function normaliseProduct(p) {
  return {
    id:           p.slug || p.id,          // keep slug as id for URL compat
    dbId:         p.id,
    name:         p.name,
    category:     p.category || 'General',
    price:        Number(p.price),
    image:        p.image_url || null,
    description:  p.description || '',
    stock:        p.stock_quantity ?? 0,
    // ProductCard reads .rating – show nothing if no rating in DB
    rating:       p.rating ?? null,
    slug:         p.slug,
  };
}

