'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '../../components/BrandLogo';

const adminNav = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
];

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
          <div className="flex h-14 items-center border-b border-zinc-800 px-3">
            <div className="flex h-7 w-[92px] items-center overflow-hidden">
              <BrandLogo className="h-full w-full object-contain" />
            </div>
          </div>

          <nav className="flex h-[calc(100vh-3.5rem)] flex-col p-3">
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
                        : 'border-transparent text-zinc-300 hover:border-zinc-800 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span className={active ? 'text-red-400' : 'text-zinc-400'}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                        {item.id === 'dashboard' ? (
                          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" />
                        ) : (
                          <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />
                        )}
                      </svg>
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Admin tools</p>
              <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                <li>• User moderation</li>
                <li>• Access control</li>
                <li>• Live oversight</li>
              </ul>
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
                      <h2 className="mt-2 text-3xl font-bold text-black">Admin dashboard</h2>
                    </div>
                    <div className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-red-700">
                      Live
                    </div>
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Total users</p>
                    <p className="mt-4 text-4xl font-bold text-black">{users.length}</p>
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
