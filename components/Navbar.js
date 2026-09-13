'use client';

import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/90 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-11 items-center justify-center overflow-hidden md:h-12">
            <BrandLogo className="h-full w-auto max-w-[180px] md:max-w-[200px]" />
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/75 md:flex">
          <Link href="/about" className="transition-colors hover:text-red-400">About</Link>
          <Link href="/services" className="transition-colors hover:text-red-400">Services</Link>
          <Link href="/community" className="transition-colors hover:text-red-400">Community</Link>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-500"
        >
          Join Now
        </Link>
      </div>
    </header>
  );
}
