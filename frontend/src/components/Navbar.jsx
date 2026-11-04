import { useState } from 'react';
import BrandLogo from './BrandLogo.jsx';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Navbar({
  cartCount,
  onCartOpen,
  isSearchOpen,
  onSearchToggle,
  searchQuery,
  onSearchChange,
  currentPath,
  onNavigate,
  user,
  token,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const baseLinks = [
    ['Home', '/'],
    ['Shop', '/shop'],
    ['Categories', '/categories'],
  ];

  if (token) {
    baseLinks.push(['My Orders', '/my-orders']);
  } else {
    baseLinks.push(['Sign In', '/login']);
  }

  baseLinks.push(['About', '/about'], ['Contact', '/contact']);

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <span>NUDU BEAUTY &amp; FRAGRANCE</span>
        <span>YOUR DAILY RITUAL, REIMAGINED <i aria-hidden="true">✳</i></span>
        <span>MADE WITH CARE</span>
      </div>

      <div className="navbar-inner">
        <a
          className="brand"
          href="/"
          onClick={(e) => { e.preventDefault(); closeMenu(); onNavigate('/'); }}
          aria-label="NUDU Beauty & Fragrance home"
        >
          <BrandLogo />
        </a>

        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {baseLinks.map(([label, href]) => (
            <a
              key={label}
              className={currentPath === href || (href === '/' && currentPath === '/home') ? 'nav-link is-active' : 'nav-link'}
              href={href}
              onClick={(e) => { e.preventDefault(); closeMenu(); onNavigate(href); }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={isSearchOpen ? 'Close search' : 'Search products'}
            aria-expanded={isSearchOpen}
            onClick={onSearchToggle}
          >
            <SearchIcon />
          </button>

          <button
            className="icon-button"
            type="button"
            aria-label={token ? 'View my account and orders' : 'Sign in'}
            onClick={() => onNavigate(token ? '/my-orders' : '/login')}
            title={token ? `Logged in as ${user?.full_name || 'Customer'}` : 'Sign In'}
            style={{ position: 'relative' }}
          >
            <UserIcon />
            {token && (
              <span style={{
                position: 'absolute', bottom: 4, right: 4, width: 8, height: 8,
                borderRadius: '50%', background: '#10b981', border: '1.5px solid #fff',
              }} />
            )}
          </button>

          <button
            className="icon-button bag-button"
            type="button"
            aria-label={`Open shopping bag, ${cartCount} items`}
            onClick={onCartOpen}
          >
            <BagIcon />
            <span className="cart-count">{cartCount}</span>
          </button>

          <button
            className="icon-button menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' }}>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <form className="search-panel" role="search" onSubmit={(e) => { e.preventDefault(); onNavigate('/shop'); }}>
          <label className="sr-only" htmlFor="product-search">Search products</label>
          <SearchIcon />
          <input
            id="product-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your skincare favourites"
            autoFocus
          />
          {searchQuery && (
            <button type="button" className="search-clear" onClick={() => onSearchChange('')}>
              Clear
            </button>
          )}
          <span className="search-hint">Results update as you type</span>
        </form>
      )}
    </header>
  );
}
