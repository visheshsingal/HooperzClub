'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2">
      <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/20">
        <div className="flex h-14 items-center justify-between px-5 sm:px-7">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-orange-500 transition-colors duration-200">
              Hooperz<span className="text-orange-500">club</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#leagues"
              className="text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
            >
              Explore Leagues
            </Link>
            <Link
              href="#about"
              className="text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="#join"
              className="text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
            >
              How It Works
            </Link>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="#join"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-orange-500 px-4 text-xs font-semibold text-white hover:bg-orange-600 transition-all duration-200 shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-95"
            >
              Create League
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1 group"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-4 bg-white/60 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
              />
              <span
                className={`block h-px w-4 bg-white/60 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''
                  }`}
              />
              <span
                className={`block h-px w-4 bg-white/60 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 border-t border-white/5' : 'max-h-0'
            }`}
        >
          <div className="px-5 py-4 space-y-3">
            <Link
              href="#leagues"
              className="block text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Leagues
            </Link>
            <Link
              href="#about"
              className="block text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="#join"
              className="block text-xs font-medium text-zinc-300 hover:text-white transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}