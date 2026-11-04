import ProductCard from './ProductCard.jsx';

export default function ProductSection({
  products,
  productsLoading = false,
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onNavigate,
  showFilters = true,
  title = 'A little something for',
  accent = 'your skin.',
  description = 'Lovely essentials to make your daily routine feel like yours.',
}) {
  const filters = ['All', ...categories.map(c => c.name)];

  return (
    <section className="section product-section" id="shop" aria-labelledby="shop-title">
      <div className="section-heading product-heading">
        <div>
          <p className="eyebrow">{showFilters ? 'Curated Favourites' : 'A Considered Edit'}</p>
          <h2 id="shop-title">
            {title} <em>{accent}</em>
          </h2>
        </div>
        <div className="product-heading-aside">
          <p>{description}</p>
          {!showFilters && (
            <a
              className="text-link"
              href="/shop"
              onClick={(e) => { e.preventDefault(); onNavigate('/shop'); }}
            >
              VIEW THE WHOLE EDIT <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Filter chips bar */}
      {showFilters && (
        <div className="product-filters" aria-label="Filter products by category">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeCategory === filter ? 'filter-chip is-selected' : 'filter-chip'}
              aria-pressed={activeCategory === filter}
              onClick={() => onSelectCategory(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid / Skeleton */}
      {productsLoading ? (
        <div className="product-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="product-skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line short" />
                <div className="skeleton-line title" />
                <div className="skeleton-line price" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="empty-products">
          <span aria-hidden="true" style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>🌸</span>
          <h3>No favourites found in this category.</h3>
          <p>Try selecting another collection or browse all of our skincare staples.</p>
          <button className="button button-outline" type="button" onClick={() => onSelectCategory('All')}>
            Show all products
          </button>
        </div>
      )}

      {!productsLoading && products.length > 0 && (
        <p className="sample-note">
          Prices in PKR · Fast shipping across Pakistan · Cash on Delivery available
        </p>
      )}
    </section>
  );
}
