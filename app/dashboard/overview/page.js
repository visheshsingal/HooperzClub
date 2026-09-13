'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useDashboard } from '../dashboard-context';
import {
  Card,
  StatCard,
  FlowStep,
  QuickAction,
  Badge,
  SectionTitle,
  Button,
  EmptyState,
} from '../../../components/dashboard/ui';

export default function OverviewPage() {
  const { events, joinedEvents, currentUser } = useDashboard();

  const activeCount = events.filter((event) => new Date(event.start) >= new Date()).length;
  const joinedCount = joinedEvents.length;
  const hasJoined = joinedCount > 0;

  const recentEvents = useMemo(() => events.slice(0, 4), [events]);

  const firstName = currentUser?.name?.split(' ')[0] || 'Player';

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-r from-white via-red-50 to-white p-8 shadow-sm sm:p-10">
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">
            Welcome back
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Hey, {firstName} 👋
          </h1>
          <p className="mt-2.5 max-w-xl text-sm text-zinc-600">
            Explore events, register in seconds, and stay connected with the local basketball scene.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/dashboard/events" variant="primary">
              Browse events
            </Button>
            {hasJoined && (
              <Button href="/dashboard/connect" variant="secondary">
                Meet players
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Registered events"
          value={joinedCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          }
        />
        <StatCard
          label="Open events"
          value={activeCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <SectionTitle label="Getting started" title="Your journey" />
          <p className="mt-2 text-sm text-zinc-600">
            Follow these steps to get the most out of Hooperz Club.
          </p>
          <div className="mt-6 space-y-3">
            <FlowStep
              step={1}
              title="Browse events"
              description="Check what is happening in your city and pick the ones you want"
              href="/dashboard/events"
              completed={hasJoined}
              active={!hasJoined}
            />
            <FlowStep
              step={2}
              title="Register"
              description="Sign up directly for an event in a few clicks"
              href="/dashboard/events"
              completed={hasJoined}
              active={hasJoined}
            />
            <FlowStep
              step={3}
              title="Connect with players"
              description="Meet nearby athletes and build your local circle"
              href="/dashboard/connect"
              completed={false}
              active={false}
            />
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <SectionTitle label="Shortcuts" title="Quick actions" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="Browse events"
              subtitle={`${activeCount} active tournament${activeCount !== 1 ? 's' : ''}`}
              href="/dashboard/events"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              }
            />
            <QuickAction
              title="Connect players"
              subtitle="Meet local athletes"
              href="/dashboard/connect"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM3 20a4 4 0 018 0v1H3zm10 0a4 4 0 018 0v1h-8" />
                </svg>
              }
            />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <SectionTitle label="Live now" title="Recent tournaments" />
          <Button href="/dashboard/events" variant="ghost" className="text-red-600 hover:text-red-500">
            View all →
          </Button>
        </div>

        {recentEvents.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No events published yet"
              description="Check back soon for upcoming Basketball events hosted by Hooperzclub Admins!"
              action={
                <Button href="/dashboard/events" variant="primary">
                  Browse events
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href="/dashboard/events"
                className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs transition duration-150 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-lg bg-zinc-900 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    {event.sport || 'Basketball'}
                  </span>
                  {event.fee > 0 ? (
                    <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-bold text-zinc-700">₹{event.fee}</span>
                  ) : (
                    <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Free</span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-zinc-950 group-hover:text-red-600 transition duration-150">
                  {event.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-6-5.6-6-10a6 6 0 1112 0c0 4.4-6 10-6 10z" />
                      <circle cx="12" cy="11" r="2" />
                    </svg>
                    {event.location || 'Location TBD'}
                  </span>
                  <span>•</span>
                  <span>{event.teams} teams</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
