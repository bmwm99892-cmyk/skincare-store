export default function HeroProductArt() {
  return <svg className="hero-product-art" viewBox="0 0 700 620" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="hero-art-title" xmlns="http://www.w3.org/2000/svg">
    <title id="hero-art-title">NUDU skincare collection in a soft pink studio</title>
    <defs>
      <linearGradient id="studio" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff9f6"/><stop offset=".55" stopColor="#f7e3e5"/><stop offset="1" stopColor="#efcdd7"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#fff" stopOpacity=".9"/><stop offset=".45" stopColor="#f5dce2" stopOpacity=".9"/><stop offset="1" stopColor="#d9a8b4" stopOpacity=".82"/></linearGradient>
      <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf8"/><stop offset="1" stopColor="#ead5c4"/></linearGradient>
      <linearGradient id="roseBottle" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f8e6e5"/><stop offset="1" stopColor="#d6a0aa"/></linearGradient>
      <linearGradient id="amber" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c98763"/><stop offset=".45" stopColor="#a95f4a"/><stop offset="1" stopColor="#774436"/></linearGradient>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="12"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="floorBlur"><feGaussianBlur stdDeviation="13"/></filter>
    </defs>
    <rect width="700" height="620" rx="30" fill="url(#studio)"/>
    <circle cx="510" cy="155" r="118" fill="#fff7f2" opacity=".72"/>
    <circle cx="510" cy="155" r="151" fill="none" stroke="#fff" strokeOpacity=".52"/>
    <path d="M0 456c133-37 229-23 354 0s239 39 346-4v168H0z" fill="#f2d8dc" opacity=".76"/>
    <path d="M58 463 214 235M76 411l-37-41m65-56-42-36m14 177 53-20m-30-43 54-42m296 157 105-213m-56 103 49-21m-75-39 43-39" fill="none" stroke="#a9b49a" strokeWidth="3" strokeLinecap="round" opacity=".46"/>
    <g fill="#b9c4a8" opacity=".5"><ellipse cx="54" cy="367" rx="18" ry="42" transform="rotate(-39 54 367)"/><ellipse cx="86" cy="314" rx="16" ry="36" transform="rotate(-48 86 314)"/><ellipse cx="127" cy="390" rx="16" ry="40" transform="rotate(49 127 390)"/><ellipse cx="532" cy="274" rx="16" ry="39" transform="rotate(38 532 274)"/><ellipse cx="573" cy="226" rx="16" ry="38" transform="rotate(42 573 226)"/></g>
    <ellipse cx="348" cy="523" rx="255" ry="30" fill="#8a5968" opacity=".14" filter="url(#floorBlur)"/>
    <g filter="url(#softShadow)">
      <g>
        <rect x="146" y="292" width="129" height="202" rx="25" fill="url(#glass)" stroke="#fff" strokeOpacity=".86" strokeWidth="3"/>
        <rect x="162" y="260" width="97" height="43" rx="9" fill="#d9bdad"/>
        <rect x="174" y="236" width="73" height="28" rx="6" fill="#f7f2ed"/>
        <rect x="204" y="218" width="12" height="22" rx="3" fill="#c8aba1"/>
        <path d="M161 319v143" stroke="#fff" strokeOpacity=".72" strokeWidth="7" strokeLinecap="round"/>
        <text x="210" y="382" textAnchor="middle" fill="#925b6a" fontFamily="Georgia,serif" fontSize="22" letterSpacing="4">NUDU</text>
        <text x="210" y="407" textAnchor="middle" fill="#987c7d" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="2">FACE MIST</text>
      </g>
      <g>
        <rect x="296" y="238" width="147" height="258" rx="34" fill="url(#amber)" stroke="#fff" strokeOpacity=".55" strokeWidth="3"/>
        <rect x="332" y="205" width="75" height="47" rx="10" fill="#ece1d6"/>
        <rect x="354" y="180" width="31" height="30" rx="6" fill="#d6c5b6"/>
        <rect x="366" y="145" width="8" height="42" rx="4" fill="#5e4844"/>
        <path d="M315 269v189" stroke="#f9dfcf" strokeOpacity=".32" strokeWidth="9" strokeLinecap="round"/>
        <rect x="316" y="343" width="107" height="92" rx="9" fill="#f8ede6" opacity=".93"/>
        <text x="369" y="382" textAnchor="middle" fill="#744d50" fontFamily="Georgia,serif" fontSize="20" letterSpacing="3">NUDU</text>
        <text x="369" y="402" textAnchor="middle" fill="#8e6e69" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="1.4">DAILY SERUM</text>
      </g>
      <g>
        <rect x="466" y="363" width="157" height="132" rx="31" fill="url(#cream)" stroke="#fff" strokeOpacity=".9" strokeWidth="3"/>
        <rect x="459" y="336" width="171" height="42" rx="12" fill="#fffdf8" stroke="#e8d8ce" strokeWidth="2"/>
        <path d="M486 393v74" stroke="#fff" strokeOpacity=".9" strokeWidth="8" strokeLinecap="round"/>
        <text x="544" y="435" textAnchor="middle" fill="#925b6a" fontFamily="Georgia,serif" fontSize="20" letterSpacing="3">NUDU</text>
        <text x="544" y="455" textAnchor="middle" fill="#987c7d" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="1.5">CLOUD CREAM</text>
      </g>
    </g>
    <g fill="#fff" opacity=".88"><circle cx="115" cy="157" r="4"/><circle cx="590" cy="319" r="3"/><circle cx="474" cy="96" r="3"/></g>
    <path d="M43 529h614" stroke="#fff" strokeOpacity=".45"/>
  </svg>;
}
