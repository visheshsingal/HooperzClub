'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-4 inset-x-4 z-50 flex justify-center">
      <div className="inline-flex rounded-2xl border border-red-600/20 bg-black shadow-md shadow-black/20">
        <div className="flex h-10 items-center gap-2 px-3">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-sm font-bold tracking-tight text-white transition-colors duration-200">
              Hooperz<span className="text-red-500">club</span>
            </span>
          </Link>

          <Link
            href="/signup"
            className="inline-flex h-8 min-w-[80px] items-center justify-center whitespace-nowrap rounded-2xl bg-red-600 px-3 text-[11px] font-semibold text-white border border-red-600 hover:bg-red-500 transition-all duration-200 active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
