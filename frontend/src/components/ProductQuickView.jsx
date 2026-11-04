import { useState, useEffect } from 'react';
import { formatPrice } from '../lib/api.js';
import ProductArtwork from './ProductArtwork.jsx';
import PhotoImage from './PhotoImage.jsx';

export default function ProductQuickView({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const closeOnEscape = (e) => { if (e.key === 'Escape') onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  if (!product) return null;

  const isOutOfStock = product.stock != null && product.stock === 0;
  const totalPrice = product.price * qty;

  const handleAddMultiple = () => {
    for (let i = 0; i < qty; i++) {
      onAddToCart({ ...product, priceLabel: formatPrice(product.price) });
    }
    onClose();
  };

  return (
    <div
      className="quick-view-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(23, 11, 17, 0.72)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <div
        className="quick-view-modal-content"
        style={{
          position: 'relative', width: 'min(940px, 100%)',
          maxHeight: 'min(860px, calc(100vh - 32px))',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
          background: '#ffffff', borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 30px 90px -15px rgba(24, 11, 18, 0.4)',
          border: '1px solid #f0e2e6',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ebdce1',
            display: 'grid', placeItems: 'center', fontSize: 20, color: '#292329',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ×
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="qv-image-side" style={{ position: 'relative', background: '#fcf1f4', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <PhotoImage
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={product.image}
            alt={product.name}
            fallback={<ProductArtwork product={product} />}
          />
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)',
            padding: '6px 14px', borderRadius: 20, fontSize: 10, fontWeight: 700,
            color: '#b95275', border: '1px solid rgba(255,255,255,0.8)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ NUDU BOTANICAL EDIT
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div className="qv-details-side" style={{
          padding: '36px 36px 32px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            {/* Category & Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{
                background: '#fdf2f5', color: '#b95275', padding: '4px 12px',
                borderRadius: 20, fontSize: 11, fontWeight: 700, border: '1px solid #f8dde5',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {product.category}
              </span>

              <span style={{
                fontSize: 12, fontWeight: 700,
                color: isOutOfStock ? '#ef4444' : '#10b981',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOutOfStock ? '#ef4444' : '#10b981' }} />
                {isOutOfStock ? 'Out of Stock' : 'In Stock · Ready to Dispatch'}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="qv-title" style={{
              margin: '0 0 10px', fontSize: 24, fontWeight: 500, color: '#292329',
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.25,
            }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <span style={{ color: '#f59e0b', fontSize: 15 }}>★★★★★</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#292329' }}>
                {product.rating != null ? Number(product.rating).toFixed(1) : '4.9'}
              </span>
              <span style={{ fontSize: 12, color: '#9e8e95' }}>· 142 Customer Reviews</span>
            </div>

            {/* Price Tag */}
            <div style={{
              background: '#fdf7f9', padding: '14px 18px', borderRadius: 14,
              border: '1px solid #f6e6eb', marginBottom: 20, display: 'flex',
              alignItems: 'baseline', justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: 11, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 2 }}>
                  Price
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#b95275', letterSpacing: '-0.02em' }}>
                  {formatPrice(product.price)}
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, background: '#f0fdf4', padding: '4px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                🚚 Free Delivery Included
              </span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 22 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                About This Formula
              </h4>
              <p style={{ margin: 0, fontSize: 13, color: '#665960', lineHeight: 1.7 }}>
                {product.description || 'Thoughtfully crafted with gentle botanical actives to restore balance, deeply hydrate, and enhance your natural healthy glow every day.'}
              </p>
            </div>

            {/* Highlights Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
              {['🌿 100% Clean', '🐰 Cruelty Free', '✨ Paraben Free', '💧 All Skin Types'].map(tag => (
                <span key={tag} style={{
                  padding: '5px 11px', background: '#ffffff', borderRadius: 20,
                  fontSize: 11, fontWeight: 600, color: '#615057', border: '1px solid #eedde2',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Area: Quantity & Add to Cart */}
          <div style={{ borderTop: '1px solid #f6edf0', paddingTop: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              {/* Quantity Counter */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', background: '#fbf5f7',
                borderRadius: 12, border: '1.5px solid #ecdde2', padding: 4,
              }}>
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: 34, height: 34, border: 0, borderRadius: 8,
                    background: '#ffffff', color: '#292329', fontSize: 16,
                    fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: 36, textAlign: 'center', fontSize: 14, fontWeight: 800, color: '#292329' }}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: 34, height: 34, border: 0, borderRadius: 8,
                    background: '#ffffff', color: '#292329', fontSize: 16,
                    fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddMultiple}
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: 12,
                  background: isOutOfStock ? '#e5e7eb' : '#b95275',
                  color: isOutOfStock ? '#9ca3af' : '#ffffff',
                  border: 0, fontSize: 14, fontWeight: 700,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  boxShadow: isOutOfStock ? 'none' : '0 6px 20px rgba(185, 82, 117, 0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'background 0.2s, transform 0.2s',
                }}
              >
                {isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <span>Add to bag</span>
                    <span>·</span>
                    <span>{formatPrice(totalPrice)}</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14, fontSize: 11, color: '#9e8e95' }}>
              <span>💵 Cash on Delivery</span>
              <span>🔒 100% Authentic Formula</span>
              <span>📦 2–4 Days Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
