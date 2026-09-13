'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '../../components/BrandLogo';
import FixturesBracket from '../../components/dashboard/FixturesBracket';

function getPlayersPerTeam(format) {
  if (format === '1v1') return 1;
  if (format === '2v2') return 2;
  if (format === '3v3') return 3;
  if (format === '5v5') return 5;
  return 3;
}

const adminNav = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'events', label: 'Basketball Events' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'users', label: 'Users' },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [joinedEntries, setJoinedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [selectedFixtureEventId, setSelectedFixtureEventId] = useState('');
  const [newFixture, setNewFixture] = useState({
    round: 'Quarterfinal',
    teamA: '',
    teamB: '',
  });

  // Form State for creating Basketball Event
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    format: '3v3', // 1v1, 2v2, 3v3, 5v5
    teamCount: 8,
    tournamentType: 'Knockout', // Knockout or Round Robin
    start: '',
    location: '',
    fee: 0,
    description: '',
    mapUrl: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('hooperz_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const loadData = async () => {
      try {
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!verifyResponse.ok) {
          localStorage.removeItem('hooperz_token');
          router.replace('/login');
          return;
        }

        const verifyBody = await verifyResponse.json();
        if (!verifyBody.valid || !verifyBody.user?.admin) {
          localStorage.removeItem('hooperz_token');
          router.replace('/login');
          return;
        }

        const [usersRes, eventsRes, joinedRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/events', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/dashboard/joined'),
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (joinedRes.ok) setJoinedEntries(await joinedRes.json());
      } catch (error) {
        console.error('Unable to load admin data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('hooperz_token');
    router.push('/login');
  };

  const toggleBlockUser = async (userId, blocked) => {
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, blocked }),
    });

    if (!response.ok) return;

    const updatedUser = await response.json();
    setUsers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name.trim()) return;

    setCreating(true);
    try {
      const token = localStorage.getItem('hooperz_token');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const created = await response.json();
        setEvents((prev) => [created, ...prev]);
        setShowCreateForm(false);
        setNewEvent({
          name: '',
          format: '3v3',
          teamCount: 8,
          tournamentType: 'Knockout',
          start: '',
          location: '',
          fee: 0,
          description: '',
          mapUrl: '',
        });
      }
    } catch (err) {
      console.error('Error creating event', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this Basketball event?')) return;
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch(`/api/admin/events?eventId=${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    }
  };

  const handleUpdateMatchScore = async (eventId, matchId, scoreA, scoreB, winner) => {
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch('/api/admin/events/fixtures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, matchId, scoreA, scoreB, winner }),
    });

    if (response.ok) {
      const body = await response.json();
      setEvents((prev) =>
        prev.map((ev) => (ev.id === eventId ? { ...ev, fixtures: body.fixtures } : ev))
      );
    }
  };

  const selectedFixtureEvent = events.find((event) => event.id === selectedFixtureEventId) || events[0] || null;

  const handleCreateFixture = async () => {
    if (!selectedFixtureEvent || !newFixture.teamA.trim() || !newFixture.teamB.trim()) return;
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch('/api/admin/events/fixtures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: selectedFixtureEvent.id,
        action: 'create',
        round: newFixture.round,
        teamA: newFixture.teamA.trim(),
        teamB: newFixture.teamB.trim(),
      }),
    });

    if (response.ok) {
      const body = await response.json();
      setEvents((prev) =>
        prev.map((event) => (event.id === selectedFixtureEvent.id ? { ...event, fixtures: body.fixtures } : event))
      );
      setNewFixture({ round: 'Quarterfinal', teamA: '', teamB: '' });
    }
  };

  const handleMovePlayer = async (entryId, assignedTeam) => {
    if (!entryId || !assignedTeam) return;
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch('/api/dashboard/joined', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: 'reassign', entryId, assignedTeam }),
    });

    if (response.ok) {
      const updated = await response.json();
      setJoinedEntries((prev) =>
        prev.map((entry) => (entry._id === entryId ? { ...entry, assignedTeam: updated.assignedTeam || assignedTeam } : entry))
      );
    }
  };

  const handleRemovePlayer = async (entryId, participantName) => {
    if (!entryId || !confirm(`Remove ${participantName || 'this player'} from this event?`)) return;
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch('/api/dashboard/joined', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ entryId }),
    });

    if (response.ok) {
      setJoinedEntries((prev) => prev.filter((entry) => entry._id !== entryId));
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-800 bg-[#09090b] text-white transition duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-shrink-0 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center overflow-hidden border-b border-zinc-800 px-4">
            <div className="flex h-12 w-48 items-center justify-start overflow-hidden">
              <BrandLogo className="h-10 w-auto max-w-[180px]" />
            </div>
          </div>

          <nav className="flex h-[calc(100vh-4rem)] flex-col p-3">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">Welcome back.</p>
            <div className="space-y-1">
              {adminNav.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? 'border-red-500/30 bg-zinc-900 font-semibold text-white shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-r before:bg-red-600'
                        : 'border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-5 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((open) => !open)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 transition hover:border-zinc-300 hover:text-black lg:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <div className="hidden text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 sm:block">Admin dashboard</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">A</div>
                  <span className="hidden text-sm font-semibold text-zinc-700 sm:block">Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-5 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-red-600">Overview</p>
                      <h2 className="mt-2 text-3xl font-bold text-black">Admin Control Panel</h2>
                    </div>
                    <div className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-red-700">
                      Live System
                    </div>
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Total users</p>
                    <p className="mt-4 text-4xl font-bold text-black">{users.length}</p>
                  </div>
                  <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Basketball Events</p>
                    <p className="mt-4 text-4xl font-bold text-red-600">{events.length}</p>
                  </div>
                  <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Active users</p>
                    <p className="mt-4 text-4xl font-bold text-black">{users.filter((user) => !user.blocked).length}</p>
                  </div>
                  <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Blocked users</p>
                    <p className="mt-4 text-4xl font-bold text-black">{users.filter((user) => user.blocked).length}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-red-600">Basketball Events</p>
                      <h2 className="mt-2 text-2xl font-bold text-black">Create & Manage Basketball Tournaments</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm((prev) => !prev)}
                      className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-red-500"
                    >
                      {showCreateForm ? 'Close Form' : '+ Create Basketball Event'}
                    </button>
                  </div>

                  {/* Create Basketball Event Form */}
                  {showCreateForm && (
                    <form onSubmit={handleCreateEvent} className="mt-6 space-y-4 border-t border-zinc-200 pt-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Event Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Hooperz 3v3 City Showdown"
                            value={newEvent.name}
                            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Basketball Match Format</label>
                          <select
                            value={newEvent.format}
                            onChange={(e) => setNewEvent({ ...newEvent, format: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          >
                            <option value="1v1">1v1 (Single Isolation)</option>
                            <option value="2v2">2v2 (Half-Court)</option>
                            <option value="3v3">3v3 (Streetball)</option>
                            <option value="5v5">5v5 (Full Court)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Number of Teams / Players</label>
                          <select
                            value={newEvent.teamCount}
                            onChange={(e) => setNewEvent({ ...newEvent, teamCount: Number(e.target.value) })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          >
                            <option value={2}>2 Teams / Players (Direct Final)</option>
                            <option value={3}>3 Teams / Players (Semi + Final)</option>
                            <option value={4}>4 Teams / Players (Semifinals + Final)</option>
                            <option value={6}>6 Teams / Players (Quarterfinals + Final)</option>
                            <option value={8}>8 Teams / Players (Quarterfinals → Semis → Final)</option>
                            <option value={12}>12 Teams / Players</option>
                            <option value={16}>16 Teams / Players</option>
                            <option value={32}>32 Teams / Players</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Tournament Format</label>
                          <select
                            value={newEvent.tournamentType}
                            onChange={(e) => setNewEvent({ ...newEvent, tournamentType: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          >
                            <option value="Knockout">Single Elimination Knockout</option>
                            <option value="Round Robin">Round Robin</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Date & Time</label>
                          <input
                            type="datetime-local"
                            required
                            value={newEvent.start}
                            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Venue Location</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Downtown Court 2, Main Arena"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Entry Fee (0 for Free)</label>
                          <input
                            type="number"
                            min="0"
                            value={newEvent.fee}
                            onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Description & Rules</label>
                          <input
                            type="text"
                            placeholder="Basketball tournament rules, ball size, referee info"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">Google Map Link / Embed URL</label>
                          <input
                            type="url"
                            placeholder="https://www.google.com/maps/... (or embed link for the court)"
                            value={newEvent.mapUrl || ''}
                            onChange={(e) => setNewEvent({ ...newEvent, mapUrl: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-black focus:border-red-500 focus:outline-none"
                          />
                          <p className="mt-1 text-[11px] text-zinc-500">Paste a Google Maps share or embed URL. If left empty, court name and city will be mapped automatically.</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={creating}
                          className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow hover:bg-red-500 disabled:opacity-50"
                        >
                          {creating ? 'Creating Event & Fixtures...' : 'Publish Basketball Event'}
                        </button>
                      </div>
                    </form>
                  )}
                </section>

                {/* Events List & Fixtures Manager */}
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
                      No Basketball events found. Click the create event button above to add your first tournament.
                    </div>
                  ) : (
                    events.map((event) => {
                      const isExpanded = expandedEventId === event.id;
                      const registeredPlayers = joinedEntries.filter((j) => j.eventId === event.id);

                      return (
                        <div key={event.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                                  Basketball ({event.format || '3v3'})
                                </span>
                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold text-zinc-700">
                                  {event.teams || event.teamCount || 8} Teams Max
                                </span>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                                  {registeredPlayers.length} Players Registered
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-black">{event.name}</h3>
                              <p className="text-xs text-zinc-600">
                                📍 {event.location || event.venue || 'TBD'} • 📅 {event.start ? new Date(event.start).toLocaleString() : 'Upcoming'} • 💰 {event.fee ? `$${event.fee}` : 'Free Entry'}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-800 transition hover:bg-zinc-100"
                              >
                                {isExpanded ? 'Hide Details' : 'Manage Bracket & Squad Rosters'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Expanded Roster & Fixtures Bracket View */}
                          {isExpanded && (
                            <div className="mt-6 border-t border-zinc-200 pt-6 space-y-6">
                              {/* 4th Live Team & Player Capacity Breakdown Summary Block */}
                              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600">
                                      Section 4 • Live Team & Player Capacity Breakdown
                                    </span>
                                    <h4 className="text-lg font-bold text-zinc-900">
                                      Squad Rosters & Current Player Allocations ({registeredPlayers.length} Total Players)
                                    </h4>
                                  </div>
                                  <span className="rounded-full bg-red-600 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                                    {registeredPlayers.length} / {Math.max(2, Number(event.teamCount || event.teams) || 4) * getPlayersPerTeam(event.format || '3v3')} Max Players
                                  </span>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                  {Array.from(
                                    { length: Math.max(2, Number(event.teamCount || event.teams) || 4) },
                                    (_, i) => {
                                      const teamName = `Team ${i + 1}`;
                                      const teamPlayers = registeredPlayers.filter((p) => p.assignedTeam === teamName);
                                      const playersPerTeam = getPlayersPerTeam(event.format || '3v3');
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

                              <FixturesBracket
                                fixtures={event.fixtures || []}
                                isAdmin={true}
                                onUpdateMatch={(matchId, scoreA, scoreB, winner) =>
                                  handleUpdateMatchScore(event.id, matchId, scoreA, scoreB, winner)
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'fixtures' && (
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-red-600">Fixtures</p>
                    <h2 className="mt-2 text-2xl font-bold text-black">Edit fixtures and team squads</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Select event</label>
                      <select
                        value={selectedFixtureEvent?.id || ''}
                        onChange={(e) => setSelectedFixtureEventId(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-black"
                      >
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-700">Create fixture manually</h3>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <input
                          type="text"
                          value={newFixture.round}
                          onChange={(e) => setNewFixture({ ...newFixture, round: e.target.value })}
                          placeholder="Round name"
                          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-black"
                        />
                        <input
                          type="text"
                          value={newFixture.teamA}
                          onChange={(e) => setNewFixture({ ...newFixture, teamA: e.target.value })}
                          placeholder="Team A"
                          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-black"
                        />
                        <input
                          type="text"
                          value={newFixture.teamB}
                          onChange={(e) => setNewFixture({ ...newFixture, teamB: e.target.value })}
                          placeholder="Team B"
                          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-black"
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleCreateFixture}
                          className="rounded-full bg-red-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                        >
                          Add fixture
                        </button>
                      </div>
                    </div>

                    {selectedFixtureEvent && (
                      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                        <FixturesBracket
                          fixtures={selectedFixtureEvent.fixtures || []}
                          isAdmin={true}
                          onUpdateMatch={(matchId, scoreA, scoreB, winner) =>
                            handleUpdateMatchScore(selectedFixtureEvent.id, matchId, scoreA, scoreB, winner)
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-700">Player team control</h3>
                      {selectedFixtureEvent ? (
                        <div className="mt-4 space-y-3">
                          {Array.from({ length: Math.max(2, Number(selectedFixtureEvent.teamCount || selectedFixtureEvent.teams) || 4) }, (_, i) => {
                            const teamName = `Team ${i + 1}`;
                            const eventPlayers = joinedEntries.filter((entry) => entry.eventId === selectedFixtureEvent.id && entry.assignedTeam === teamName);

                            return (
                              <div key={teamName} className="rounded-xl border border-zinc-200 bg-white p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">{teamName}</span>
                                  <span className="text-[10px] text-zinc-500">{eventPlayers.length} players</span>
                                </div>

                                {eventPlayers.length === 0 ? (
                                  <p className="text-xs italic text-zinc-400">No players assigned</p>
                                ) : (
                                  <div className="space-y-2">
                                    {eventPlayers.map((player) => (
                                      <div key={player._id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-2">
                                        <div className="flex items-center justify-between gap-2">
                                          <div>
                                            <p className="text-sm font-semibold text-black">{player.participantName}</p>
                                            <p className="text-[10px] text-zinc-500">{player.position || 'Guard'}</p>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleRemovePlayer(player._id, player.participantName)}
                                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600"
                                          >
                                            Remove
                                          </button>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2">
                                          <select
                                            value={player.assignedTeam || teamName}
                                            onChange={(e) => handleMovePlayer(player._id, e.target.value)}
                                            className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs text-black"
                                          >
                                            {Array.from({ length: Math.max(2, Number(selectedFixtureEvent.teamCount || selectedFixtureEvent.teams) || 4) }, (_, teamIndex) => (
                                              <option key={teamIndex} value={`Team ${teamIndex + 1}`}>
                                                Team {teamIndex + 1}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-zinc-500">No event selected.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'users' && (
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-red-600">Users</p>
                    <h2 className="mt-2 text-2xl font-semibold text-black">Manage members</h2>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {loading ? (
                    <p className="text-zinc-500">Loading users…</p>
                  ) : users.length === 0 ? (
                    <p className="text-zinc-500">No users found.</p>
                  ) : (
                    users.map((user) => (
                      <div key={user._id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-black">{user.name || 'Unnamed user'}</h3>
                              <p className="text-sm text-zinc-600">{user.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                                user.blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {user.blocked ? 'Blocked' : 'Active'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleBlockUser(user._id, !user.blocked)}
                              className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                                user.blocked
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                            >
                              {user.blocked ? 'Unblock' : 'Block'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
