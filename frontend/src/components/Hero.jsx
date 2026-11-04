import HeroProductArt from './HeroProductArt.jsx';
import PhotoImage from './PhotoImage.jsx';

export default function Hero({ onNavigate }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-edition-line">
        <span>NUDU JOURNAL · ISSUE 01</span>
        <span>CLEAN BOTANICAL FORMULATIONS</span>
        <span>EST. 2026</span>
      </div>

      <div className="hero-copy reveal-in">
        <p className="eyebrow">
          <span className="eyebrow-line" /> The Everyday Skincare Ritual
        </p>
        <h1 id="hero-title">
          Your Skin,<br />
          <em>Your Glow.</em>
        </h1>
        <p className="hero-description">
          Mindfully crafted essentials designed to hydrate, nourish, and bring a quiet moment of luxury to your daily routine.
        </p>

        <div className="hero-actions">
          <a
            className="button button-primary"
            href="/shop"
            onClick={(e) => { e.preventDefault(); onNavigate('/shop'); }}
          >
            Shop The Edit <span aria-hidden="true">→</span>
          </a>
          <a
            className="button button-outline"
            href="/categories"
            onClick={(e) => { e.preventDefault(); onNavigate('/categories'); }}
          >
            Explore Collections <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="hero-trust-badges">
          <div className="trust-badge-item">
            <span className="trust-icon">🌿</span>
            <span>100% Clean &amp; Gentle</span>
          </div>
          <div className="trust-badge-item">
            <span className="trust-icon">✨</span>
            <span>Dermatologist Approved</span>
          </div>
          <div className="trust-badge-item">
            <span className="trust-icon">🚚</span>
            <span>Free Delivery across Pakistan</span>
          </div>
        </div>
      </div>

      <div className="hero-visual reveal-in">
        <div className="hero-image-frame">
          <PhotoImage
            src="https://images.pexels.com/photos/15854292/pexels-photo-15854292.jpeg?auto=compress&cs=tinysrgb&w=1500"
            alt="A luxury skincare bottle held against a soft blush pink studio backdrop"
            fallback={<HeroProductArt />}
          />
        </div>

        <div className="hero-note-card glass-panel">
          <span className="note-sparkle" aria-hidden="true">★</span>
          <div>
            <strong>4.9 / 5.0 Rating</strong>
            <p>Loved by 2,000+ skincare lovers</p>
          </div>
        </div>

        <span className="hero-visual-label">
          THE EVERYDAY EDIT <span>01 — 04</span>
        </span>
      </div>

      <a className="scroll-cue" href="#categories">
        <span /> Discover your ritual
      </a>
    </section>
  );
}
