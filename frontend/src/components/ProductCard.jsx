import { formatPrice } from '../lib/api.js';
import ProductArtwork from './ProductArtwork.jsx';
import PhotoImage from './PhotoImage.jsx';

export default function ProductCard({ product, isWishlisted, onAddToCart, onToggleWishlist, onQuickView }) {
  const isOutOfStock = product.stock != null && product.stock === 0;

  const handleCardClick = (e) => {
    // If user clicked wishlist or add-to-bag, don't trigger quick view
    if (e.target.closest('.wishlist-button') || e.target.closest('.add-button')) {
      return;
    }
    onQuickView(product);
  };

  return (
    <article
      className="product-card clickable-card"
      onClick={handleCardClick}
      title="Click to view details"
    >
      <div className="product-image-wrap">
        <PhotoImage
          className="product-image"
          src={product.image}
          alt={`${product.name} skincare product`}
          fallback={<ProductArtwork className="product-image" product={product} />}
        />
        <span className="product-tag">NUDU EDIT</span>
        <span className="quick-view-cue">CLICK FOR DETAILS ↗</span>

        <button
          className={isWishlisted ? 'wishlist-button is-active' : 'wishlist-button'}
          type="button"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          title={isWishlisted ? 'In your wishlist' : 'Add to wishlist'}
        >
          <span aria-hidden="true">{isWishlisted ? '♥' : '♡'}</span>
        </button>
      </div>

      <div className="product-details">
        <div className="product-meta">
          <span className="product-cat-pill">{product.category}</span>
          {product.rating != null && (
            <span className="product-rating">
              <span aria-hidden="true" style={{ color: '#f59e0b' }}>★</span> {Number(product.rating).toFixed(1)}
            </span>
          )}
          {isOutOfStock && (
            <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em' }}>
              Sold out
            </span>
          )}
        </div>

        <h3>
          <button
            className="product-title-trigger"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            {product.name}
          </button>
        </h3>

        <div className="product-buy-row">
          <div className="product-price-tag">
            <span className="price-val">{formatPrice(product.price)}</span>
          </div>

          <button
            type="button"
            className="add-button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart({ ...product, priceLabel: formatPrice(product.price) });
            }}
          >
            {isOutOfStock ? (
              'Sold out'
            ) : (
              <>
                <span>Add to bag</span> <span className="add-plus" aria-hidden="true">+</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
