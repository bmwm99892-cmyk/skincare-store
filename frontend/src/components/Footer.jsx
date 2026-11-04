import BrandLogo from './BrandLogo.jsx';

const year = new Date().getFullYear();

export default function Footer({ onSelectCategory, onNavigate }) {
  const categories = ['Face Care', 'Cleansers', 'Moisturizers', 'Serums'];
  const navigateLink = (path) => (event) => { event.preventDefault(); onNavigate(path); };
  return <footer className="site-footer">
    <div className="footer-main"><div className="footer-brand-col"><a className="brand footer-brand" href="/" onClick={navigateLink('/')} aria-label="NUDU Beauty & Fragrance home"><BrandLogo /></a><p>Thoughtful little rituals for your everyday glow.</p></div>
      <div className="footer-col"><h2>Explore</h2><a href="/" onClick={navigateLink('/')}>Home</a><a href="/shop" onClick={navigateLink('/shop')}>Shop all</a><a href="/categories" onClick={navigateLink('/categories')}>Categories</a><a href="/about" onClick={navigateLink('/about')}>Our story</a><a href="/contact" onClick={navigateLink('/contact')}>Contact</a></div>
      <div className="footer-col"><h2>Shop by category</h2>{categories.map((category) => <button type="button" key={category} onClick={() => onSelectCategory(category)}>{category}</button>)}</div>
      <div className="footer-col footer-contact"><h2>Say hello</h2><p>Email: <span>hello@nudubeauty.example</span></p><p>Phone: <span>+92 300 0000000</span></p><p>Hours: <span>Monday–Friday · 9am–5pm</span></p><a href="/contact" onClick={navigateLink('/contact')}>Contact us →</a></div>
    </div><div className="footer-bottom"><span>© {year} NUDU Beauty &amp; Fragrance. All rights reserved.</span><a href="/" onClick={navigateLink('/')}>Back to home ↑</a><span className="footer-made">Made with care <span aria-hidden="true">♡</span></span></div>
  </footer>;
}

