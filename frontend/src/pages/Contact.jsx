import { useState } from 'react';
import PageIntro from './PageIntro.jsx';

export default function Contact() {
  const [sent, setSent] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return <>
    <PageIntro index="04" eyebrow="WE WOULD LOVE TO HEAR FROM YOU" title={<>Say hello, <em>anytime.</em></>} description="A question about your routine, an order, or just want to say hi? Leave us a note." />
    <section className="contact-layout">
      <div className="contact-details glass-panel">
        <p className="eyebrow">A REAL PERSON, A LITTLE CARE</p><h2>We are here<br />for <em>you.</em></h2>
        <p>Our friendly team is happy to help with product questions and everyday skincare discoveries.</p>
        <div className="contact-detail-row"><span>EMAIL</span><a href="mailto:hello@nudubeauty.example">hello@nudubeauty.example</a></div>
        <div className="contact-detail-row"><span>PHONE</span><a href="tel:+923000000000">+92 300 0000000</a></div>
        <div className="contact-detail-row"><span>HOURS</span><p>Monday–Friday · 9am–5pm</p></div>
        <small>Contact details are placeholders for this storefront demo.</small>
      </div>
      <form className="contact-form glass-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">SEND A LITTLE NOTE</p>
        <label>Your name<input name="name" autoComplete="name" placeholder="Your name" required /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label>What can we help with?<select name="topic" defaultValue="Product question"><option>Product question</option><option>Order help</option><option>Something else</option></select></label>
        <label>Your message<textarea name="message" rows="5" placeholder="Tell us a little more..." required /></label>
        <button className="button button-primary" type="submit">Send your message <span aria-hidden="true">→</span></button>
        <p className="contact-status" role="status" aria-live="polite">{sent ? 'Thank you for reaching out. This is a demo form, so no message was sent.' : 'Demo form only. Your message will not be stored or sent yet.'}</p>
      </form>
    </section>
  </>;
}
