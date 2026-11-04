import HeroProductArt from './HeroProductArt.jsx';
import PhotoImage from './PhotoImage.jsx';

export default function BrandStory({ onNavigate, isPage = false }) {
  return <section className="story-section" id={isPage ? 'about-story' : 'about'} aria-labelledby="story-title">
    <div className="story-image"><PhotoImage src="https://images.pexels.com/photos/8989957/pexels-photo-8989957.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="A woman gently applying moisturizer as part of her skincare ritual" fallback={<HeroProductArt />} /><span className="story-image-caption">A MOMENT, JUST FOR YOU</span></div>
    <div className="story-copy"><p className="eyebrow"><span className="eyebrow-line" /> The NUDU point of view</p><h2 id="story-title">Beauty Begins<br />With <em>Care.</em></h2><p>Skincare can be a gentle pause in a busy day. We bring together everyday essentials that make it easier to build a routine you enjoy, at your own pace.</p><p>Keep it simple, make it yours, and show up for a little moment of care each day.</p>{isPage ? <a className="text-link" href="#benefits">What matters to us <span aria-hidden="true">↓</span></a> : <a className="text-link" href="/about" onClick={(event) => { event.preventDefault(); onNavigate('/about'); }}>A little more about NUDU <span aria-hidden="true">→</span></a>}<span className="story-stamp" aria-hidden="true">N</span></div>
  </section>;
}

