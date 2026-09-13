'use client';

const LOGO_URL = 'https://plain-apac-prod-public.komododecks.com/202609/13/zINRQ2nZc718RGX7wikh/image.png';

export default function BrandLogo({ className = '' }) {
  return (
    <img
      src={LOGO_URL}
      alt="Hooperzclub logo"
      className={`object-contain block ${className}`}
    />
  );
}
