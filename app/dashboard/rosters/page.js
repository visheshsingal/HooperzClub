'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDashboard } from '../dashboard-context';

function getPlayersPerTeam(format) {
  if (format === '1v1') return 1;
  if (format === '2v2') return 2;
  if (format === '3v3') return 3;
  if (format === '5v5') return 5;
  return 3;
}

export default function RostersPage() {
  const { events, joinedEvents, currentUser } = useDashboard();

  const defaultEventId = useMemo(() => {
    if (!events || events.length === 0) return null;
    const userJoined = joinedEvents.find(
      (j) => j.userId === currentUser?._id || j.participantName === currentUser?.name
    );
    if (userJoined) {
      const match = events.find((e) => e.id === userJoined.eventId || e._id === userJoined.eventId);
      if (match) return match.id || match._id;
    }
    return events[0].id || events[0]._id;
  }, [events, joinedEvents, currentUser]);

  const [selectedEventId, setSelectedEventId] = useState(defaultEventId);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'full'

  const currentEventId = selectedEventId || defaultEventId;
  const selectedEvent = useMemo(() => {
    return events.find((e) => (e.id || e._id) === currentEventId) || events[0] || null;
  }, [events, currentEventId]);

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
    for (let i = 1; i <= teamCount; i++) {
      const count = eventPlayers.filter((j) => j.assignedTeam === `Team ${i}`).length;
      if (count >= playersPerTeam) fullTeamsCount++;
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
      openSlots,
    };
  }, [selectedEvent, joinedEvents]);

  const teamsData = useMemo(() => {
    if (!selectedEvent) return [];
    const { teamCount, playersPerTeam, eventPlayers } = eventCalculations;

    const list = [];
    for (let i = 1; i <= teamCount; i++) {
      const teamName = `Team ${i}`;
      const players = eventPlayers.filter((j) => j.assignedTeam === teamName);
      const isFull = players.length >= playersPerTeam;
      const openCount = Math.max(0, playersPerTeam - players.length);

      let matchesStatus = true;
      if (filterStatus === 'full' && !isFull) matchesStatus = false;
      if (filterStatus === 'open' && isFull) matchesStatus = false;

      if (matchesStatus) {
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
  }, [selectedEvent, eventCalculations, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Sleek Minimal Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-red-600">
            Capacity & Lineups
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
            Squad Rosters
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Live player distribution and team capacity for sanctioned tournaments.
          </p>
        </div>

        {/* Event Selector Dropdown */}
        {events && events.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedEvent ? selectedEvent.id || selectedEvent._id : ''}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-900 shadow-2xs focus:border-red-500 focus:outline-none"
            >
              {events.map((evt) => (
                <option key={evt.id || evt._id} value={evt.id || evt._id}>
                  {evt.name} ({evt.format || '3v3'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sleek Single-Line Capacity Meter */}
      {selectedEvent && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-red-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                {selectedEvent.format || '3v3'}
              </span>
              <span className="font-bold text-zinc-900">
                {selectedEvent.name}
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500">
                {selectedEvent.location || 'Arena'}
              </span>
            </div>

            <div className="flex items-center gap-3 font-semibold text-zinc-700">
              <span>
                <strong className="text-zinc-900">{eventCalculations.totalPlayers}</strong> / {eventCalculations.totalCapacity} Players
              </span>
              <span className="text-zinc-300">|</span>
              <span className="text-emerald-700">
                {eventCalculations.fullTeamsCount} Full Squads
              </span>
              <span className="text-zinc-300">|</span>
              <span className="text-amber-700">
                {eventCalculations.openSlots} Open Slots
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500"
              style={{ width: `${eventCalculations.fillRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-xl bg-zinc-100 p-1">
          {[
            { id: 'all', label: 'All Squads' },
            { id: 'open', label: 'Open Slots' },
            { id: 'full', label: 'Full Squads' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-lg px-3.5 py-1 text-xs font-bold transition ${
                filterStatus === tab.id
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href="/dashboard/events"
          className="text-xs font-bold text-red-600 hover:underline"
        >
          View Tournament Details →
        </Link>
      </div>

      {/* Squad Cards Grid */}
      {teamsData.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center text-xs text-zinc-500">
          No squads matching the current filter.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamsData.map((team) => (
            <div
              key={team.teamName}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs transition hover:border-zinc-300 hover:shadow-xs"
            >
              <div className="space-y-3">
                {/* Team Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
                      {team.teamNumber}
                    </span>
                    <span className="text-xs font-bold text-zinc-900">
                      {team.teamName}
                    </span>
                  </div>

                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      team.isFull
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : team.players.length > 0
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {team.isFull
                      ? `Full (${team.players.length}/${team.playersPerTeam})`
                      : `${team.players.length}/${team.playersPerTeam} (${team.openCount} Open)`}
                  </span>
                </div>

                {/* Player List */}
                <div className="space-y-1.5">
                  {team.players.map((player, pIdx) => {
                    const isMe =
                      player.userId === currentUser?._id ||
                      player.participantName === currentUser?.name;

                    return (
                      <div
                        key={pIdx}
                        className={`flex items-center justify-between rounded-lg p-2 text-xs transition ${
                          isMe ? 'bg-red-50/80 border border-red-200' : 'bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-white text-[10px] font-bold text-zinc-700 border border-zinc-200">
                            {player.participantName?.charAt(0)?.toUpperCase() || 'P'}
                          </span>
                          <span className="truncate font-semibold text-zinc-900">
                            {player.participantName}
                          </span>
                          {isMe && (
                            <span className="rounded bg-red-600 px-1 py-0.2 text-[8px] font-bold text-white uppercase">
                              You
                            </span>
                          )}
                        </div>

                        <span className="text-[9px] font-semibold text-zinc-500">
                          {player.position ? player.position.split(' ')[0] : 'Guard'}
                        </span>
                      </div>
                    );
                  })}

                  {/* Clean Dotted Open Slots */}
                  {Array.from({ length: team.openCount }, (_, emptyIdx) => (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="flex items-center justify-between rounded-lg border border-dashed border-zinc-200 p-2 text-xs text-zinc-400"
                    >
                      <span className="text-[11px] font-medium text-zinc-400">
                        + Open Player Slot
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-300 font-mono">
                        Available
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimal Card Footer */}
              <div className="mt-4 pt-2 border-t border-zinc-100">
                <Link
                  href="/dashboard/events"
                  className="block text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-red-600 transition"
                >
                  {team.isFull ? 'View Event →' : 'Register Here →'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
