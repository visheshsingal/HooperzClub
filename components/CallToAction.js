'use client';

import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.3),rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32 lg:px-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
          Get On The Floor
        </div>

        <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-black tracking-[-0.08em] text-white md:text-7xl lg:text-8xl">
          Own your game. <br />
          <span className="text-red-500">Claim your court.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-xl">
          Join thousands of ballers, squad captains, and tournament organizers. Free pickup games, sanctioned leagues, and prime court bookings await.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] text-white transition duration-200 hover:-translate-y-1 hover:bg-red-500 shadow-[0_10px_30px_rgba(220,38,38,0.4)]"
          >
            Create Free Account
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] text-white transition duration-200 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
          >
            Explore Leagues & Courts
          </Link>
        </div>

        {/* Perks micro-bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-wider text-white/50">
          <span className="flex items-center gap-2">
            <span className="text-red-500">✓</span> Instant Free Player Pass
          </span>
          <span className="flex items-center gap-2">
            <span className="text-red-500">✓</span> Automated Tournament Brackets
          </span>
          <span className="flex items-center gap-2">
            <span className="text-red-500">✓</span> Verified Court Slots
          </span>
        </div>
      </div>
    </section>
  );
}
