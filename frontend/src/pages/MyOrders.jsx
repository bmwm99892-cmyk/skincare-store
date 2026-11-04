import { useState, useEffect, useCallback } from 'react';
import { API_BASE, formatPrice } from '../lib/api.js';

function StatusBadge({ value, type = 'order' }) {
  const orderColors = {
    pending:    '#f59e0b',
    processing: '#3b82f6',
    shipped:    '#8b5cf6',
    delivered:  '#10b981',
    cancelled:  '#ef4444',
  };
  const payColors = {
    pending:  '#f59e0b',
    paid:     '#10b981',
    failed:   '#ef4444',
    refunded: '#6b7280',
  };
  const color = type === 'order' ? (orderColors[value] || '#6b7280') : (payColors[value] || '#6b7280');
  return (
    <span style={{
      padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: color + '1c', color, border: `1px solid ${color}44`,
      display: 'inline-block', textTransform: 'capitalize',
    }}>
      {value}
    </span>
  );
}

export default function MyOrders({ token, user, onLogout, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/user/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  return (
    <div style={{ minHeight: '85vh', background: '#faf6f7', padding: '48px 7% 80px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* User Profile Bar */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '24px 28px',
          boxShadow: '0 2px 16px rgba(79,51,61,.06)', marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', background: '#f8dde5',
              color: '#b95275', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 700,
            }}>
              {(user?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#292329' }}>
                Hello, {user?.full_name || 'Valued Customer'}! 👋
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#82777d' }}>
                {user?.email} · {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('/admin')}
                style={{ padding: '9px 16px', background: '#2d1f24', color: '#f8dde5', border: 0, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                ⚙️ Admin Dashboard
              </button>
            )}
            <button
              onClick={() => onNavigate('/shop')}
              style={{ padding: '9px 16px', background: '#fcf2f4', color: '#b95275', border: '1px solid #e8dde1', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              Shop More
            </button>
            <button
              onClick={onLogout}
              style={{ padding: '9px 16px', background: 'transparent', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#d96c91', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>YOUR ACCOUNT</p>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#292329', fontFamily: "'Playfair Display',Georgia,serif" }}>
              My Orders &amp; <em style={{ color: '#d96c91' }}>Purchases</em>
            </h1>
          </div>
          <button
            onClick={fetchOrders}
            style={{ background: 'transparent', border: 0, color: '#b95275', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, color: '#dc2626', fontSize: 13, marginBottom: 20 }}>
            ❌ {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2].map(i => (
              <div key={i} style={{ height: 120, background: '#fff', borderRadius: 16, border: '1px solid #f0e9eb', animation: 'pulse 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div style={{
            background: '#fff', borderRadius: 20, padding: '60px 24px', textAlign: 'center',
            boxShadow: '0 2px 16px rgba(79,51,61,.06)', border: '1px solid #f0e9eb',
          }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🛍️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#292329' }}>No orders yet</h3>
            <p style={{ margin: '0 0 24px', fontSize: 13, color: '#82777d', maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
              You haven't placed any orders with this account yet. Discover thoughtful skincare rituals made just for you.
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              style={{ padding: '12px 28px', background: '#b95275', color: '#fff', border: 0, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Explore Shop Collection →
            </button>
          </div>
        ) : (
          /* Orders List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#fff', borderRadius: 18, border: '1px solid #f0e9eb',
                  boxShadow: '0 2px 14px rgba(79,51,61,.05)', padding: '24px 26px',
                  transition: 'box-shadow .2s',
                }}
              >
                {/* Order Top Header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: 16, borderBottom: '1px solid #f6eff1', flexWrap: 'wrap', gap: 12,
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: '#292329' }}>Order #{order.id}</span>
                      <StatusBadge value={order.order_status} type="order" />
                      <StatusBadge value={order.payment_status} type="pay" />
                    </div>
                    <div style={{ fontSize: 12, color: '#82777d', marginTop: 4 }}>
                      Placed on {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#82777d' }}>Total Amount</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#d96c91' }}>
                      {formatPrice(order.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Items & Address Details */}
                <div className="order-card-row" style={{ padding: '16px 0' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', marginBottom: 6 }}>
                      🧴 Items in Order
                    </div>
                    <div style={{ fontSize: 13, color: '#292329', fontWeight: 500, lineHeight: 1.6 }}>
                      {order.items_summary || 'Order Items'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', marginBottom: 6 }}>
                      📍 Delivery Address
                    </div>
                    <div style={{ fontSize: 13, color: '#292329', lineHeight: 1.5 }}>
                      {order.customer_name} ({order.phone})<br />
                      {order.shipping_address}, <strong>{order.city}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div style={{
                  paddingTop: 14, borderTop: '1px solid #f6eff1',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
                }}>
                  <div style={{ fontSize: 12, color: '#82777d' }}>
                    Payment: <strong style={{ color: '#292329' }}>Cash on Delivery</strong>
                  </div>
                  <div style={{ fontSize: 12, color: '#82777d' }}>
                    Status: <strong style={{ color: '#b95275', textTransform: 'capitalize' }}>{order.order_status}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

