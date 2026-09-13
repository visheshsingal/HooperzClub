'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDashboard } from '../dashboard-context';
import {
  PageHeader,
  Card,
  StatCard,
  Badge,
  Button,
} from '../../../components/dashboard/ui';

function getPlayersPerTeam(format) {
  if (format === '1v1') return 1;
  if (format === '2v2') return 2;
  if (format === '3v3') return 3;
  if (format === '5v5') return 5;
  return 3;
}

export default function RostersPage() {
  const { events, joinedEvents, currentUser } = useDashboard();

  // Pick first event or user's joined event as default
  const defaultEventId = useMemo(() => {
    if (!events || events.length === 0) return null;
    const userJoined = joinedEvents.find((j) => j.userId === currentUser?._id || j.participantName === currentUser?.name);
    if (userJoined) {
      const match = events.find((e) => e.id === userJoined.eventId || e._id === userJoined.eventId);
      if (match) return match.id || match._id;
    }
    return events[0].id || events[0]._id;
  }, [events, joinedEvents, currentUser]);

  const [selectedEventId, setSelectedEventId] = useState(defaultEventId);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'full'
  const [searchQuery, setSearchQuery] = useState('');

  // Active event
  const currentEventId = selectedEventId || defaultEventId;
  const selectedEvent = useMemo(() => {
    return events.find((e) => (e.id || e._id) === currentEventId) || events[0] || null;
  }, [events, currentEventId]);

  // Calculations for active event
  const eventCalculations = useMemo(() => {
    if (!selectedEvent) {
      return {
        teamCount: 4,
        playersPerTeam: 3,
        totalCapacity: 12,
        eventPlayers: [],
        totalPlayers: 0,
        fillRate: 0,
        fullTeamsCount: 0,
        openTeamsCount: 0,
        openSlots: 12,
      };
    }

    const teamCount = Math.max(2, Number(selectedEvent.teamCount || selectedEvent.teams) || 4);
    const playersPerTeam = getPlayersPerTeam(selectedEvent.format || '3v3');
    const totalCapacity = teamCount * playersPerTeam;

    const eventPlayers = joinedEvents.filter(
      (j) => j.eventId === selectedEvent.id || j.eventId === selectedEvent._id
    );
    const totalPlayers = eventPlayers.length;
    const fillRate = Math.min(100, Math.round((totalPlayers / totalCapacity) * 100)) || 0;

    let fullTeamsCount = 0;
    let openTeamsCount = 0;

    for (let i = 1; i <= teamCount; i++) {
      const tName = `Team ${i}`;
      const count = eventPlayers.filter((j) => j.assignedTeam === tName).length;
      if (count >= playersPerTeam) {
        fullTeamsCount++;
      } else {
        openTeamsCount++;
      }
    }

    const openSlots = Math.max(0, totalCapacity - totalPlayers);

    return {
      teamCount,
      playersPerTeam,
      totalCapacity,
      eventPlayers,
      totalPlayers,
      fillRate,
      fullTeamsCount,
      openTeamsCount,
      openSlots,
    };
  }, [selectedEvent, joinedEvents]);

  // Teams list with filter & search
  const teamsData = useMemo(() => {
    if (!selectedEvent) return [];
    const { teamCount, playersPerTeam, eventPlayers } = eventCalculations;

    const list = [];
    for (let i = 1; i <= teamCount; i++) {
      const teamName = `Team ${i}`;
      const players = eventPlayers.filter((j) => j.assignedTeam === teamName);
      const isFull = players.length >= playersPerTeam;
      const openCount = Math.max(0, playersPerTeam - players.length);

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        teamName.toLowerCase().includes(query) ||
        players.some(
          (p) =>
            p.participantName?.toLowerCase().includes(query) ||
            p.position?.toLowerCase().includes(query)
        );

      // Status filter
      let matchesStatus = true;
      if (filterStatus === 'full' && !isFull) matchesStatus = false;
      if (filterStatus === 'open' && isFull) matchesStatus = false;

      if (matchesSearch && matchesStatus) {
        list.push({
          teamNumber: i,
          teamName,
          players,
          isFull,
          openCount,
          playersPerTeam,
        });
      }
    }

    return list;
  }, [selectedEvent, eventCalculations, filterStatus, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        label="Section 4 • Live Capacity Breakdown"
        title="Squad Rosters & Current Player Allocations"
        description="Monitor real-time team assignments, squad capacities, open player slots, and tournament roster distributions across all sanctioned events."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Live Sync Active
            </span>
            <Link href="/dashboard/events">
              <Button variant="primary">Browse Events Hub</Button>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Allocated Players"
          value={`${eventCalculations.totalPlayers} / ${eventCalculations.totalCapacity}`}
          accent={true}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Full Squads (100% Locked)"
          value={`${eventCalculations.fullTeamsCount} / ${eventCalculations.teamCount}`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-emerald-600">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Open Player Slots"
          value={`${eventCalculations.openSlots} Available`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-amber-500">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        />
        <StatCard
          label="Event Fill Capacity"
          value={`${eventCalculations.fillRate}%`}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-blue-600">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Event Selection & Filter Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Event Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Selected Event:
            </span>
            {events && events.length > 0 ? (
              <select
                value={selectedEvent ? selectedEvent.id || selectedEvent._id : ''}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {events.map((evt) => (
                  <option key={evt.id || evt._id} value={evt.id || evt._id}>
                    {evt.name || evt.title} ({evt.format || '3v3'}) • {evt.location || 'Court'}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm italic text-zinc-400">No events found</span>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-zinc-100 p-1">
              {[
                { id: 'all', label: 'All Squads' },
                { id: 'open', label: 'Open Slots' },
                { id: 'full', label: 'Locked & Full' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    filterStatus === tab.id
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search player or squad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 pl-8 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:outline-none"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
        </div>

        {/* Selected Event Context Bar */}
        {selectedEvent && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                  {selectedEvent.format || '3v3'}
                </span>
                <span className="font-bold text-zinc-900">
                  {selectedEvent.name || selectedEvent.title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-6-5.6-6-10a6 6 0 1112 0c0 4.4-6 10-6 10z" />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                  {selectedEvent.location || selectedEvent.venue || 'City Arena'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {selectedEvent.date || selectedEvent.start ? new Date(selectedEvent.start || selectedEvent.date).toLocaleDateString() : 'Upcoming'}
                </span>
                <span>•</span>
                <span>{eventCalculations.teamCount} Teams</span>
                <span>•</span>
                <span>{eventCalculations.playersPerTeam} Players / Team</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-bold text-zinc-900">
                  {eventCalculations.totalPlayers} / {eventCalculations.totalCapacity} Players
                </div>
                <div className="text-[10px] font-semibold text-zinc-500">
                  {eventCalculations.fillRate}% Capacity Filled
                </div>
              </div>
              <div className="h-2.5 w-32 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-red-600 transition-all duration-500"
                  style={{ width: `${eventCalculations.fillRate}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Squad Rosters Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              Live Squad Rosters ({teamsData.length} Teams Displayed)
            </h2>
            <p className="text-xs text-zinc-500">
              Click into events to register or change assigned player positions.
            </p>
          </div>
        </div>

        {teamsData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-zinc-900">No matching squads found</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Try adjusting your search query or switching your filter to &ldquo;All Squads&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamsData.map((team) => {
              const teamFillPercent = Math.round((team.players.length / team.playersPerTeam) * 100);

              return (
                <div
                  key={team.teamName}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    team.isFull
                      ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/40 to-white'
                      : team.players.length > 0
                      ? 'border-amber-200 bg-gradient-to-b from-amber-50/30 to-white'
                      : 'border-zinc-200 bg-white'
                  }`}
                >
                  <div>
                    {/* Team Header */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-xs font-black text-white shadow-xs">
                          {team.teamNumber}
                        </div>
                        <div>
                          <span className="text-sm font-black tracking-tight text-zinc-900">
                            {team.teamName}
                          </span>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                            Squad Slot #{team.teamNumber}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                          team.isFull
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : team.players.length > 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        {team.isFull
                          ? `Full (${team.players.length}/${team.playersPerTeam})`
                          : `${team.players.length}/${team.playersPerTeam} (${team.openCount} Open)`}
                      </span>
                    </div>

                    {/* Team Progress Mini Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                        <span>Squad Capacity</span>
                        <span className="font-mono">{teamFillPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            team.isFull
                              ? 'bg-emerald-500'
                              : team.players.length > 0
                              ? 'bg-amber-500'
                              : 'bg-zinc-300'
                          }`}
                          style={{ width: `${teamFillPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Player Allocations List */}
                    <div className="mt-4 space-y-2">
                      {team.players.map((player, pIdx) => {
                        const isMe =
                          player.userId === currentUser?._id ||
                          player.participantName === currentUser?.name;

                        return (
                          <div
                            key={pIdx}
                            className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                              isMe
                                ? 'border-red-300 bg-red-50/80 shadow-xs'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                  isMe
                                    ? 'bg-red-600 text-white'
                                    : 'bg-zinc-100 text-zinc-800'
                                }`}
                              >
                                {player.participantName?.charAt(0)?.toUpperCase() || 'P'}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                                  <span>{player.participantName}</span>
                                  {isMe && (
                                    <span className="rounded bg-red-600 px-1 py-0.2 text-[8px] font-extrabold uppercase text-white">
                                      YOU
                                    </span>
                                  )}
                                </p>
                                <p className="text-[9px] font-medium text-zinc-400">
                                  Roster #{pIdx + 1}
                                </p>
                              </div>
                            </div>

                            <span className="flex-shrink-0 rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[9px] font-extrabold text-red-600">
                              {player.position || 'Guard'}
                            </span>
                          </div>
                        );
                      })}

                      {/* Open Slots Visual Cards */}
                      {Array.from({ length: team.openCount }, (_, emptyIdx) => (
                        <div
                          key={`empty-${emptyIdx}`}
                          className="flex items-center justify-between rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-2.5 text-xs text-zinc-400"
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-[10px] text-zinc-400">
                              +
                            </span>
                            <div>
                              <p className="text-[11px] font-semibold text-zinc-500">
                                Open Slot #{team.players.length + emptyIdx + 1}
                              </p>
                              <p className="text-[9px] text-zinc-400">Ready for allocation</p>
                            </div>
                          </div>
                          <span className="rounded bg-zinc-200/60 px-1.5 py-0.5 text-[8px] font-bold uppercase text-zinc-500">
                            Open
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Footer */}
                  <div className="mt-5 border-t border-zinc-100 pt-3">
                    <Link
                      href="/dashboard/events"
                      className="block text-center text-[10px] font-bold uppercase tracking-wider text-red-600 transition hover:text-red-700"
                    >
                      {team.isFull ? 'View Matchup Details →' : 'Register for this Event →'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
