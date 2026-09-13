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
