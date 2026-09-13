'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useDashboard } from '../dashboard-context';
import {
  StatCard,
  Button,
} from '../../../components/dashboard/ui';

export default function OverviewPage() {
  const { events, joinedEvents, currentUser } = useDashboard();

  const activeCount = events.filter((event) => new Date(event.start) >= new Date()).length;
  const joinedCount = joinedEvents.length;

  const recentEvents = useMemo(() => events.slice(0, 3), [events]);
  const firstName = currentUser?.name?.split(' ')[0] || 'Baller';

  return (
    <div className="space-y-6">
      {/* Sleek Minimal Welcome Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-red-600">
            Player Dashboard
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Track your tournament entries, review squad capacities, and prepare for tip-off.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/events">
            <Button variant="primary" className="text-xs font-bold uppercase tracking-wider py-2.5">
              Browse Tournaments →
            </Button>
          </Link>
          <Link href="/dashboard/rosters">
            <Button variant="secondary" className="text-xs font-bold uppercase tracking-wider py-2.5">
              Squad Rosters
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Sleek Metric Tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Enrolled Tournaments"
          value={joinedCount}
          accent={joinedCount > 0}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-red-600">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          }
        />
        <StatCard
          label="Active Competitions"
          value={activeCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-zinc-700">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          label="Playing Role"
          value={currentUser?.position ? currentUser.position.split(' ')[0] : 'Guard'}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-zinc-700">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column: Quick Action Hub (2/5) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Quick Shortcuts
            </h2>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/dashboard/events"
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition">
                    Browse Tournaments
                  </h3>
                  <p className="text-[11px] text-zinc-400">View upcoming 3v3 and 5v5 leagues</p>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-black">→</span>
            </Link>

            <Link
              href="/dashboard/rosters"
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-red-600 group-hover:text-white transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition">
                    Squad Rosters
                  </h3>
                  <p className="text-[11px] text-zinc-400">Live team allocations & capacity</p>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-black">→</span>
            </Link>

            <Link
              href="/dashboard/connect"
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-red-600 group-hover:text-white transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM3 20a4 4 0 018 0v1H3zm10 0a4 4 0 018 0v1h-8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition">
                    Connect Ballers
                  </h3>
                  <p className="text-[11px] text-zinc-400">Find teammates in your city</p>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-black">→</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-red-600 group-hover:text-white transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 group-hover:text-red-600 transition">
                    Player Profile
                  </h3>
                  <p className="text-[11px] text-zinc-400">Position & personal details</p>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-black">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Tournaments (3/5) */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Featured Competitions
            </h2>
            <Link href="/dashboard/events" className="text-xs font-bold text-red-600 hover:underline">
              View All ({events.length}) →
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
              <p className="text-xs font-semibold text-zinc-500">No tournaments scheduled right now.</p>
              <Link href="/dashboard/events" className="mt-2 inline-block text-xs font-bold text-red-600">
                Check Back Soon →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs transition hover:border-zinc-300 hover:shadow-xs sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-white">
                        {evt.format || '3v3'}
                      </span>
                      <h3 className="truncate text-sm font-bold text-zinc-950">
                        {evt.name}
                      </h3>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <svg className="h-3 w-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-6-5.6-6-10a6 6 0 1112 0c0 4.4-6 10-6 10z" />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                      {evt.location || 'Location TBD'}
                      <span>•</span>
                      <span>{evt.teams || evt.teamCount || 8} Teams</span>
                    </p>
                  </div>

                  <Link href="/dashboard/events" className="flex-shrink-0">
                    <button className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-bold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100">
                      Details →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
