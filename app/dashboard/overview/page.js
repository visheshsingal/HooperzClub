'use client';

import { useMemo } from 'react';
import { useDashboard } from '../dashboard-context';

export default function OverviewPage() {
  const { events, registeredTeams, joinedEvents } = useDashboard();

  const organizedCount = events.length;
  const activeCount = events.filter((event) => new Date(event.start) >= new Date()).length;
  const joinedCount = joinedEvents.length;
  const playedCount = registeredTeams.reduce((sum, team) => sum + team.players.length, 0);

  const recentEvents = useMemo(
    () => events.slice(0, 4),
    [events]
  );

  return (
    <div className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Dashboard overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your tournament control center</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Track how many events you organized, active tournaments, squad signups, and match participation in one premium panel.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Organized</p>
          <p className="mt-4 text-4xl font-semibold text-white">{organizedCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Active</p>
          <p className="mt-4 text-4xl font-semibold text-white">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Joined</p>
          <p className="mt-4 text-4xl font-semibold text-white">{joinedCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Played</p>
          <p className="mt-4 text-4xl font-semibold text-white">{playedCount}</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-[#141414] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recent events</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Latest tournaments</h2>
          </div>
          <span className="rounded-full bg-[#7f2b2b]/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">Live overview</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {recentEvents.map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-[#141414] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{event.sport}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{event.name}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>{event.type}</span>
                <span>•</span>
                <span>{event.teams} teams</span>
                <span>•</span>
                <span>{event.start}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
