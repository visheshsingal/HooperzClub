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

function getEventDateParts(dateString) {
  if (!dateString) {
    return { month: 'TBD', day: '--', fullDate: 'Date TBD', time: 'Time TBD' };
  }
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return { month: 'TBD', day: '--', fullDate: dateString, time: '' };
    }
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { month, day, fullDate, time };
  } catch {
    return { month: 'TBD', day: '--', fullDate: 'Date TBD', time: '' };
  }
}

export default function EventsPage() {
  const {
    events,
    joinedEvents,
    joinEvent,
    discardJoin,
    currentUser,
  } = useDashboard();

  const [selectedEvent, setSelectedEvent] = useState(null);
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

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setPlayerName(currentUser?.name || '');
    setPosition('Point Guard (PG)');
    setFriends([]);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setFriends([]);
  };

  const handleAddFriend = () => {
    if (!selectedEvent) return;
    const maxSquad = getPlayersPerTeam(selectedEvent.format || '3v3');
    if (1 + friends.length >= maxSquad) {
      showToast(`Max squad size is ${maxSquad} players for ${selectedEvent.format || '3v3'} format.`, 'error');
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
    if (!selectedEvent) return;

    setSubmitting(true);
    try {
      const validFriends = friends.filter((f) => f.name && f.name.trim());
      const result = await joinEvent(selectedEvent.id, position, playerName, validFriends);

      const totalCount = 1 + validFriends.length;
      showToast(
        `✓ Registered successfully! Assigned to ${result.assignedTeam || 'a squad'} with your group of ${totalCount} player(s).`
      );
      setFriends([]);
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

                const isStarted = event.start && new Date(event.start) < new Date();
                const isClosed = event.status === 'In Progress' || event.status === 'Completed' || event.status === 'Closed';
                const registrationBlocked = isStarted || isClosed;

                return (
                  <article
                    key={event.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
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

                      {/* Details with SVG Icons */}
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

                      {/* Capacity Progress Bar */}
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
                      <Button
                        variant={joined ? 'secondary' : 'primary'}
                        className="w-full justify-center rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider"
                        onClick={() => openEventModal(event)}
                      >
                        {joined ? 'View Event & Fixtures →' : 'Register & View Event →'}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Unified Modern Event Details & Registration Modal (Luma Layout) */}
      {selectedEvent && (() => {
        const isJoined = joinedEvents.some((j) => j.eventId === selectedEvent.id);
        const myRegistration = joinedEvents.find((j) => j.eventId === selectedEvent.id);
        const eventJoinedCount = joinedEvents.filter((j) => j.eventId === selectedEvent.id).length;
        const teamCount = Math.max(2, Number(selectedEvent.teamCount || selectedEvent.teams) || 4);
        const playersPerTeam = getPlayersPerTeam(selectedEvent.format || '3v3');
        const maxCapacity = teamCount * playersPerTeam;
        const isFull = eventJoinedCount >= maxCapacity;
        const openCapacity = Math.max(0, maxCapacity - eventJoinedCount);

        const isStarted = selectedEvent.start && new Date(selectedEvent.start) < new Date();
        const isClosed = selectedEvent.status === 'In Progress' || selectedEvent.status === 'Completed' || selectedEvent.status === 'Closed';
        const registrationBlocked = isStarted || isClosed;

        const dateParts = getEventDateParts(selectedEvent.start);

        const mapsQuery = encodeURIComponent(selectedEvent.location || selectedEvent.venue || 'Basketball Court');
        const mapsEmbedUrl = selectedEvent.mapUrl && (selectedEvent.mapUrl.includes('embed') || selectedEvent.mapUrl.includes('output=embed'))
          ? selectedEvent.mapUrl
          : `https://maps.google.com/maps?q=${mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

        const mapsDirectUrl = selectedEvent.mapUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-md">
            <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-md">
                <span className="rounded-full bg-red-600 px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest text-white">
                  {selectedEvent.format ? selectedEvent.format.toUpperCase() : '3V3'} Basketball
                </span>
                <button
                  type="button"
                  onClick={closeEventModal}
                  className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-black"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Scroll Content */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
                {/* Event Title & Host */}
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                    {selectedEvent.name}
                  </h1>
                  <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      H
                    </div>
                    <span className="font-semibold text-zinc-900">
                      Hosted by {selectedEvent.createdBy || 'Saidev Dhal & Hooperz Club'}
                    </span>
                  </div>
                </div>

                {/* Date & Location Tiles (Side by side) */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Date Tile */}
                  <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3.5">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-xs">
                      <span className="text-[9px] font-black uppercase text-red-600 tracking-wider">
                        {dateParts.month}
                      </span>
                      <span className="font-mono text-lg font-black leading-tight text-zinc-900">
                        {dateParts.day}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-zinc-900 truncate">
                        {dateParts.fullDate}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-medium">
                        {dateParts.time || 'Schedule to be confirmed'}
                      </p>
                    </div>
                  </div>

                  {/* Location Tile */}
                  <div className="flex items-center gap-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3.5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-xs text-zinc-700">
                      <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-6-5.6-6-10a6 6 0 1112 0c0 4.4-6 10-6 10z" />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-zinc-900 truncate">
                        {selectedEvent.location || selectedEvent.venue || 'Register to See Address'}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {selectedEvent.city || 'Verified Court Facility'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Card (Matches screenshot layout) */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/90 shadow-sm">
                  <div className="border-b border-zinc-200 bg-zinc-100/70 px-5 py-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Registration
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Status & Rules Strip */}
                    <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-xs">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-900">
                          {isJoined ? 'Registered Entry' : 'Squad Placement & Approval'}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {isJoined
                            ? `You are confirmed for this tournament in ${myRegistration?.assignedTeam || 'assigned squad'}.`
                            : isFull
                            ? 'All squad player slots for this event are currently filled.'
                            : `Welcome! Join this event below (${openCapacity} player slot${openCapacity === 1 ? '' : 's'} remaining).`}
                        </p>
                      </div>
                    </div>

                    {/* Registration Form / Status Actions */}
                    {isJoined ? (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Registration Confirmed ({myRegistration?.assignedTeam || 'Team Squad'})
                          </span>
                          <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                            {myRegistration?.position || 'Guard'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="danger"
                            className="flex-1 justify-center text-xs font-bold uppercase tracking-wider py-3"
                            onClick={async () => {
                              await discardJoin(selectedEvent.id);
                              showToast('Registration withdrawn successfully.');
                            }}
                          >
                            Withdraw Registration
                          </Button>
                          <Link href="/dashboard/rosters" className="flex-1">
                            <Button
                              variant="secondary"
                              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-3"
                            >
                              Squad Rosters Hub →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : registrationBlocked ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-xs font-bold text-amber-800">
                        Tournament has started. Registration is now closed.
                      </div>
                    ) : isFull ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-bold text-red-700">
                        Max Capacity Reached. Registration is closed.
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1">
                        {/* Player Name */}
                        <div>
                          <label className="block text-xs font-bold text-zinc-700">Your Full Name</label>
                          <input
                            type="text"
                            required
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-black focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        {/* Position Selection */}
                        <div>
                          <label className="block text-xs font-bold text-zinc-700">Select Playing Position</label>
                          <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-black focus:border-red-500 focus:outline-none"
                          >
                            {BASKETBALL_POSITIONS.map((pos) => (
                              <option key={pos.value} value={pos.value}>
                                {pos.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Optional Friends Addition */}
                        {friends.length > 0 && (
                          <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                              Registered Teammates ({friends.length})
                            </p>
                            {friends.map((friend, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder={`Teammate #${idx + 1} Name`}
                                  value={friend.name}
                                  onChange={(e) => handleFriendChange(idx, 'name', e.target.value)}
                                  className="flex-1 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs"
                                />
                                <select
                                  value={friend.position}
                                  onChange={(e) => handleFriendChange(idx, 'position', e.target.value)}
                                  className="rounded-lg border border-zinc-300 px-2 py-1.5 text-xs"
                                >
                                  {BASKETBALL_POSITIONS.map((p) => (
                                    <option key={p.value} value={p.value}>
                                      {p.value}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFriend(idx)}
                                  className="rounded-lg p-1.5 text-zinc-400 hover:text-red-600"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {1 + friends.length < playersPerTeam && (
                          <button
                            type="button"
                            onClick={handleAddFriend}
                            className="w-full rounded-xl border border-dashed border-red-300 bg-red-50/50 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-100 transition"
                          >
                            + Add Teammate / Friend (Group Placement)
                          </button>
                        )}

                        {/* Big CTA */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full rounded-xl bg-zinc-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {submitting ? 'Registering Squad...' : 'Request to Join / Register'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* About Event Section (From Screenshot) */}
                <div className="space-y-3 border-t border-zinc-200 pt-6">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    About Event
                  </h3>
                  <div className="text-sm leading-relaxed text-zinc-700 space-y-2">
                    <p>
                      {selectedEvent.description ||
                        'Step onto the court for sanctioned Hooperz league competition. Refereed fixtures, automated brackets, official basketball balls, and court-side scorekeeping provided.'}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 text-xs text-zinc-600">
                      <span className="rounded-lg bg-zinc-100 px-3 py-1 font-semibold">
                        Format: {selectedEvent.format || '3v3'}
                      </span>
                      <span className="rounded-lg bg-zinc-100 px-3 py-1 font-semibold">
                        Teams: {teamCount} Squads
                      </span>
                      <span className="rounded-lg bg-zinc-100 px-3 py-1 font-semibold">
                        Entry Fee: {selectedEvent.fee > 0 ? `₹${selectedEvent.fee}` : 'Free'}
                      </span>
                      <span className="rounded-lg bg-zinc-100 px-3 py-1 font-semibold">
                        Rules: FIBA Sanctioned
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location & Map Section (From Screenshot) */}
                <div className="space-y-3 border-t border-zinc-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                      Location
                    </h3>
                    <a
                      href={mapsDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                    >
                      Maps ↗
                    </a>
                  </div>

                  <p className="text-xs text-zinc-600">
                    {selectedEvent.location || selectedEvent.venue || 'Please register to see the exact location of this event.'}
                  </p>

                  {/* Embedded Google Map */}
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-xs">
                    <div className="absolute right-3 top-3 z-10">
                      <a
                        href={mapsDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-zinc-900/90 px-3 py-1.5 text-xs font-bold text-white shadow backdrop-blur hover:bg-black"
                      >
                        Maps ↗
                      </a>
                    </div>
                    <iframe
                      title="Event Court Location"
                      src={mapsEmbedUrl}
                      className="h-64 w-full border-0"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Tournament Fixtures & Bracket */}
                <div className="space-y-3 border-t border-zinc-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                      Tournament Bracket & Fixtures
                    </h3>
                    <Link
                      href="/dashboard/rosters"
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Live Squad Rosters →
                    </Link>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs">
                    <FixturesBracket fixtures={selectedEvent.fixtures || []} isAdmin={false} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-4 text-right">
                <Button variant="secondary" onClick={closeEventModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

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
