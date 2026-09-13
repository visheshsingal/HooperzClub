'use client';

import { useState } from 'react';
import { useDashboard } from '../dashboard-context';
import FixturesBracket from '../../../components/dashboard/FixturesBracket';
import {
  PageHeader,
  Card,
  Button,
  Select,
  Input,
  Badge,
  EmptyState,
  Toast,
} from '../../../components/dashboard/ui';

function getPlayersPerTeam(format) {
  if (format === '1v1') return 1;
  if (format === '2v2') return 2;
  if (format === '3v3') return 3;
  if (format === '5v5') return 5;
  return 3;
}

const BASKETBALL_POSITIONS = [
  { value: 'Point Guard (PG)', label: 'Point Guard (PG) - Playmaker / Ball Handler' },
  { value: 'Shooting Guard (SG)', label: 'Shooting Guard (SG) - Perimeter Shooter / Scorer' },
  { value: 'Small Forward (SF)', label: 'Small Forward (SF) - Versatile Wing / Driver' },
  { value: 'Power Forward (PF)', label: 'Power Forward (PF) - Post Scorer / Rebounder' },
  { value: 'Center (C)', label: 'Center (C) - Interior Rim Protector / Anchor' },
];

export default function EventsPage() {
  const {
    events,
    joinedEvents,
    joinEvent,
    discardJoin,
    currentUser,
  } = useDashboard();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [position, setPosition] = useState('Point Guard (PG)');
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formatFilter, setFormatFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [toast, setToast] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 4000);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const openRegisterModal = (event) => {
    setRegisteringEvent(event);
    setPlayerName(currentUser?.name || '');
    setPosition('Point Guard (PG)');
  };

  const closeRegisterModal = () => {
    setRegisteringEvent(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registeringEvent) return;

    setSubmitting(true);
    try {
      const result = await joinEvent(registeringEvent.id, position, playerName);
      showToast(
        `✓ Registered as ${position}! You have been assigned to ${result.assignedTeam || 'a squad'}.`
      );
      closeRegisterModal();
    } catch (err) {
      showToast(err.message || 'Failed to register.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const locations = [
    'All',
    ...Array.from(new Set(events.map((event) => event.location || event.venue).filter(Boolean))),
  ];

  const filteredEvents = events
    .filter((event) => formatFilter === 'All' || (event.format || '3v3') === formatFilter)
    .filter(
      (event) =>
        locationFilter === 'All' || (event.location || event.venue) === locationFilter
    )
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.start || a.createdAt || 0);
      const dateB = new Date(b.start || b.createdAt || 0);
      return dateB - dateA;
    });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Basketball Tournaments"
        title="Official Basketball Events & Fixtures"
        description="Browse official Basketball tournaments, register your position, get randomly assigned to a squad, and view live match brackets."
        action={<Badge variant="red">Basketball Only</Badge>}
      />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Basketball Format"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
          >
            <option value="All">All Formats (1v1, 2v2, 3v3, 5v5)</option>
            <option value="1v1">1v1 Isolation</option>
            <option value="2v2">2v2 Half-Court</option>
            <option value="3v3">3v3 Streetball</option>
            <option value="5v5">5v5 Full Court</option>
          </Select>

          <Select
            label="Venue Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-8">
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No Basketball Events Found"
              description="There are currently no active Basketball tournaments matching your filters. Check back soon for upcoming Admin published events!"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredEvents.map((event) => {
                const joined = joinedEvents.some((j) => j.eventId === event.id);
                const eventJoinedCount = joinedEvents.filter((j) => j.eventId === event.id).length;
                const teamCount = Math.max(2, Number(event.teamCount || event.teams) || 4);
                const playersPerTeam = getPlayersPerTeam(event.format || '3v3');
                const maxCapacity = teamCount * playersPerTeam;
                const isFull = eventJoinedCount >= maxCapacity;

                return (
                  <article
                    key={event.id}
                    className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md"
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-500 to-red-700" />
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                          Basketball {event.format ? `(${event.format})` : '(3v3)'}
                        </span>
                        <div className="flex gap-2">
                          {joined && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              ✓ Registered
                            </span>
                          )}
                          {isFull && !joined && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                              FULL / Closed
                            </span>
                          )}
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold text-zinc-700">
                            {event.fee > 0 ? `$${event.fee}` : 'Free Entry'}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-black transition group-hover:text-red-600">
                        {event.name}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-sm text-zinc-600">
                        <p className="flex items-center gap-1.5">
                          <span>📍</span> {event.location || event.venue || 'Venue TBD'}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span>📅</span>{' '}
                          {event.start ? new Date(event.start).toLocaleString() : 'Date TBD'}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                          <span>🏀</span> {teamCount} Teams • {playersPerTeam} Players/Team • Capacity: {eventJoinedCount}/{maxCapacity} Players
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col gap-2">
                        {joined ? (
                          <Button
                            variant="secondary"
                            className="w-full justify-center"
                            onClick={() => openEventDetails(event)}
                          >
                            View Fixtures & Squad →
                          </Button>
                        ) : isFull ? (
                          <button
                            disabled
                            className="w-full rounded-2xl bg-zinc-100 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 cursor-not-allowed"
                          >
                            Event Full (Max Capacity Reached)
                          </button>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-full justify-center"
                            onClick={() => openRegisterModal(event)}
                          >
                            Register & Join Squad →
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Position Selection Registration Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="rounded-full bg-red-600 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white">
                  {registeringEvent.format || '3v3'} Basketball
                </span>
                <h3 className="mt-2 text-xl font-bold text-black">{registeringEvent.name}</h3>
                <p className="text-xs text-zinc-500">Select your position to be randomly assigned to an open squad.</p>
              </div>
              <button
                type="button"
                onClick={closeRegisterModal}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Player Name</label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your Name / Gamertag"
                  className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Playing Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                >
                  {BASKETBALL_POSITIONS.map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-3 text-xs text-red-700 space-y-1">
                <p className="font-bold">🎲 Random Team Assignment</p>
                <p>You will be randomly assigned to an open Team (Team 1, Team 2, etc.) for this tournament.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeRegisterModal}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-red-500 disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details, Roster & Match Fixtures Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-200 p-6 bg-zinc-50">
              <div>
                <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                  Basketball ({selectedEvent.format || '3v3'})
                </span>
                <h2 className="mt-2 text-2xl font-bold text-black">{selectedEvent.name}</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Published by Admin • 📍 {selectedEvent.location || 'TBD'} • 📅{' '}
                  {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : 'TBD'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEventDetails}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-200 hover:text-black"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6 space-y-6">
              {/* Grouped Team Roster View */}
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Team Squad Rosters ({joinedEvents.filter((j) => j.eventId === selectedEvent.id).length} Registered Players)
                  </h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from(
                    { length: Math.max(2, Number(selectedEvent.teamCount || selectedEvent.teams) || 4) },
                    (_, i) => {
                      const teamName = `Team ${i + 1}`;
                      const teamPlayers = joinedEvents.filter(
                        (j) => j.eventId === selectedEvent.id && j.assignedTeam === teamName
                      );
                      const playersPerTeam = getPlayersPerTeam(selectedEvent.format || '3v3');

                      return (
                        <div
                          key={teamName}
                          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-2"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                            <span className="font-extrabold text-xs text-red-600 uppercase tracking-wider">
                              {teamName}
                            </span>
                            <span className="text-[9px] font-bold rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
                              {teamPlayers.length}/{playersPerTeam} Players
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {teamPlayers.length === 0 ? (
                              <p className="text-[11px] italic text-zinc-400">No players assigned yet</p>
                            ) : (
                              teamPlayers.map((player, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="flex items-center justify-between text-xs bg-zinc-50 p-2 rounded-xl border border-zinc-100"
                                >
                                  <span className="font-semibold text-zinc-900">
                                    {player.participantName}
                                  </span>
                                  <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                                    {player.position || 'Guard'}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Tournament Fixtures Component */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <FixturesBracket fixtures={selectedEvent.fixtures || []} isAdmin={false} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4">
                {joinedEvents.some((j) => j.eventId === selectedEvent.id) && (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await discardJoin(selectedEvent.id);
                      showToast('Registration withdrawn.');
                      closeEventDetails();
                    }}
                  >
                    Withdraw Registration
                  </Button>
                )}

                <Button variant="secondary" onClick={closeEventDetails}>
                  Close Window
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={typeof toast === 'string' ? toast : toast.msg}
          type={typeof toast === 'string' ? 'success' : toast.type}
          onClose={() => setToast('')}
        />
      )}
    </div>
  );
}
