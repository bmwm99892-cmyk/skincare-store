const paletteByCategory = {
  'Face Care': { background: '#f1e2dc', accent: '#c78979', dark: '#985d58', label: 'FACE RITUAL' },
  Cleansers: { background: '#f4e8e5', accent: '#ddb3ad', dark: '#a87678', label: 'GENTLE CLEANSE' },
  Moisturizers: { background: '#f2e5e7', accent: '#dbaeb8', dark: '#a95f78', label: 'SOFT CREAM' },
  Serums: { background: '#eee2d7', accent: '#b97854', dark: '#754a3e', label: 'DAILY SERUM' },
};

export default function ProductArtwork({ product, className = '' }) {
  const palette = paletteByCategory[product.category] || paletteByCategory['Face Care'];
  const isSet = product.id?.includes('set');
  const isTube = product.category === 'Cleansers';
  const isSerum = product.category === 'Serums';
  const key = (product.id || product.category).replace(/[^a-z0-9]/gi, '');
  const titleId = `art-${key}`;

  return <svg className={`product-art ${className}`} viewBox="0 0 500 520" role="img" aria-labelledby={titleId} xmlns="http://www.w3.org/2000/svg">
    <title id={titleId}>{product.name || `${product.category} skincare collection`}</title>
    <defs>
      <linearGradient id={`${key}bg`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffaf7"/><stop offset="1" stopColor={palette.background}/></linearGradient>
      <linearGradient id={`${key}vessel`} x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#fff" stopOpacity=".94"/><stop offset=".55" stopColor={palette.accent} stopOpacity=".7"/><stop offset="1" stopColor={palette.dark} stopOpacity=".56"/></linearGradient>
      <linearGradient id={`${key}cream`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf9"/><stop offset="1" stopColor="#ead7c9"/></linearGradient>
      <filter id={`${key}shadow`} x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="12"/><feComponentTransfer><feFuncA type="linear" slope=".15"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="500" height="520" fill={`url(#${key}bg)`}/>
    <circle cx="375" cy="120" r="105" fill="#fff" opacity=".34"/>
    <circle cx="375" cy="120" r="137" fill="none" stroke="#fff" strokeOpacity=".48"/>
    <path d="M0 405c121-27 232-9 326 8s132 9 174-11v118H0z" fill={palette.accent} opacity=".12"/>
    <path d="M54 414 164 216m-69 117-32-37m73-42-39-31m219 190 80-166m-42 86 36-23m-65-30 31-29" fill="none" stroke="#aab49d" strokeWidth="2" strokeLinecap="round" opacity=".35"/>
    <g fill="#b7c0a8" opacity=".42"><ellipse cx="66" cy="290" rx="14" ry="34" transform="rotate(-40 66 290)"/><ellipse cx="113" cy="251" rx="13" ry="31" transform="rotate(-45 113 251)"/><ellipse cx="370" cy="249" rx="13" ry="32" transform="rotate(42 370 249)"/><ellipse cx="409" cy="206" rx="12" ry="29" transform="rotate(45 409 206)"/></g>
    <ellipse cx="255" cy="426" rx="139" ry="24" fill="#72515d" opacity=".15"/>
    <g filter={`url(#${key}shadow)`}>
      {isSet ? <g>
        <rect x="107" y="285" width="90" height="136" rx="19" fill={`url(#${key}vessel)`} stroke="#fff" strokeWidth="3"/>
        <rect x="124" y="265" width="56" height="28" rx="6" fill="#eee4db"/>
        <rect x="211" y="235" width="91" height="186" rx="22" fill={`url(#${key}vessel)`} stroke="#fff" strokeWidth="3"/>
        <rect x="230" y="211" width="53" height="32" rx="7" fill="#e5d5c7"/>
        <rect x="315" y="292" width="82" height="129" rx="19" fill={`url(#${key}cream)`} stroke="#fff" strokeWidth="3"/>
        <rect x="309" y="274" width="94" height="28" rx="7" fill="#fffdf8" stroke="#e4d6cc"/>
        <text x="252" y="348" textAnchor="middle" fill={palette.dark} fontFamily="Georgia,serif" fontSize="22" letterSpacing="4">NUDU</text>
        <text x="252" y="368" textAnchor="middle" fill="#927b78" fontFamily="Arial,sans-serif" fontSize="7" letterSpacing="1.5">THE SIMPLE RITUAL</text>
      </g> : isTube ? <g>
        <path d="M176 150Q250 136 324 150L307 374Q250 397 193 374z" fill={`url(#${key}cream)`} stroke="#fff" strokeWidth="4"/>
        <path d="M188 164Q250 151 312 164" fill="none" stroke="#fff" strokeWidth="8" opacity=".8"/>
        <rect x="210" y="369" width="80" height="46" rx="10" fill={palette.dark}/>
        <text x="250" y="273" textAnchor="middle" fill={palette.dark} fontFamily="Georgia,serif" fontSize="25" letterSpacing="4">NUDU</text>
        <text x="250" y="298" textAnchor="middle" fill="#947e7d" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="1.5">{palette.label}</text>
        <text x="250" y="319" textAnchor="middle" fill="#a99994" fontFamily="Arial,sans-serif" fontSize="7" letterSpacing="1">EVERYDAY ESSENTIAL</text>
      </g> : isSerum ? <g>
        <rect x="169" y="202" width="162" height="219" rx="30" fill="#ae7053" stroke="#fff" strokeWidth="3"/>
        <path d="M192 225v166" stroke="#f5ddcf" strokeWidth="10" strokeLinecap="round" opacity=".35"/>
        <rect x="208" y="173" width="84" height="43" rx="9" fill="#eee5dc"/>
        <rect x="231" y="142" width="38" height="37" rx="6" fill="#d6c8bb"/>
        <rect x="246" y="112" width="8" height="36" rx="4" fill="#684e47"/>
        <rect x="186" y="278" width="128" height="82" rx="8" fill="#f8eee5" opacity=".95"/>
        <text x="250" y="316" textAnchor="middle" fill={palette.dark} fontFamily="Georgia,serif" fontSize="23" letterSpacing="4">NUDU</text>
        <text x="250" y="337" textAnchor="middle" fill="#947e7d" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="1.5">{palette.label}</text>
      </g> : product.id?.includes('oil') ? <g>
        <rect x="177" y="210" width="146" height="211" rx="28" fill={`url(#${key}vessel)`} stroke="#fff" strokeWidth="3"/>
        <rect x="216" y="177" width="68" height="45" rx="8" fill="#e6ddd5"/>
        <rect x="237" y="140" width="27" height="43" rx="5" fill="#c7aea0"/>
        <rect x="248" y="109" width="7" height="36" rx="3" fill="#705550"/>
        <path d="M198 237v145" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity=".72"/>
        <text x="250" y="319" textAnchor="middle" fill={palette.dark} fontFamily="Georgia,serif" fontSize="23" letterSpacing="4">NUDU</text>
        <text x="250" y="341" textAnchor="middle" fill="#947e7d" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="1.5">FACE CARE</text>
      </g> : <g>
        <rect x="163" y="260" width="174" height="161" rx="34" fill={`url(#${key}cream)`} stroke="#fff" strokeWidth="4"/>
        <rect x="151" y="227" width="198" height="47" rx="13" fill="#fffdf8" stroke="#e7d9d0" strokeWidth="2"/>
        <path d="M186 290v101" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity=".8"/>
        <text x="250" y="335" textAnchor="middle" fill={palette.dark} fontFamily="Georgia,serif" fontSize="24" letterSpacing="4">NUDU</text>
        <text x="250" y="358" textAnchor="middle" fill="#947e7d" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="1.5">{palette.label}</text>
      </g>}
    </g>
    <circle cx="94" cy="115" r="3" fill="#fff"/><circle cx="416" cy="364" r="4" fill="#fff"/>
  </svg>;
}
