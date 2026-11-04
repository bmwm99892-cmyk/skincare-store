import ProductArtwork from './ProductArtwork.jsx';
import PhotoImage from './PhotoImage.jsx';

// Fallback images for categories when no image in DB
const FALLBACK_IMAGES = {
  // 'Face Care':    'https://images.pexels.com/photos/8989957/pexels-photo-8989957.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Cleansers': 'https://images.pexels.com/photos/15854292/pexels-photo-15854292.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Moisturizers': 'https://images.pexels.com/photos/7797121/pexels-photo-7797121.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Serums': 'https://images.pexels.com/photos/8148742/pexels-photo-8148742.jpeg?auto=compress&cs=tinysrgb&w=900',
};

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/8989957/pexels-photo-8989957.jpeg?auto=compress&cs=tinysrgb&w=900';

export default function CategorySection({ onSelectCategory, categories = [] }) {
  // If DB has categories use them, otherwise show skeleton / nothing
  const items = categories.length > 0 ? categories : [];

  return (
    <section className="section category-section" id="categories" aria-labelledby="category-title">
      <div className="section-heading centered-heading">
        <p className="eyebrow">A routine for every day</p>
        <h2 id="category-title">Find your feel-good <em>favourite.</em></h2>
        <p>Small rituals that fit beautifully into your day.</p>
      </div>

      {items.length === 0 ? (
        /* Loading skeleton */
        <div className="category-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: '#f8dde5', borderRadius: 8, overflow: 'hidden', animation: 'pulse 1.4s ease-in-out infinite' }}>
              <div style={{ height: 260, background: '#f0d5dc' }} />
              <div style={{ padding: '14px 2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ height: 14, background: '#e8c8d0', borderRadius: 4, width: 100, marginBottom: 6 }} />
                  <div style={{ height: 9, background: '#e8c8d0', borderRadius: 4, width: 140 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="category-grid">
          {items.map((category, index) => {
            const imgSrc = category.image_url || FALLBACK_IMAGES[category.name] || DEFAULT_IMAGE;
            return (
              <button
                type="button"
                className="category-card"
                key={category.id || category.name}
                onClick={() => onSelectCategory(category.name)}
              >
                <span className="category-image-wrap">
                  <PhotoImage
                    src={imgSrc}
                    alt={`${category.name} skincare ritual`}
                    fallback={
                      <ProductArtwork
                        product={{ id: `cat-${category.slug}`, name: `${category.name} skincare`, category: category.name }}
                      />
                    }
                  />
                  <span className="category-index">0{index + 1}</span>
                </span>
                <span className="category-meta">
                  <span>
                    <strong>{category.name}</strong>
                    <small>
                      {category.description || 'Explore the collection'}
                      {category.product_count > 0 && ` · ${category.product_count} items`}
                    </small>
                  </span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
