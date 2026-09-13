'use client';

import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-black/95 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 items-center justify-start md:h-14">
            <BrandLogo className="h-10 w-auto md:h-12 max-w-[220px]" />
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 md:flex">
          <Link href="/about" className="transition-colors hover:text-red-400">About</Link>
          <Link href="/services" className="transition-colors hover:text-red-400">Services</Link>
          <Link href="/community" className="transition-colors hover:text-red-400">Community</Link>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-500 shadow-md"
        >
          Join Now
        </Link>
      </div>
    </header>
  );
}
