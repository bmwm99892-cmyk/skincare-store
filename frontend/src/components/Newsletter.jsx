import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setMessage('✨ Thank you for subscribing! Welcome to the NUDU skincare family.');
    setEmail('');
  }

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-mark" aria-hidden="true">✳</div>

      <div className="newsletter-copy">
        <p className="eyebrow">A Note From NUDU</p>
        <h2 id="newsletter-title">
          A Little Glow<br />in Your Inbox.
        </h2>
        <p>Subscribe for exclusive launches, skincare ritual tips, and member-only promotions.</p>
      </div>

      <div className="newsletter-form-wrap">
        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setMessage(''); }}
            placeholder="Enter your email address"
            autoComplete="email"
            required
          />
          <button type="submit" className="button button-primary">
            Join The Club <span aria-hidden="true">→</span>
          </button>
        </form>

        {message && (
          <p className="newsletter-status" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
