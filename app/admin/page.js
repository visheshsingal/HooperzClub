'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        const usersRes = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (usersRes.ok) {
          setUsers(await usersRes.json());
        }
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

    if (!response.ok) {
      return;
    }

    const updatedUser = await response.json();
    setUsers((prev) => prev.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Admin panel</p>
            <h1 className="text-xl font-semibold text-zinc-900">Hooperz Admin</h1>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-100"
          >
            <span className="sr-only">Open sidebar</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-xs transform overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-6 shadow-sm transition duration-300 lg:relative lg:translate-x-0 lg:w-full lg:bg-zinc-50 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between lg:hidden">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Admin panel</p>
                <h1 className="text-2xl font-semibold text-zinc-900">Hooperz Admin</h1>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-300"
              >
                <span className="sr-only">Close sidebar</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Admin panel</p>
            <h1 className="text-3xl font-semibold text-zinc-900">Hooperz Admin</h1>
            <p className="text-sm text-zinc-600">Manage the members and platform access from one clean dashboard.</p>
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              Users
            </button>
          </nav>

          <div className="mt-8 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          {activeTab === 'dashboard' && (
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Admin dashboard</h2>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Total users</p>
                  <p className="mt-4 text-4xl font-semibold text-zinc-900">{users.length}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Active users</p>
                  <p className="mt-4 text-4xl font-semibold text-zinc-900">{users.filter((user) => !user.blocked).length}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Blocked users</p>
                  <p className="mt-4 text-4xl font-semibold text-zinc-900">{users.filter((user) => user.blocked).length}</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-500">Users</p>
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Manage members</h2>
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
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-zinc-900">{user.name || 'Unnamed user'}</h3>
                            <p className="text-sm text-zinc-600">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                              user.blocked
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
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
  );
}
