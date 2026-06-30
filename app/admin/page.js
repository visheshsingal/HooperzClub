'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditGrantAmount, setCreditGrantAmount] = useState(10);
  const [creditModalUser, setCreditModalUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('hooperz_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const loadData = async () => {
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

      setAuthorized(true);
      setLoading(true);

      const [usersRes, eventsRes, teamsRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/events', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/dashboard/teams', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (usersRes.ok) {
        setUsers(await usersRes.json());
      }
      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }
      if (teamsRes.ok) {
        setTeams(await teamsRes.json());
      }
      setLoading(false);
    };

    loadData();
  }, [router]);

  const deleteEvent = async (eventId) => {
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch(`/api/admin/events?eventId=${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hooperz_token');
    router.push('/login');
  };

  const grantCreditsToUser = async (userId, amount) => {
    const token = localStorage.getItem('hooperz_token');
    const response = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, creditDelta: amount }),
    });

    if (!response.ok) {
      return;
    }

    const updatedUser = await response.json();
    setUsers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  const openCreditModal = (user) => {
    setCreditModalUser(user);
    setCreditGrantAmount(10);
    setCreditModalOpen(true);
  };

  const closeCreditModal = () => {
    setCreditModalOpen(false);
    setCreditModalUser(null);
    setCreditGrantAmount(10);
  };

  const handleGrantCredits = async () => {
    if (!creditModalUser || creditGrantAmount <= 0) {
      return;
    }

    await grantCreditsToUser(creditModalUser._id, Number(creditGrantAmount));
    closeCreditModal();
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

    if (!response.ok) {
      return;
    }

    const updatedUser = await response.json();
    setUsers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin panel</p>
            <h1 className="text-xl font-semibold text-white">Hooperz Admin</h1>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#181818] text-white transition hover:border-[#8e2a2a] hover:bg-white/5"
          >
            <span className="sr-only">Open sidebar</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-xs transform overflow-y-auto border border-white/10 bg-[#141414] p-6 shadow-2xl shadow-black/20 transition duration-300 lg:relative lg:translate-x-0 lg:w-72 lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between lg:hidden">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin panel</p>
                <h1 className="text-2xl font-semibold text-white">Hooperz Admin</h1>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#181818] text-white transition hover:border-[#8e2a2a] hover:bg-white/5"
              >
                <span className="sr-only">Close sidebar</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin panel</p>
            <h1 className="text-3xl font-semibold text-white">Hooperz Admin</h1>
            <p className="text-sm text-slate-400">Manage users, events, and platform data from one secure dashboard.</p>
          </div>

          <nav className="space-y-3">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-300 hover:bg-white/5'}`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === 'users' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-300 hover:bg-white/5'}`}
            >
              Users
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === 'events' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-300 hover:bg-white/5'}`}
            >
              Events
            </button>
          </nav>

          <div className="mt-8 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#7f2b2b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8e2a2a]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          {activeTab === 'dashboard' && (
            <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Admin dashboard</h2>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total users</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{users.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total events</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{events.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total teams</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{teams.length}</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Users</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Logged in users</h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {loading ? (
                  <p className="text-slate-400">Loading users…</p>
                ) : users.length === 0 ? (
                  <p className="text-slate-400">No users found.</p>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{user.email}</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">{user.name}</h3>
                          <p className={`mt-2 text-sm font-semibold ${user.blocked ? 'text-red-300' : 'text-green-300'}`}>
                            {user.blocked ? 'Blocked' : 'Active'}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">Credits: {user.credits ?? 0}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => toggleBlockUser(user._id, !user.blocked)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${user.blocked ? 'border-green-500 bg-green-500/10 text-green-200 hover:bg-green-500/15' : 'border-red-500 bg-red-500/10 text-red-200 hover:bg-red-500/15'}`}
                          >
                            {user.blocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            type="button"
                            onClick={() => openCreditModal(user)}
                            className="rounded-full border border-white/10 bg-[#1f5f1f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#297229]"
                          >
                            Give credits
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === 'events' && (
            <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Events</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Manage all events</h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {loading ? (
                  <p className="text-slate-400">Loading events…</p>
                ) : events.length === 0 ? (
                  <p className="text-slate-400">No events found.</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="rounded-3xl border border-white/10 bg-[#0f0f0f] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{event.sport}</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">{event.name}</h3>
                          <p className="mt-1 text-sm text-slate-300">{event.location || 'Location TBD'} • {event.start || 'Date TBD'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-full border border-white/10 bg-[#8e2a2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a05b5b]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {creditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
              <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Grant credits</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Free credit grant</h2>
                    <p className="mt-2 text-sm text-slate-400">Enter how many credits to give to {creditModalUser?.email}.</p>
                  </div>
                  <button type="button" onClick={closeCreditModal} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">Close</button>
                </div>
                <div className="mt-6 space-y-4">
                  <label className="block text-sm text-slate-300">
                    Credit amount
                    <input
                      type="number"
                      min="1"
                      value={creditGrantAmount}
                      onChange={(e) => setCreditGrantAmount(Number(e.target.value))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                    />
                  </label>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeCreditModal}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleGrantCredits}
                      className="rounded-2xl bg-[#1f5f1f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#297229]"
                    >
                      Grant credits
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
