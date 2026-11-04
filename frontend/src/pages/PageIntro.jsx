export default function PageIntro({ index, eyebrow, title, description }) {
  return <section className="page-intro" aria-labelledby="page-title">
    <div className="page-intro-meta"><span>NUDU JOURNAL&nbsp; · &nbsp;{index}</span><span>BEAUTY &amp; FRAGRANCE</span></div>
    <p className="eyebrow">{eyebrow}</p>
    <h1 id="page-title">{title}</h1>
    {description && <p className="page-intro-description">{description}</p>}
  </section>;
}
