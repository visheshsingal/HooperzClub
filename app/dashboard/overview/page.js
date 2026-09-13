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
  const { events, registeredTeams, joinedEvents, currentUser } = useDashboard();

  const organizedCount = events.filter(
    (event) => event.createdBy === currentUser?.name
  ).length;
  const activeCount = events.filter((event) => new Date(event.start) >= new Date()).length;
  const joinedCount = joinedEvents.length;
  const teamCount = registeredTeams.length;

  const hasTeams = teamCount > 0;
  const hasJoined = joinedCount > 0;
  const hasOrganized = organizedCount > 0;

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
            Build your squad, join tournaments, and organize your own events — all completely free.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {!hasTeams && (
              <Button href="/dashboard/teams" variant="primary">
                Create your first squad
              </Button>
            )}
            {hasTeams && !hasJoined && (
              <Button href="/dashboard/events" variant="primary">
                Browse events
              </Button>
            )}
            {(hasTeams || hasJoined || hasOrganized) && (
              <Button href="/dashboard/organize" variant="secondary">
                Organize a tournament
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="My squads"
          value={teamCount}
          accent={!hasTeams}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          }
        />
        <StatCard
          label="Joined events"
          value={joinedCount}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          }
        />
        <StatCard
          label="Organized"
          value={organizedCount}
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
              title="Create a squad"
              description="Register your team with player names"
              href="/dashboard/teams"
              completed={hasTeams}
              active={!hasTeams}
            />
            <FlowStep
              step={2}
              title="Join an event"
              description="Browse tournaments and apply with your squad"
              href="/dashboard/events"
              completed={hasJoined}
              active={hasTeams && !hasJoined}
            />
            <FlowStep
              step={3}
              title="Organize a tournament"
              description="Create events & auto-generate fixtures for free"
              href="/dashboard/organize"
              completed={hasOrganized}
              active={hasTeams && hasJoined && !hasOrganized}
            />
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <SectionTitle label="Shortcuts" title="Quick actions" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <QuickAction
              title="Manage squads"
              subtitle={`${teamCount} squad${teamCount !== 1 ? 's' : ''} registered`}
              href="/dashboard/teams"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
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
              title="Create event"
              subtitle="Free to publish"
              href="/dashboard/organize"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              }
            />
            <QuickAction
              title="Connect players"
              subtitle="Meet local squads"
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
              title="No events yet"
              description="Be the first to organize a tournament or check back later."
              action={
                <Button href="/dashboard/organize" variant="primary">
                  Create an event
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
                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition duration-150 hover:border-zinc-300 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="red">{event.sport}</Badge>
                  {event.fee > 0 ? (
                    <span className="text-xs text-zinc-500">₹{event.fee}</span>
                  ) : (
                    <Badge variant="green">Free</Badge>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-black group-hover:text-red-600 transition duration-150">
                  {event.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span>{event.location || 'Location TBD'}</span>
                  <span>•</span>
                  <span>{event.start || 'Date TBD'}</span>
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
