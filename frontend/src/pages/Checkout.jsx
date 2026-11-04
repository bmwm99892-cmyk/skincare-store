import { useState } from 'react';
import { API_BASE, formatPrice } from '../lib/api.js';
import PhotoImage from '../components/PhotoImage.jsx';
import ProductArtwork from '../components/ProductArtwork.jsx';

const cities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur',
];

const inp = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e8dde1',
  borderRadius: 10, fontSize: 13, outline: 'none', color: '#292329',
  boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color .2s',
};
const inpFocus = { borderColor: '#d96c91' };

function InputField({ label, required, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#82777d', marginBottom: 5, letterSpacing: '.04em' }}>
        {label} {required && <span style={{ color: '#d96c91' }}>*</span>}
      </label>
      {props.as === 'select' ? (
        <select
          {...props}
          as={undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inp, ...(focused ? inpFocus : {}), background: '#fff' }}
        >
          {props.children}
        </select>
      ) : props.as === 'textarea' ? (
        <textarea
          {...props}
          as={undefined}
          rows={3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inp, ...(focused ? inpFocus : {}), resize: 'vertical' }}
        />
      ) : (
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inp, ...(focused ? inpFocus : {}) }}
        />
      )}
      {error && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 3, display: 'block' }}>{error}</span>}
    </div>
  );
}

