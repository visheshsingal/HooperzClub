'use client';

import Link from 'next/link';

const steps = [
  {
    step: '01',
    badge: 'Step 1: The Roster',
    title: 'Create Your Hooper Profile',
    text: 'Sign up in under 60 seconds. Set your playing position (PG, SG, SF, PF, C), preferred local courts, and basketball background.',
    bulletPoints: ['Personalized Hooper Card', 'Position & skill preferences', 'City court network connectivity'],
    icon: '🏀',
  },
  {
    step: '02',
    badge: 'Step 2: Squad Up',
    title: 'Drop In or Build Your Squad',
    text: 'Hop into open pickup sessions running nearby or assemble your roster with friends for competitive 3v3 and 5v5 tournaments.',
    bulletPoints: ['Instant squad share links', 'Roster & lineup management', 'Court slot reservations'],
    icon: '👥',
  },
  {
    step: '03',
    badge: 'Step 3: Own The Court',
    title: 'Compete, Score & Climb',
    text: 'Check in on game day. Experience automated tournament brackets, official scoring, real-time standings, and earn league MVP honors.',
    bulletPoints: ['Live bracket progression', 'Verified career stats', 'Tournament prize payouts'],
    icon: '🏆',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-black/10 bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">The Gameplan</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.07em] md:text-5xl lg:text-6xl">
            How to get on the hardwood.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-black/65">
            Three simple steps between you and your next competitive run. No chaotic chats, no ghost games.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative flex flex-col justify-between rounded-[32px] border border-black/10 bg-[#f9f9f9] p-8 transition duration-200 hover:-translate-y-1 hover:border-red-600/40 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black tracking-tighter text-black/20">{s.step}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-md">
                    {s.icon}
                  </div>
                </div>

                <div className="mt-6">
                  <span className="inline-block rounded-full bg-red-600/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-600">
                    {s.badge}
                  </span>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-black">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/70">{s.text}</p>
                </div>

                <ul className="mt-6 space-y-2.5 border-t border-black/10 pt-6">
                  {s.bulletPoints.map((bp) => (
                    <li key={bp} className="flex items-center gap-2 text-xs font-semibold text-black/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      {bp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/signup"
                  className="text-xs font-bold uppercase tracking-widest text-red-600 transition hover:text-black"
                >
                  Join This Flow →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
