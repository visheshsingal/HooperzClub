'use client';

import Link from 'next/link';
import BrandLogo from './BrandLogo';

const columnOne = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Community', href: '/community' },
  { label: 'Help', href: '/help' },
];

const columnTwo = [
  { label: 'Events', href: '/events' },
  { label: 'Booking', href: '/services' },
  { label: 'Teams', href: '/community' },
  { label: 'Contact', href: '/contact' },
];

const columnThree = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Security', href: '/security' },
  { label: 'Cookies', href: '/cookies' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center">
              <div className="flex h-16 w-64 items-center justify-start overflow-hidden">
                <BrandLogo className="h-11 w-auto max-w-[220px]" />
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              The basketball-first community for pickup games, league play, tournaments, and city court culture.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/thehooperzclub?stkn=MTZqMnhxbjhkN2k1aQ=="
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Hooperzclub on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-red-400 hover:text-red-400"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbAW1EcEFeXf1dmLms1P"
                target="_blank"
                rel="noreferrer"
                aria-label="Join Hooperzclub on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-red-400 hover:text-red-400"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .23 5.31.23 11.85c0 2.09.55 4.13 1.59 5.93L.12 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.42h.01c6.53 0 11.85-5.32 11.85-11.85 0-3.17-1.23-6.15-3.44-8.4Zm-8.42 18.2h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.87 9.87 0 1 1 8.38 4.65Zm5.42-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5a9.07 9.07 0 0 1-1.68-2.09c-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {columnOne.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-red-400">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {columnTwo.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-red-400">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {columnThree.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-red-400">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hooperzclub</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="transition-colors hover:text-red-400">Terms</Link>
            <Link href="/privacy" className="transition-colors hover:text-red-400">Privacy</Link>
            <Link href="/contact" className="transition-colors hover:text-red-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
