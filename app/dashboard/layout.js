'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DashboardProvider } from './dashboard-context';

const links = [
  { href: '/dashboard/overview', label: 'Dashboard', subtitle: 'Your stats' },
  { href: '/dashboard/organize', label: 'Organize', subtitle: 'Create events & fixtures' },
  { href: '/dashboard/events', label: 'Events', subtitle: 'Browse tournaments' },
  { href: '/dashboard/credits', label: 'Credits', subtitle: 'Buy more credits' },
  { href: '/dashboard/teams', label: 'Teams', subtitle: 'Manage your squads' },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem('hooperz_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const verify = async () => {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid) {
        window.localStorage.removeItem('hooperz_token');
        router.replace('/login');
        return;
      }
      setCurrentUser(data.user || null);
      setLoading(false);
    };

    verify();
  }, [router]);

  const handleLogout = () => {
    window.localStorage.removeItem('hooperz_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center px-4">
        <div className="rounded-xl border border-white/10 bg-black/80 px-8 py-12 text-center text-slate-300 shadow-2xl shadow-black/20">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <DashboardProvider user={currentUser}>
      <div className="min-h-screen bg-[#141414] text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:hidden">
            <div className="flex items-center gap-3 rounded-xl bg-[#181818] px-4 py-3 shadow-lg shadow-black/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f2b2b] text-lg font-semibold text-white">H</div>
              <div>
                <p className="text-sm font-semibold text-white">Hooperz Club</p>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#181818] text-white transition hover:border-[#8e2a2a]/60 hover:bg-white/5"
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>

          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-xs transform overflow-y-auto border border-white/10 bg-[#181818] p-5 shadow-2xl shadow-black/40 transition duration-300 lg:relative lg:translate-x-0 lg:w-72 lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-8 flex items-center gap-3 rounded-xl bg-[#141414] px-4 py-4 text-white shadow-inner shadow-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7f2b2b] text-lg font-semibold">H</div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white">Hooperz Club</p>
                <p className="text-xs text-slate-400">Tournament control</p>
              </div>
            </div>

            <nav className="space-y-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-2xl border px-4 py-4 transition ${active ? 'border-[#8e2a2a] bg-[#6e2323] text-white' : 'border-white/10 bg-[#141414] text-slate-200 hover:border-[#8e2a2a] hover:bg-white/5'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <p className="text-sm font-semibold">{link.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{link.subtitle}</p>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#141414] p-4 text-sm text-slate-300">
              <p className="uppercase tracking-[0.35em] text-slate-400">Quick tips</p>
              <ul className="mt-3 space-y-2 list-disc pl-5 text-slate-400">
                <li>Organize events and generate fixtures.</li>
                <li>Browse tournaments and register squads.</li>
                <li>Check your activity on the dashboard.</li>
              </ul>
            </div>

            <button onClick={handleLogout} className="mt-8 w-full rounded-xl bg-[#7f2b2b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8e2a2a]">
              Logout
            </button>
          </aside>

          <section className="flex-1 lg:ml-4">{children}</section>
        </div>
      </div>
    </DashboardProvider>
  );
}
