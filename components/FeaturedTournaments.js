'use client';

import { useState } from 'react';
import Link from 'next/link';

const tournaments = [
  {
    id: 1,
    title: 'Delhi NCR Streetball Classic 2026',
    format: '3v3 Open',
    category: '3v3',
    city: 'New Delhi • Siri Fort Sports Complex',
    date: 'Oct 12 - 14, 2026',
    prizePool: '₹75,000 Cash Pool',
    entryFee: '₹1,500 / squad',
    teamsRegistered: 14,
    maxTeams: 16,
    status: 'Fast Filling',
    level: 'Competitive / Pro-Am',
    accentColor: 'from-amber-500/20 to-transparent',
  },
  {
    id: 2,
    title: 'Bangalore Hardwood Cup Season 4',
    format: '5v5 Full Court',
    category: '5v5',
    city: 'Bangalore • Kanteerava Indoor Stadium',
    date: 'Oct 20 - 28, 2026',
    prizePool: '₹1,50,000 + Championship Rings',
    entryFee: '₹3,500 / squad',
    teamsRegistered: 10,
    maxTeams: 12,
    status: 'Registration Open',
    level: 'Elite Division',
    accentColor: 'from-red-600/20 to-transparent',
  },
  {
    id: 3,
    title: 'Mumbai Sunset Asphalt Hoops Run',
    format: '3v3 Streetball',
    category: '3v3',
    city: 'Mumbai • Bandra Reclamation Courts',
    date: 'Every Saturday Evening',
    prizePool: 'Weekly Cash + Merch',
    entryFee: '₹500 / player',
    teamsRegistered: 24,
    maxTeams: 24,
    status: 'Waitlist Open',
    level: 'Open for All',
    accentColor: 'from-orange-500/20 to-transparent',
  },
  {
    id: 4,
    title: 'Hyderabad Rising Stars 5v5 Championship',
    format: '5v5 Youth & College',
    category: '5v5',
    city: 'Hyderabad • Gachibowli Indoor Arena',
    date: 'Nov 05 - 08, 2026',
    prizePool: '₹60,000 + Scouting Showcase',
    entryFee: '₹2,000 / squad',
    teamsRegistered: 8,
    maxTeams: 16,
    status: 'Registration Open',
    level: 'Under 23 Division',
    accentColor: 'from-blue-600/20 to-transparent',
  },
];

export default function FeaturedTournaments() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? tournaments : tournaments.filter((t) => t.category === filter);

  return (
    <section className="bg-black py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Sanctioned Tournaments
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.07em] text-white md:text-5xl lg:text-6xl">
              The Tournament Circuit.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Events' },
              { id: '3v3', label: '3v3 Streetball' },
              { id: '5v5', label: '5v5 Full Court' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  filter === tab.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {filtered.map((t) => {
            const progress = Math.round((t.teamsRegistered / t.maxTeams) * 100);
            return (
              <div
                key={t.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/50"
              >
                {/* Subtle top glow */}
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${t.accentColor} pointer-events-none`} />

                <div className="relative">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                      {t.format}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                        t.status === 'Fast Filling'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : t.status === 'Waitlist Open'
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white group-hover:text-red-400 transition-colors">
                    {t.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-white/65">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{t.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{t.date}</span>
                    </div>
                  </div>

                  {/* Prize pool callout */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Prize & Perks</div>
                    <div className="mt-1 text-base font-black text-white">{t.prizePool}</div>
                    <div className="text-xs text-white/50">{t.entryFee} • {t.level}</div>
                  </div>

                  {/* Registered teams progress */}
                  <div className="mt-5">
                    <div className="flex justify-between text-[11px] font-semibold text-white/60">
                      <span>Squad Slots</span>
                      <span className="font-mono text-white/90">
                        {t.teamsRegistered} / {t.maxTeams} Teams Locked
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-red-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                    FIBA Rules Apply
                  </span>
                  <Link
                    href="/signup"
                    className="inline-flex items-center rounded-full bg-red-600 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
                  >
                    Register Squad →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all tournaments footer link */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Explore All Tournaments & Leagues
          </Link>
        </div>
      </div>
    </section>
  );
}
