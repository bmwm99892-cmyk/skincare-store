import { formatPrice } from '../lib/api.js';
import ProductArtwork from './ProductArtwork.jsx';
import PhotoImage from './PhotoImage.jsx';

export default function CartDrawer({ cart, cartCount, onClose, onChangeQuantity, onNavigate }) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const goCheckout = () => {
    onClose();
    onNavigate('/checkout');
  };

  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside className="cart-drawer glass-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        {/* Header */}
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">YOUR LITTLE EDIT</p>
            <h2 id="cart-title">Shopping bag <span>({cartCount})</span></h2>
          </div>
          <button className="icon-button close-button" type="button" aria-label="Close shopping bag" onClick={onClose}>×</button>
        </div>

        {cart.length === 0 ? (
          /* Empty state */
          <div className="cart-empty">
            <span aria-hidden="true">♡</span>
            <p>Your bag is waiting for a little glow.</p>
            <button className="text-button" type="button" onClick={onClose}>Continue exploring →</button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <PhotoImage
                    className="cart-product-photo"
                    src={item.image}
                    alt={item.name}
                    fallback={<ProductArtwork product={item} />}
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)}</p>
                    <div className="quantity-control" aria-label={`${item.name} quantity`}>
                      <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => onChangeQuantity(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Add one ${item.name}`} onClick={() => onChangeQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onChangeQuantity(item.id, -item.quantity)}
                  >×</button>
                </article>
              ))}
            </div>

            {/* Footer total + checkout */}
            <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #f0e9eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: '#82777d', fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#d96c91' }}>{formatPrice(total)}</span>
              </div>
              <button
                className="button button-primary"
                type="button"
                onClick={goCheckout}
                style={{ width: '100%', justifyContent: 'center', borderRadius: 10, fontSize: 13 }}
              >
                Checkout — {formatPrice(total)} <span aria-hidden="true">→</span>
              </button>
              <button
                className="button button-outline drawer-continue"
                type="button"
                onClick={onClose}
                style={{ width: '100%', justifyContent: 'center', marginTop: 10, borderRadius: 10, fontSize: 12 }}
              >
                Continue shopping
              </button>
              <p style={{ textAlign: 'center', fontSize: 10, color: '#b0a0a5', marginTop: 10 }}>
                🚚 Free delivery · 💵 Cash on Delivery
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
