import { useState, useEffect, useCallback, useMemo } from 'react';

const API = 'http://localhost:5000/api/admin';

// ── Auth Fetch Helper ────────────────────────────────────────────────────────
function authFetch(url, token, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

function formatPKR(amount) {
  return `Rs ${Number(amount || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;
}

// ── Status Badges ────────────────────────────────────────────────────────────
function StatusBadge({ value, type = 'order' }) {
  const orderStyles = {
    pending:    { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    shipped:    { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
    delivered:  { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    cancelled:  { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  };
  const payStyles = {
    pending:  { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    paid:     { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    failed:   { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
    refunded: { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' },
  };

  const style = (type === 'order' ? orderStyles[value] : payStyles[value]) || { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 700,
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'capitalize',
      letterSpacing: '0.02em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.color }} />
      {value}
    </span>
  );
}

// ── Modern Modal ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(23, 11, 17, 0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 540,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px -15px rgba(36, 20, 28, 0.3)',
        border: '1px solid #f0e6e9',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '22px 26px 18px', borderBottom: '1px solid #f6edf0',
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#292329', letterSpacing: '-0.01em' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '1px solid #f0e6e9',
              background: '#fcf8fa', display: 'grid', placeItems: 'center',
              fontSize: 18, cursor: 'pointer', color: '#82777d', transition: 'all 0.2s',
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '22px 26px' }}>{children}</div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #ebdce1', borderRadius: 10,
  fontSize: 13, outline: 'none', color: '#292329', boxSizing: 'border-box',
  background: '#ffffff', transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: "'DM Sans', sans-serif",
};

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#82777d', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: '#d96c91' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  1. OVERVIEW COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function Overview({ token, onSwitchTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`${API}/overview`, token)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ height: 110, background: '#fff', borderRadius: 16, animation: 'pulse 1.4s infinite', border: '1px solid #f3e8eb' }} />
        ))}
      </div>
    );
  }

  if (!data) return <p style={{ color: '#ef4444' }}>Unable to load dashboard data. Check backend connection.</p>;

  const stats = [
    { label: 'Total Revenue', value: formatPKR(data.totalRevenue), icon: '💰', color: '#d96c91', sub: 'From paid orders' },
    { label: 'Total Orders', value: data.totalOrders, icon: '📦', color: '#8b5cf6', sub: `${data.pendingOrders || 0} pending` },
    { label: 'Active Products', value: data.totalProducts, icon: '🧴', color: '#10b981', sub: 'In catalog' },
    { label: 'Categories', value: data.totalCategories, icon: '🗂️', color: '#f59e0b', sub: 'Rituals' },
    { label: 'Registered Customers', value: data.totalUsers, icon: '👤', color: '#3b82f6', sub: 'User accounts' },
    { label: 'Pending Delivery', value: data.pendingOrders, icon: '⏳', color: '#ef4444', sub: 'Needs action' },
  ];

  return (
    <div>
      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </span>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: '#fcf2f4', display: 'grid', placeItems: 'center', fontSize: 18 }}>
                {s.icon}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#292329', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: '#9e8e95' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{
        background: 'linear-gradient(135deg, #2d1722 0%, #1e1017 100%)',
        borderRadius: 18, padding: '22px 26px', color: '#fff', marginBottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#f8dde5' }}>Quick Store Operations</h4>
          <p style={{ margin: 0, fontSize: 12, color: '#c4a9b2' }}>Manage inventory or check latest customer orders</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => onSwitchTab('products')}
            style={{
              padding: '9px 18px', background: '#d96c91', color: '#fff', border: 0,
              borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            + Add Product
          </button>
          <button
            onClick={() => onSwitchTab('orders')}
            style={{
              padding: '9px 18px', background: 'rgba(255,255,255,0.12)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, fontWeight: 700, fontSize: 12,
              cursor: 'pointer',
            }}
          >
            View Orders ({data.totalOrders})
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="admin-card-table">
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #f3e8eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#292329' }}>Recent Orders</h3>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#82777d' }}>Latest purchases across the store</p>
          </div>
          <button
            onClick={() => onSwitchTab('orders')}
            style={{ background: 'transparent', border: 0, color: '#b95275', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            View All →
          </button>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#faf3f5' }}>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.recentOrders || []).map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f6edf0' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#b95275' }}>#{o.id}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 600, color: '#292329' }}>{o.customer_name}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#d96c91' }}>{formatPKR(o.total_amount)}</td>
                  <td style={{ padding: '14px 18px' }}><StatusBadge value={o.order_status} /></td>
                  <td style={{ padding: '14px 18px', color: '#82777d', fontSize: 12 }}>
                    {new Date(o.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
              {(!data.recentOrders || data.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ padding: 36, textAlign: 'center', color: '#82777d' }}>No orders placed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  2. PRODUCTS COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      authFetch(`${API}/products`, token).then(r => r.json()),
      authFetch(`${API}/categories`, token).then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm({ name: '', slug: '', description: '', price: '', image_url: '', stock_quantity: '10', is_active: '1', category_id: categories[0]?.id || '' });
    setModal('add');
    setMsg('');
  };

  const openEdit = (p) => {
    setForm({ ...p, is_active: String(p.is_active) });
    setModal(p);
    setMsg('');
  };

  const closeModal = () => { setModal(null); setMsg(''); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const isEdit = modal !== 'add';
      const url = isEdit ? `${API}/products/${modal.id}` : `${API}/products`;
      const method = isEdit ? 'PUT' : 'POST';
      const body = {
        ...form,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        is_active: Number(form.is_active),
        category_id: Number(form.category_id),
      };
      const res = await authFetch(url, token, { method, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg('✅ ' + data.message);
      load();
      setTimeout(closeModal, 800);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await authFetch(`${API}/products/${id}`, token, { method: 'DELETE' });
    load();
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.category_name || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'All' || String(p.category_id) === String(categoryFilter);
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  if (loading) return <p style={{ color: '#82777d' }}>Loading product inventory…</p>;

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, maxWidth: 500, minWidth: 260 }}>
          <input
            type="text"
            placeholder="🔍 Search products by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, padding: '9px 14px' }}
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: 140, padding: '9px 12px' }}
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <button
          onClick={openAdd}
          style={{
            background: '#b95275', color: '#fff', border: 0, borderRadius: 10,
            padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(185,82,117,0.25)', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="admin-card-table">
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#faf3f5' }}>
                {['Item', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f6edf0' }}>
                  <td style={{ padding: '10px 16px', width: 60 }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0e6e9' }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f8dde5', display: 'grid', placeItems: 'center', fontSize: 18 }}>🧴</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#292329' }}>
                    <div>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#9e8e95', fontWeight: 400 }}>/{p.slug}</div>
                  </td>
                  <td style={{ padding: '10px 16px', color: '#82777d' }}>{p.category_name || '—'}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 700, color: '#d96c91' }}>{formatPKR(p.price)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{
                      fontWeight: 700, fontSize: 12,
                      color: p.stock_quantity > 0 ? '#10b981' : '#ef4444',
                    }}>
                      {p.stock_quantity > 0 ? `${p.stock_quantity} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{
                      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: p.is_active ? '#f0fdf4' : '#fef2f2',
                      color: p.is_active ? '#15803d' : '#b91c1c',
                    }}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{
                        marginRight: 6, padding: '5px 12px', borderRadius: 8,
                        border: '1px solid #e8dde1', color: '#b95275', background: '#fff',
                        cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        padding: '5px 12px', borderRadius: 8, border: '1px solid #fecaca',
                        color: '#ef4444', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#82777d' }}>No products match your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Add New Product' : 'Edit Product'} onClose={closeModal}>
          <Field label="Product Name" required>
            <input name="name" value={form.name || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Dew Drops Face Serum" />
          </Field>
          <Field label="URL Slug" required>
            <input name="slug" value={form.slug || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. dew-drops-face-serum" />
          </Field>
          <Field label="Description" required>
            <textarea name="description" value={form.description || ''} onChange={handleChange} style={{ ...inputStyle, height: 75, resize: 'vertical' }} placeholder="Product benefits and usage details" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Price (PKR)" required>
              <input name="price" type="number" value={form.price || ''} onChange={handleChange} style={inputStyle} />
            </Field>
            <Field label="Stock Quantity">
              <input name="stock_quantity" type="number" value={form.stock_quantity ?? ''} onChange={handleChange} style={inputStyle} />
            </Field>
          </div>
          <Field label="Image URL">
            <input name="image_url" value={form.image_url || ''} onChange={handleChange} style={inputStyle} placeholder="https://images.pexels.com/..." />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Category" required>
              <select name="category_id" value={form.category_id || ''} onChange={handleChange} style={{ ...inputStyle, background: '#fff' }}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select name="is_active" value={String(form.is_active)} onChange={handleChange} style={{ ...inputStyle, background: '#fff' }}>
                <option value="1">Active (Visible)</option>
                <option value="0">Draft (Hidden)</option>
              </select>
            </Field>
          </div>
          {msg && <p style={{ margin: '8px 0', fontSize: 13, color: msg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{msg}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1, padding: '12px', background: '#b95275', color: '#fff',
                border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button
              onClick={closeModal}
              style={{
                flex: 1, padding: '12px', background: '#f5eaee', color: '#292329',
                border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  3. CATEGORIES COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function Categories({ token }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    authFetch(`${API}/categories`, token)
      .then(r => r.json())
      .then(d => { setCats(Array.isArray(d) ? d : []); setLoading(false); });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ name: '', slug: '', description: '' }); setModal('add'); setMsg(''); };
  const openEdit = (c) => { setForm({ ...c }); setModal(c); setMsg(''); };
  const closeModal = () => { setModal(null); setMsg(''); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const isEdit = modal !== 'add';
      const url = isEdit ? `${API}/categories/${modal.id}` : `${API}/categories`;
      const res = await authFetch(url, token, { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg('✅ ' + data.message);
      load();
      setTimeout(closeModal, 800);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    const res = await authFetch(`${API}/categories/${id}`, token, { method: 'DELETE' });
    const d = await res.json();
    if (!res.ok) alert(d.message); else load();
  };

  if (loading) return <p style={{ color: '#82777d' }}>Loading categories…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#292329' }}>Product Categories ({cats.length})</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#82777d' }}>Organize store rituals and collections</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: '#b95275', color: '#fff', border: 0, borderRadius: 10,
            padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(185,82,117,0.25)',
          }}
        >
          + Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {cats.map(c => (
          <div
            key={c.id}
            style={{
              background: '#ffffff', borderRadius: 16, border: '1px solid #f3e8eb',
              padding: '20px', boxShadow: '0 4px 18px -2px rgba(113,67,83,0.06)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#292329' }}>{c.name}</h4>
                  <span style={{ fontSize: 11, color: '#9e8e95' }}>/{c.slug}</span>
                </div>
                <span style={{ background: '#fcf2f4', color: '#b95275', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                  {c.product_count} items
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#82777d', lineHeight: 1.6, margin: '10px 0 16px' }}>
                {c.description || 'No description added.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f9edf1' }}>
              <button
                onClick={() => openEdit(c)}
                style={{
                  flex: 1, padding: '7px', borderRadius: 8, border: '1px solid #ebdce1',
                  color: '#b95275', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                style={{
                  flex: 1, padding: '7px', borderRadius: 8, border: '1px solid #fecaca',
                  color: '#ef4444', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Category' : 'Edit Category'} onClose={closeModal}>
          <Field label="Category Name" required>
            <input name="name" value={form.name || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Cleansers" />
          </Field>
          <Field label="Slug" required>
            <input name="slug" value={form.slug || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. cleansers" />
          </Field>
          <Field label="Description">
            <textarea name="description" value={form.description || ''} onChange={handleChange} style={{ ...inputStyle, height: 75, resize: 'vertical' }} placeholder="Short tagline for this collection" />
          </Field>
          {msg && <p style={{ margin: '8px 0', fontSize: 13, color: msg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{msg}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: '#b95275', color: '#fff', border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save Category'}
            </button>
            <button onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#f5eaee', color: '#292329', border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  4. ORDERS COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function Orders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    authFetch(`${API}/orders`, token)
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (order) => {
    setSelected(order);
    const res = await authFetch(`${API}/orders/${order.id}`, token);
    setOrderDetail(await res.json());
  };

  const updateOrder = async (id, order_status, payment_status) => {
    setUpdating(true);
    await authFetch(`${API}/orders/${id}`, token, { method: 'PUT', body: JSON.stringify({ order_status, payment_status }) });
    load();
    setUpdating(false);
    setSelected(null);
    setOrderDetail(null);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
      const matchSearch = String(o.id).includes(search) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        (o.city || '').toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  if (loading) return <p style={{ color: '#82777d' }}>Loading customer orders…</p>;

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                border: statusFilter === s ? '1.5px solid #b95275' : '1px solid #ebdce1',
                background: statusFilter === s ? '#b95275' : '#fff',
                color: statusFilter === s ? '#fff' : '#82777d',
                cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Search by Order #, Customer, City..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 280, padding: '8px 14px' }}
        />
      </div>

      {/* Orders Table */}
      <div className="admin-card-table">
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#faf3f5' }}>
                {['#ID', 'Customer', 'Phone', 'City', 'Amount', 'Order Status', 'Payment', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f6edf0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#b95275' }}>#{o.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#292329' }}>{o.customer_name}</td>
                  <td style={{ padding: '12px 14px', color: '#82777d' }}>{o.phone}</td>
                  <td style={{ padding: '12px 14px', color: '#82777d' }}>{o.city}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#d96c91' }}>{formatPKR(o.total_amount)}</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge value={o.order_status} type="order" /></td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge value={o.payment_status} type="pay" /></td>
                  <td style={{ padding: '12px 14px', color: '#82777d', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString('en-PK')}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => openDetail(o)}
                      style={{
                        padding: '5px 12px', borderRadius: 8, border: '1px solid #d96c91',
                        color: '#d96c91', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#82777d' }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selected && orderDetail && (
        <Modal title={`Manage Order #${selected.id}`} onClose={() => { setSelected(null); setOrderDetail(null); }}>
          <div>
            <div style={{ background: '#fcf8fa', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                <div><span style={{ color: '#82777d' }}>Customer:</span> <strong>{orderDetail.customer_name}</strong></div>
                <div><span style={{ color: '#82777d' }}>Email:</span> <strong>{orderDetail.customer_email}</strong></div>
                <div><span style={{ color: '#82777d' }}>Phone:</span> <strong>{orderDetail.phone}</strong></div>
                <div><span style={{ color: '#82777d' }}>City:</span> <strong>{orderDetail.city}</strong></div>
                <div style={{ gridColumn: '1/-1' }}><span style={{ color: '#82777d' }}>Address:</span> {orderDetail.shipping_address}</div>
              </div>
            </div>

            <h4 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', color: '#82777d' }}>Ordered Items</h4>
            <div style={{ border: '1px solid #f0e6e9', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              {(orderDetail.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #f6edf0', fontSize: 13 }}>
                  <span>{item.product_name} <strong>× {item.quantity}</strong></span>
                  <span style={{ fontWeight: 700, color: '#d96c91' }}>{formatPKR(item.subtotal)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#faf3f5', fontWeight: 800, fontSize: 15 }}>
                <span>Total Amount:</span>
                <span style={{ color: '#b95275' }}>{formatPKR(orderDetail.total_amount)}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Update Order Status">
                <select defaultValue={selected.order_status} id={`os-${selected.id}`} style={{ ...inputStyle, background: '#fff' }}>
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Update Payment Status">
                <select defaultValue={selected.payment_status} id={`ps-${selected.id}`} style={{ ...inputStyle, background: '#fff' }}>
                  {['pending', 'paid', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <button
              disabled={updating}
              onClick={() => updateOrder(
                selected.id,
                document.getElementById(`os-${selected.id}`).value,
                document.getElementById(`ps-${selected.id}`).value
              )}
              style={{
                width: '100%', marginTop: 8, padding: '13px', background: '#b95275', color: '#fff',
                border: 0, borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              {updating ? 'Updating...' : 'Save Order Changes'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  5. CUSTOMERS COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function Customers({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'customer' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    authFetch(`${API}/customers`, token)
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await authFetch(`${API}/customers`, token, { method: 'POST', body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg('✅ ' + data.message);
      load();
      setTimeout(() => { setModal(false); setMsg(''); }, 800);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await authFetch(`${API}/customers/${id}`, token, { method: 'DELETE' });
    load();
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  if (loading) return <p style={{ color: '#82777d' }}>Loading customer records…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <input
          type="text"
          placeholder="🔍 Search customers by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 300, padding: '9px 14px' }}
        />
        <button
          onClick={() => { setModal(true); setMsg(''); setForm({ full_name: '', email: '', password: '', role: 'customer' }); }}
          style={{
            background: '#b95275', color: '#fff', border: 0, borderRadius: 10,
            padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          + Add User
        </button>
      </div>

      <div className="admin-card-table">
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#faf3f5' }}>
                {['User', 'Role', 'Orders', 'Total Spent', 'Registered', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#82777d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f6edf0' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#292329' }}>{u.full_name}</div>
                    <div style={{ fontSize: 12, color: '#82777d' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: u.role === 'admin' ? '#fef3c7' : '#f0fdf4',
                      color: u.role === 'admin' ? '#92400e' : '#15803d',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.order_count}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#d96c91' }}>{formatPKR(u.total_spent)}</td>
                  <td style={{ padding: '12px 16px', color: '#82777d', fontSize: 12 }}>
                    {new Date(u.created_at).toLocaleDateString('en-PK')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca',
                        color: '#ef4444', background: '#fff', cursor: 'pointer', fontSize: 12,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#82777d' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Create New Account" onClose={() => setModal(false)}>
          <Field label="Full Name" required>
            <input name="full_name" value={form.full_name} onChange={handleChange} style={inputStyle} placeholder="e.g. Fatima Ali" />
          </Field>
          <Field label="Email" required>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="fatima@example.com" />
          </Field>
          <Field label="Password" required>
            <input name="password" type="password" value={form.password} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
          </Field>
          <Field label="Role">
            <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, background: '#fff' }}>
              <option value="customer">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </Field>
          {msg && <p style={{ margin: '8px 0', fontSize: 13, color: msg.startsWith('✅') ? '#10b981' : '#ef4444' }}>{msg}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: '#b95275', color: '#fff', border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {saving ? 'Creating...' : 'Create Account'}
            </button>
            <button onClick={() => setModal(false)} style={{ flex: 1, padding: '12px', background: '#f5eaee', color: '#292329', border: 0, borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN ADMIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function Admin({ token, onLogout }) {
  const [active, setActive] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'overview',   label: 'Overview',   icon: '📊' },
    { key: 'products',   label: 'Products',   icon: '🧴' },
    { key: 'categories', label: 'Categories', icon: '🗂️' },
    { key: 'orders',     label: 'Orders',     icon: '📦' },
    { key: 'customers',  label: 'Customers',  icon: '👤' },
  ];

  const handleNavClick = (key) => {
    setActive(key);
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-shell">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div style={{ padding: '26px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#d96c91', display: 'grid', placeItems: 'center', fontSize: 18, color: '#fff' }}>
              🌸
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                NUDU Studio
              </div>
              <div style={{ fontSize: 10, color: '#c4a6b0', letterSpacing: '0.02em' }}>
                Management Dashboard
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px',
                border: 0, borderRadius: 12, fontSize: 13, fontWeight: active === item.key ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                background: active === item.key ? '#b95275' : 'transparent',
                color: active === item.key ? '#ffffff' : '#e0cad2',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
              borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#f8dde5',
              fontSize: 12, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <span>🛍️</span> View Live Store ↗
          </a>
          <button
            onClick={onLogout}
            style={{
              width: '100%', textAlign: 'left', padding: '10px 14px',
              border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.08)', color: '#fca5a5',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Content Area ───────────────────────────────────────────────────── */}
      <div className="admin-content-area">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'grid', placeItems: 'center', width: 38, height: 38,
                borderRadius: 10, border: '1px solid #ebdce1', background: '#fff',
                fontSize: 18, cursor: 'pointer', color: '#b95275',
              }}
              title="Open Navigation"
            >
              ☰
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#292329', textTransform: 'capitalize' }}>
                {active}
              </h2>
              <div style={{ fontSize: 11, color: '#82777d' }}>
                Store Admin Panel · {new Date().toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px',
              background: '#ffffff', borderRadius: 30, border: '1px solid #ebdce1',
            }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#b95275', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>
                A
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#292329' }}>Administrator</span>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="admin-main-body">
          {active === 'overview' && <Overview token={token} onSwitchTab={setActive} />}
          {active === 'products' && <Products token={token} />}
          {active === 'categories' && <Categories token={token} />}
          {active === 'orders' && <Orders token={token} />}
          {active === 'customers' && <Customers token={token} />}
        </main>
      </div>
    </div>
  );
}
