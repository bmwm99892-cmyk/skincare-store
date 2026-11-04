const benefits = [
  { number: '01', icon: '🌿', title: 'Clean & Botanical Formulations', description: 'Mindfully chosen ingredients free from harsh parabens, sulfates, and synthetic fragrances.' },
  { number: '02', icon: '💧', title: 'Deep Everyday Hydration', description: 'Nourishing moisture barriers designed to protect and revitalize against city pollution.' },
  { number: '03', icon: '📦', title: 'Seamless Cash on Delivery', description: 'Order safely with doorstep delivery across all cities in Pakistan.' },
  { number: '04', icon: '♡', title: 'Dedicated Customer Care', description: 'Our skincare advisory team is always ready to guide you on your journey.' },
];

export default function Benefits() {
  return (
    <section className="section benefits-section" id="benefits" aria-labelledby="benefits-title">
      <div className="section-heading centered-heading">
        <p className="eyebrow">The NUDU Standard</p>
        <h2 id="benefits-title">
          Care in all the <em>little details.</em>
        </h2>
        <p>Simple daily rituals that keep your skin healthy, radiant, and happy.</p>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <article className="benefit-card" key={benefit.number}>
            <span className="benefit-icon" aria-hidden="true">{benefit.icon}</span>
            <span className="benefit-number">{benefit.number}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
