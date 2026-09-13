'use client';

const LOGO_URL = '/logo.png';

export default function BrandLogo({ className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Hooperzclub logo"
      className={`object-contain block ${className}`}
    />
  );
}
