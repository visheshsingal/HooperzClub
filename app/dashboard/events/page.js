'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '../dashboard-context';
import FixturesBracket from '../../../components/dashboard/FixturesBracket';
import {
  PageHeader,
  Card,
  Button,
  Select,
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
  const [friends, setFriends] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formatFilter, setFormatFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [toast, setToast] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 4500);
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
    setFriends([]);
  };

  const closeRegisterModal = () => {
    setRegisteringEvent(null);
    setFriends([]);
  };

  const handleAddFriend = () => {
    if (!registeringEvent) return;
    const maxSquad = getPlayersPerTeam(registeringEvent.format || '3v3');
    if (1 + friends.length >= maxSquad) {
      showToast(`Max squad size is ${maxSquad} players for ${registeringEvent.format || '3v3'} format.`, 'error');
      return;
    }
    setFriends([...friends, { name: '', position: 'Shooting Guard (SG)' }]);
  };

  const handleRemoveFriend = (index) => {
    setFriends(friends.filter((_, i) => i !== index));
  };

  const handleFriendChange = (index, field, value) => {
    const updated = [...friends];
    updated[index][field] = value;
    setFriends(updated);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registeringEvent) return;

    setSubmitting(true);
    try {
      const validFriends = friends.filter((f) => f.name && f.name.trim());
      const result = await joinEvent(registeringEvent.id, position, playerName, validFriends);
      
      const totalCount = 1 + validFriends.length;
      showToast(
        `✓ Registered successfully! Assigned to ${result.assignedTeam || 'a squad'} with your squad of ${totalCount} player(s).`
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
        description="Browse official Basketball tournaments, register your squad/friends, get assigned to a team together, and view live match brackets."
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
                const fillPercent = Math.min(100, Math.round((eventJoinedCount / maxCapacity) * 100)) || 0;

                // Tournament Status Checks (Started / Completed / Closed)
                const isStarted = event.start && new Date(event.start) < new Date();
                const isClosed = event.status === 'In Progress' || event.status === 'Completed' || event.status === 'Closed';
                const registrationBlocked = isStarted || isClosed;

                return (
                  <article
                    key={event.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Top Badges Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-lg bg-zinc-900 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                            {event.format ? event.format.toUpperCase() : '3V3'}
                          </span>
                          <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                            Basketball
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {joined && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Registered
                            </span>
                          )}
                          {registrationBlocked ? (
                            <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                              Tournament Live
                            </span>
                          ) : isFull ? (
                            <span className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                              Full Capacity
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Open
                            </span>
                          )}
                          <span className="rounded-lg border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-800">
                            {event.fee > 0 ? `₹${event.fee}` : 'Free Entry'}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-zinc-950 transition group-hover:text-red-600">
                          {event.name}
                        </h3>
                        <p className="mt-0.5 text-[11px] font-medium text-zinc-400">
                          Sanctioned Hooperz League • Official Bracket Event
                        </p>
                      </div>

                      {/* Details with Crisp SVG Icons */}
                      <div className="space-y-2 text-xs text-zinc-600">
                        <div className="flex items-center gap-2.5">
                          <svg className="h-4 w-4 flex-shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 21s-6-5.6-6-10a6 6 0 1112 0c0 4.4-6 10-6 10z" />
                            <circle cx="12" cy="11" r="2" />
                          </svg>
                          <span className="truncate font-medium text-zinc-700">
                            {event.location || event.venue || 'Venue to be announced'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <svg className="h-4 w-4 flex-shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span className="font-medium text-zinc-700">
                            {event.start ? new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date & Time TBD'}
                          </span>
                        </div>
                      </div>

                      {/* Modern Capacity Meter */}
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-semibold text-zinc-700">
                            <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                            </svg>
                            {teamCount} Teams • {playersPerTeam} Players / Squad
                          </span>
                          <span className="font-mono text-[11px] font-bold text-zinc-900">
                            {eventJoinedCount} / {maxCapacity} Players ({fillPercent}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFull ? 'bg-red-600' : eventJoinedCount > 0 ? 'bg-emerald-500' : 'bg-zinc-300'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-2">
                      {joined ? (
                        <Button
                          variant="secondary"
                          className="w-full justify-center rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider"
                          onClick={() => openEventDetails(event)}
                        >
                          View Fixtures & Squad →
                        </Button>
                      ) : registrationBlocked ? (
                        <button
                          disabled
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 cursor-not-allowed"
                        >
                          Tournament Live • Registration Closed
                        </button>
                      ) : isFull ? (
                        <button
                          disabled
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-100 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 cursor-not-allowed"
                        >
                          Full Capacity Reached
                        </button>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-full justify-center rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow"
                          onClick={() => openRegisterModal(event)}
                        >
                          Register & Join Squad →
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Position Selection & Teammates Registration Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="rounded-full bg-red-600 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white">
                  {registeringEvent.format || '3v3'} Basketball
                </span>
                <h3 className="mt-2 text-xl font-bold text-black">{registeringEvent.name}</h3>
                <p className="text-xs text-zinc-500">Register yourself and your friends together to get placed in the SAME team!</p>
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
              {/* Main Player Info */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-red-600">Your Details (Player 1)</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700">Your Name</label>
                    <input
                      type="text"
                      required
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Your Full Name"
                      className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-1.5 text-xs text-black focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700">Playing Position</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-1.5 text-xs text-black focus:border-red-500 focus:outline-none"
                    >
                      {BASKETBALL_POSITIONS.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Friends / Teammates Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                    Add Friends / Teammates (Same Squad)
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500">
                    Squad Size: {1 + friends.length} / {getPlayersPerTeam(registeringEvent.format || '3v3')} Max
                  </span>
                </div>

                {friends.map((friend, idx) => (
                  <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 space-y-2 relative">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                      <span className="text-[10px] font-bold text-red-600">Teammate #{idx + 2}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFriend(idx)}
                        className="text-[10px] font-bold text-zinc-400 hover:text-red-600"
                      >
                        Remove ✕
                      </button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Friend Name"
                          value={friend.name}
                          onChange={(e) => handleFriendChange(idx, 'name', e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 px-2.5 py-1 text-xs text-black focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <select
                          value={friend.position}
                          onChange={(e) => handleFriendChange(idx, 'position', e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 px-2.5 py-1 text-xs text-black focus:border-red-500 focus:outline-none"
                        >
                          {BASKETBALL_POSITIONS.map((pos) => (
                            <option key={pos.value} value={pos.value}>
                              {pos.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {1 + friends.length < getPlayersPerTeam(registeringEvent.format || '3v3') && (
                  <button
                    type="button"
                    onClick={handleAddFriend}
                    className="w-full rounded-2xl border border-dashed border-red-300 bg-red-50/50 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-100 transition"
                  >
                    + Add Teammate / Friend to Same Team
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-3 text-xs text-red-700 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Group Team Placement
                </p>
                <p>All {1 + friends.length} players in your group will be assigned together into the SAME Team!</p>
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
                  {submitting ? 'Registering Squad...' : `Confirm Registration (${1 + friends.length} Players)`}
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
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-6-5.6-6-10a6 6 0 1112 0c0 4.4-6 10-6 10z" />
                      <circle cx="12" cy="11" r="2" />
                    </svg>
                    {selectedEvent.location || selectedEvent.venue || 'Venue TBD'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : 'Date TBD'}
                  </span>
                </div>
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
              {/* 4th Live Team & Player Capacity Breakdown Summary Block */}
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600">
                      Section 4 • Live Team & Player Capacity Breakdown
                    </span>
                    <h4 className="text-lg font-bold text-zinc-900">
                      Squad Rosters & Current Player Allocations ({joinedEvents.filter((j) => j.eventId === selectedEvent.id).length} Total Players)
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard/rosters"
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-red-600 transition hover:bg-red-100"
                    >
                      Open Full Hub ↗
                    </Link>
                    <span className="rounded-full bg-red-600 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                      {joinedEvents.filter((j) => j.eventId === selectedEvent.id).length} / {Math.max(2, Number(selectedEvent.teamCount || selectedEvent.teams) || 4) * getPlayersPerTeam(selectedEvent.format || '3v3')} Max Players
                    </span>
                  </div>
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
                      const isTeamFull = teamPlayers.length >= playersPerTeam;

                      return (
                        <div
                          key={teamName}
                          className={`rounded-2xl border p-4 shadow-sm space-y-3 transition ${
                            isTeamFull
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : teamPlayers.length > 0
                              ? 'border-amber-200 bg-amber-50/30'
                              : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                            <span className="font-black text-xs text-red-600 uppercase tracking-wider">
                              {teamName}
                            </span>
                            <span
                              className={`text-[9px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wider ${
                                isTeamFull
                                  ? 'bg-emerald-200 text-emerald-800'
                                  : teamPlayers.length > 0
                                  ? 'bg-amber-200 text-amber-800'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {isTeamFull
                                ? `Full (${teamPlayers.length}/${playersPerTeam})`
                                : `${teamPlayers.length}/${playersPerTeam} (${playersPerTeam - teamPlayers.length} Open)`}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {teamPlayers.length === 0 ? (
                              <div className="rounded-xl border border-dashed border-zinc-200 p-2.5 text-center text-[11px] italic text-zinc-400">
                                No players assigned yet
                              </div>
                            ) : (
                              teamPlayers.map((player, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-zinc-200 shadow-2xs"
                                >
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-zinc-900">{player.participantName}</p>
                                    <p className="text-[9px] font-medium text-zinc-500">Player #{pIdx + 1}</p>
                                  </div>
                                  <span className="text-[9px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
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
