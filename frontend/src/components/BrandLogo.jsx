import logoImage from './nudu-logo.svg';

export default function BrandLogo() {
  return <span className="brand-logo">
    <img src={logoImage} alt="NUDU Beauty & Fragrance" />
  </span>;
}
