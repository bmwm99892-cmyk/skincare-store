import { useEffect, useMemo, useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Categories from './pages/Categories.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ProductQuickView from './components/ProductQuickView.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import { API_BASE, normaliseProduct } from './lib/api.js';

const initialPath = () => window.location.pathname.replace(/\/$/, '') || '/';
const categoryFromUrl = () => new URLSearchParams(window.location.search).get('category') || 'All';

export default function App() {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── DB state ────────────────────────────────────────────────────────────────
  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchProducts = useCallback(() => {
    setProductsLoading(true);
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDbProducts(data.map(normaliseProduct));
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, []);

  const fetchCategories = useCallback(() => {
    fetch(`${API_BASE}/categories`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDbCategories(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ── Router ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const syncLocation = () => {
      setCurrentPath(initialPath());
      setActiveCategory(categoryFromUrl());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', syncLocation);
    return () => window.removeEventListener('popstate', syncLocation);
  }, []);

  const navigate = (path) => {
    const next = new URL(path, window.location.origin);
    window.history.pushState({}, '', `${next.pathname}${next.search}`);
    setCurrentPath(next.pathname.replace(/\/$/, '') || '/');
    if (next.pathname === '/shop') setActiveCategory(next.searchParams.get('category') || 'All');
    setIsSearchOpen(false);
    setQuickViewProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (loggedInUser) => {
    const curToken = localStorage.getItem('token');
    setToken(curToken);
    setUser(loggedInUser);
    if (loggedInUser?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/my-orders');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  // ── Cart ────────────────────────────────────────────────────────────────────
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const changeQuantity = (productId, amount) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Called after successful order → clear cart
  const handleOrderSuccess = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  const selectCategory = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const pageProducts = useMemo(() =>
    dbProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      return matchesCategory && (!query || `${product.name} ${product.category}`.toLowerCase().includes(query));
    }),
    [dbProducts, activeCategory, searchQuery]
  );

  const quickViewAdd = (product) => {
    setQuickViewProduct(null);
    addToCart(product);
  };

  const sharedPageProps = {
    onSelectCategory: selectCategory,
    onAddToCart: addToCart,
    onToggleWishlist: toggleWishlist,
    onQuickView: setQuickViewProduct,
    onNavigate: navigate,
    wishlist,
  };

  // ── Pages ───────────────────────────────────────────────────────────────────
  let page;
  if (currentPath === '/' || currentPath === '/home')
    page = <Home {...sharedPageProps} products={dbProducts} productsLoading={productsLoading} categories={dbCategories} />;
  else if (currentPath === '/shop')
    page = <Shop {...sharedPageProps} products={pageProducts} productsLoading={productsLoading} activeCategory={activeCategory} onSelectCategory={selectCategory} categories={dbCategories} />;
  else if (currentPath === '/categories')
    page = <Categories onSelectCategory={selectCategory} categories={dbCategories} />;
  else if (currentPath === '/about')
    page = <About onNavigate={navigate} />;
  else if (currentPath === '/contact')
    page = <Contact />;
  else if (currentPath === '/checkout')
    page = <Checkout cart={cart} user={user} onChangeQuantity={changeQuantity} onOrderSuccess={handleOrderSuccess} onNavigate={navigate} />;
  else if (currentPath === '/my-orders' || currentPath === '/account')
    page = token ? <MyOrders token={token} user={user} onLogout={handleLogout} onNavigate={navigate} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
  else if (currentPath === '/login')
    page = <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
  else if (currentPath === '/admin')
    page = (token && user?.role === 'admin') ? <Admin token={token} onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
  else page = (
    <main className="not-found-page">
      <p className="eyebrow">A LITTLE OFF THE MAP</p>
      <h1>That page <em>isn't here.</em></h1>
      <button className="button button-primary" onClick={() => navigate('/')}>
        Back to NUDU <span aria-hidden="true">→</span>
      </button>
    </main>
  );

  const isAdminPanel = currentPath === '/admin';

  return (
    <>
      {!isAdminPanel && (
        <Navbar
          cartCount={cartCount}
          onCartOpen={() => setIsCartOpen(true)}
          isSearchOpen={isSearchOpen}
          onSearchToggle={() => setIsSearchOpen((open) => !open)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentPath={currentPath}
          onNavigate={navigate}
          user={user}
          token={token}
          onLogout={handleLogout}
        />
      )}
      <main key={currentPath}>{page}</main>
      {!isAdminPanel && <Footer onSelectCategory={selectCategory} onNavigate={navigate} />}

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          cartCount={cartCount}
          onClose={() => setIsCartOpen(false)}
          onChangeQuantity={changeQuantity}
          onNavigate={navigate}
        />
      )}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={quickViewAdd}
        />
      )}
    </>
  );
}