export default function Checkout({ cart, user, onChangeQuantity, onOrderSuccess, onNavigate }) {
  const [form, setForm] = useState({
    customer_name: user?.full_name || '',
    customer_email: user?.email || '',
    phone: '',
    shipping_address: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null); // order confirmation data

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim()) e.customer_name = 'Name is required';
    if (!form.customer_email.trim() || !/\S+@\S+\.\S+/.test(form.customer_email)) e.customer_email = 'Valid email required';
    if (!form.phone.trim() || form.phone.trim().length < 10) e.phone = 'Valid phone number required';
    if (!form.shipping_address.trim()) e.shipping_address = 'Address is required';
    if (!form.city) e.city = 'Please select a city';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setPlacing(true);
    try {
      const items = cart.map(item => ({
        product_id:   item.dbId || null,
        product_name: item.name,
        unit_price:   item.price,
        quantity:     item.quantity,
        subtotal:     item.price * item.quantity,
      }));

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          user_id: user?.id || null,
          items,
          payment_method: 'cod',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      setPlaced(data);
      onOrderSuccess?.();   // clears cart in App.jsx
    } catch (err) {
      setErrors({ submit: err.message });
    }
    setPlacing(false);
  };

  /* ── Order Confirmed Screen ───────────────────────────────────────────── */
  if (placed) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg,#fcf2f4,#f8dde5)' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '44px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(79,51,61,.13)' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
          <p style={{ color: '#d96c91', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 8 }}>Order Confirmed</p>
          <h2 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 700, color: '#292329', fontFamily: "'Playfair Display',Georgia,serif" }}>
            Thank you, {form.customer_name.split(' ')[0]}! 💕
          </h2>
          <p style={{ color: '#82777d', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            Your order <strong style={{ color: '#d96c91' }}>#{placed.order_id}</strong> has been placed successfully.<br />
            We'll send a confirmation to <strong>{form.customer_email}</strong>.<br />
            Cash on Delivery — our team will contact you soon.
          </p>
          <div style={{ background: '#fcf2f4', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left', fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#82777d' }}>Order Total</span>
              <strong style={{ color: '#d96c91' }}>{formatPrice(placed.total_amount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: '#82777d' }}>Payment</span>
              <span>Cash on Delivery</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: '#82777d' }}>Delivery to</span>
              <span>{form.city}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/my-orders')}
            style={{ width: '100%', padding: '13px', background: '#b95275', color: '#fff', border: 0, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 10 }}
          >
            📦 View My Orders
          </button>
          <button
            onClick={() => onNavigate('/')}
            style={{ width: '100%', padding: '11px', background: 'transparent', color: '#82777d', border: '1px solid #e8dde1', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  /* ── Empty Cart Guard ─────────────────────────────────────────────────── */
  if (!cart.length) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🛍️</div>
        <h2 style={{ margin: 0, fontFamily: "'Playfair Display',Georgia,serif", color: '#292329' }}>Your bag is empty</h2>
        <p style={{ color: '#82777d', fontSize: 13 }}>Add some products before checking out.</p>
        <button onClick={() => onNavigate('/shop')} style={{ padding: '12px 28px', background: '#b95275', color: '#fff', border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Shop Now</button>
      </div>
    );
  }

  /* ── Checkout Form ────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#faf6f7', padding: '40px 7%', fontFamily: "'DM Sans',sans-serif" }}>
      <div className="checkout-wrapper">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ margin: '0 0 6px', color: '#d96c91', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>NUDU Skincare</p>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#292329', fontFamily: "'Playfair Display',Georgia,serif" }}>
            Checkout <em style={{ color: '#d96c91' }}>✦</em>
          </h1>
        </div>

        <div className="checkout-grid">

          {/* ── LEFT: Delivery Form ──────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', boxShadow: '0 2px 16px rgba(79,51,61,.07)', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: '#292329', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                📦 Delivery Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <InputField label="Full Name" name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="e.g. Ayesha Khan" required error={errors.customer_name} />
                </div>
                <InputField label="Email" name="customer_email" type="email" value={form.customer_email} onChange={handleChange} placeholder="you@email.com" required error={errors.customer_email} />
                <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" required error={errors.phone} />
                <div style={{ gridColumn: '1/-1' }}>
                  <InputField label="Delivery Address" name="shipping_address" as="textarea" value={form.shipping_address} onChange={handleChange} placeholder="House #, Street, Area" required error={errors.shipping_address} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <InputField label="City" name="city" as="select" value={form.city} onChange={handleChange} required error={errors.city}>
                    <option value="">Select your city…</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </InputField>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 16px rgba(79,51,61,.07)', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#292329', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                💳 Payment Method
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '2px solid #d96c91', borderRadius: 10, background: '#fdf5f7' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#d96c91', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#292329' }}>Cash on Delivery</div>
                  <div style={{ fontSize: 11, color: '#82777d', marginTop: 2 }}>Pay when your order arrives — safe & easy</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 22 }}>💵</div>
              </div>
            </div>

            {errors.submit && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
                ❌ {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={placing}
              style={{ width: '100%', padding: '15px', background: placing ? '#c9a0b2' : '#b95275', color: '#fff', border: 0, borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: placing ? 'not-allowed' : 'pointer', transition: 'background .2s', letterSpacing: '.03em' }}
            >
              {placing ? '⏳ Placing Order…' : `✦ Place Order — ${formatPrice(total)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#b0a0a5', marginTop: 10 }}>
              🔒 Your information is safe with us
            </p>
          </form>

          {/* ── RIGHT: Order Summary ─────────────────────────────────── */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', boxShadow: '0 2px 16px rgba(79,51,61,.07)', position: 'sticky', top: 100 }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 700, color: '#292329', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              🧴 Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h3>

            <div style={{ maxHeight: 340, overflowY: 'auto', marginBottom: 16 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #f0e9eb', alignItems: 'center' }}>
                  <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#f8dde5' }}>
                    <PhotoImage
                      src={item.image}
                      alt={item.name}
                      fallback={<ProductArtwork product={item} />}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#292329', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#82777d', marginTop: 2 }}>{item.category}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <button onClick={() => onChangeQuantity(item.id, -1)} style={{ width: 24, height: 24, border: '1px solid #e8dde1', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14, display: 'grid', placeItems: 'center', color: '#82777d' }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => onChangeQuantity(item.id, 1)} style={{ width: 24, height: 24, border: '1px solid #e8dde1', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14, display: 'grid', placeItems: 'center', color: '#82777d' }}>+</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#d96c91', whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid #f0e9eb', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#82777d', marginBottom: 6 }}>
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#82777d', marginBottom: 6 }}>
                <span>Shipping</span><span style={{ color: '#10b981', fontWeight: 600 }}>Free 🎁</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#292329', marginTop: 12, paddingTop: 12, borderTop: '2px solid #f0e9eb' }}>
                <span>Total</span>
                <span style={{ color: '#d96c91' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/shop')}
              style={{ width: '100%', marginTop: 16, padding: '10px', background: 'transparent', color: '#82777d', border: '1px solid #e8dde1', borderRadius: 10, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

