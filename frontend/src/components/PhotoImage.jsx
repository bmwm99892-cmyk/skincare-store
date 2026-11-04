import { useState } from 'react';

export default function PhotoImage({ src, alt, className = '', fallback }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) return fallback;

  return <img
    className={className}
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    onError={() => setHasError(true)}
  />;
}
