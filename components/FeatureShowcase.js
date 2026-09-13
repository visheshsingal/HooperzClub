'use client';

import { useState } from 'react';
import Link from 'next/link';

const features = [
  {
    id: 'brackets',
    title: 'Automated Tournament Brackets',
    tag: 'League Engine',
    description:
      'Generate balanced single and double elimination fixtures in seconds. Live scoring, automated round progression, and instant bracket publishing for organizers and players.',
    highlights: ['Single & Double Elimination', 'Automated Seeding & Bye Allocation', 'Live Court-side Scorekeeping', 'Public Shareable Bracket Link'],
    preview: {
      type: 'bracket',
      match1: { teamA: 'Delhi Raptors', scoreA: '68', teamB: 'Northside Ballers', scoreB: '61', winner: 'A' },
      match2: { teamA: 'South City Wolves', scoreA: '54', teamB: 'Cyber Hoopers', scoreB: '59', winner: 'B' },
      final: { teamA: 'Delhi Raptors', scoreA: '72', teamB: 'Cyber Hoopers', scoreB: '70', winner: 'A' },
    },
  },
  {
    id: 'courts',
    title: 'Court Discovery & Instant Booking',
    tag: 'Facilities',
    description:
      'Explore verified basketball venues in your city. Filter by authentic wooden hardwood, outdoor asphalt, LED floodlights, and professional hoop specifications.',
    highlights: ['Interactive Court Availability Calendar', 'Indoor Hardwood & Outdoor Streetball', 'Floodlight & Locker Room Filters', 'Instant Slot Confirmation'],
    preview: {
      type: 'court',
      courtName: 'Hardwood Arena Pro Court 1',
      city: 'Gurugram, Sector 43',
      specs: 'Indoor Oak Hardwood • 10ft Breakaway Rims • FIBA Lines',
      rating: '4.9 ★ (128 reviews)',
      slots: ['06:00 - 08:00 AM', '05:00 - 07:00 PM', '07:30 - 09:30 PM (Prime)'],
    },
  },
  {
    id: 'squad',
    title: 'Squad & Roster Management',
    tag: 'Teams',
    description:
      'Assemble your 3v3 or 5v5 lineup. Assign jersey numbers, manage captain permissions, confirm match availability, and register for tournaments together.',
    highlights: ['Instant Squad Invite Links', 'Starting 5 & Bench Lineups', 'Team Win/Loss Analytics', 'Tournament Roster Verification'],
    preview: {
      type: 'squad',
      squadName: 'Redline Warriors 3v3',
      record: '18 Wins • 3 Losses',
      roster: [
        { name: 'Karan V.', pos: 'PG', num: '#7', ppg: '18.4' },
        { name: 'Sameer K.', pos: 'SG', num: '#11', ppg: '21.2' },
        { name: 'Arjun D.', pos: 'C', num: '#34', ppg: '14.8' },
        { name: 'Rahul M.', pos: 'SF (Sub)', num: '#23', ppg: '9.6' },
      ],
    },
  },
  {
    id: 'stats',
    title: 'Verified Hooper Cards & Leaderboards',
    tag: 'Player Profile',
    description:
      'Every bucket, assist, and block in sanctioned games builds your official Hooperz profile. Earn MVP badges, track career milestones, and climb city leaderboards.',
    highlights: ['Verified In-Game Stats (PPG, APG, RPG)', 'City & Division Leaderboards', 'Match MVP Badges & Accolades', 'Official Player Pass'],
    preview: {
      type: 'player',
      name: 'Aditya "Clutch" Sharma',
      position: 'Point Guard • Delhi Region',
      rating: 'OVR 91',
      stats: [
        { label: 'PPG', val: '22.6' },
        { label: 'APG', val: '7.8' },
        { label: '3PT%', val: '41.2%' },
        { label: 'MVPs', val: '6' },
      ],
    },
  },
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState('brackets');
  const activeFeature = features.find((f) => f.id === activeTab) || features[0];

  return (
    <section className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Built For The Game</p>
            <h2 className="mt-4 font-cursive text-5xl text-black md:text-6xl lg:text-7xl font-normal">
              Everything your basketball game demands.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-black/65 md:text-base">
            From casual pickup runs at sunrise to high-stakes weekend championship finals, Hooperzclub powers every possession.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-black/10 pb-4">
          {features.map((feat) => {
            const isActive = activeTab === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition duration-200 ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'bg-black/5 text-black/70 hover:bg-black/10 hover:text-black'
                }`}
              >
                {feat.title}
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Display */}
        <div className="mt-8 grid items-center gap-10 rounded-[36px] border border-black/10 bg-[#f8f8f8] p-8 md:p-12 lg:grid-cols-12">
          {/* Left: Info */}
          <div className="lg:col-span-6">
            <span className="inline-flex rounded-full bg-red-600/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
              {activeFeature.tag}
            </span>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.05em] text-black md:text-4xl">
              {activeFeature.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-black/70">
              {activeFeature.description}
            </p>

            <div className="mt-6 space-y-3">
              {activeFeature.highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-black/80">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition hover:bg-red-500"
              >
                Get Started
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center text-xs font-bold uppercase tracking-[0.15em] text-black/80 hover:text-red-600"
              >
                Learn More →
              </Link>
            </div>
          </div>

          {/* Right: Rich Interactive Visual Preview */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-black/15 bg-black p-6 text-white shadow-2xl">
              {/* Bracket Preview */}
              {activeFeature.preview.type === 'bracket' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">Live Tournament Bracket</span>
                    <span className="rounded bg-red-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">Championship Round</span>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Semifinal 1</div>
                      <div className="mt-2 flex items-center justify-between text-sm font-semibold">
                        <span className="text-white">🏆 {activeFeature.preview.match1.teamA}</span>
                        <span className="font-mono text-red-400">{activeFeature.preview.match1.scoreA}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm font-semibold text-white/50">
                        <span>{activeFeature.preview.match1.teamB}</span>
                        <span className="font-mono">{activeFeature.preview.match1.scoreB}</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Semifinal 2</div>
                      <div className="mt-2 flex items-center justify-between text-sm font-semibold text-white/50">
                        <span>{activeFeature.preview.match2.teamA}</span>
                        <span className="font-mono">{activeFeature.preview.match2.scoreA}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                        <span className="text-white">🏆 {activeFeature.preview.match2.teamB}</span>
                        <span className="font-mono text-red-400">{activeFeature.preview.match2.scoreB}</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 to-black p-4">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-red-400">
                        <span>Grand Finals (Final Score)</span>
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] text-white">Winner Decided</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-base font-bold">
                        <span className="text-white">👑 {activeFeature.preview.final.teamA}</span>
                        <span className="font-mono text-xl text-red-400">{activeFeature.preview.final.scoreA}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm font-semibold text-white/50">
                        <span>{activeFeature.preview.final.teamB}</span>
                        <span className="font-mono">{activeFeature.preview.final.scoreB}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Court Preview */}
              {activeFeature.preview.type === 'court' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">Court Status</span>
                    <span className="text-xs text-amber-400">{activeFeature.preview.rating}</span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-lg font-bold text-white">{activeFeature.preview.courtName}</div>
                    <div className="text-xs text-white/60">📍 {activeFeature.preview.city}</div>
                    <div className="mt-3 rounded-lg bg-white/5 p-2.5 text-xs text-white/80">
                      {activeFeature.preview.specs}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Available Slots Today</div>
                    <div className="mt-2 space-y-2">
                      {activeFeature.preview.slots.map((slot, i) => (
                        <div
                          key={slot}
                          className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold ${
                            i === 1
                              ? 'border border-red-500/40 bg-red-600/20 text-white'
                              : 'bg-white/5 text-white/80'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold text-red-400">Book Slot</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Squad Preview */}
              {activeFeature.preview.type === 'squad' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">Squad Roster</span>
                    <span className="text-xs font-bold text-emerald-400">{activeFeature.preview.record}</span>
                  </div>

                  <div className="text-xl font-black text-white">{activeFeature.preview.squadName}</div>

                  <div className="space-y-2">
                    {activeFeature.preview.roster.map((player) => (
                      <div
                        key={player.name}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-red-400">{player.num}</span>
                          <span className="font-semibold text-white">{player.name}</span>
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/60">{player.pos}</span>
                        </div>
                        <div className="font-mono text-white/80">
                          {player.ppg} <span className="text-[9px] text-white/40">PPG</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Player Preview */}
              {activeFeature.preview.type === 'player' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">Official Player Card</span>
                    <span className="rounded-full bg-red-600 px-3 py-0.5 text-xs font-black text-white">
                      {activeFeature.preview.rating}
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-white">{activeFeature.preview.name}</div>
                    <div className="text-xs text-white/60">{activeFeature.preview.position}</div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {activeFeature.preview.stats.map((st) => (
                      <div key={st.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <div className="font-mono text-lg font-black text-red-400">{st.val}</div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/50">{st.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center text-xs font-semibold text-emerald-400">
                    ✓ Verified Hooperzclub Pro-Am Eligible
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
