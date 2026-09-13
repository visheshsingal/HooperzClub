'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from '../../components/BrandLogo';
import { DashboardProvider } from './dashboard-context';

const navLinks = [
  {
    href: '/dashboard/overview',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    step: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />
      </svg>
    ),
  },
  {
    href: '/dashboard/connect',
    label: 'Connect',
    step: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M8 11a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM3 20a4 4 0 018 0v1H3zm10 0a4 4 0 018 0v1h-8" />
      </svg>
    ),
  },
  {
    href: '/dashboard/events',
    label: 'Events',
    step: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    ),
  },
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

  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || 'H';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <p className="text-sm text-zinc-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider user={currentUser}>
      <div className="min-h-screen bg-[#f5f5f5] text-zinc-900">
        <div className="flex min-h-screen">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}




          <aside
            className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r border-zinc-800 bg-[#09090b] text-white transition duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:flex-shrink-0 lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex h-20 items-center overflow-hidden border-b border-zinc-800 px-3">
              <Link href="/dashboard/overview" className="flex h-14 w-full items-center justify-start overflow-hidden">
                <BrandLogo className="h-11 w-auto max-w-[200px]" />
              </Link>
            </div>

            <nav className="flex h-[calc(100vh-5rem)] flex-col overflow-y-auto p-3">
              <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                Welcome back.
              </p>
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition duration-150 ${
                        active
                          ? 'border-red-500/30 bg-zinc-900 font-semibold text-white shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-r before:bg-red-600'
                          : 'border-transparent text-zinc-300 hover:border-zinc-800 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span className={active ? 'text-red-400' : 'text-zinc-400'}>{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                      {link.step && (
                        <span className={`text-[9px] font-bold ${active ? 'text-red-400' : 'text-zinc-400'}`}>
                          {link.step}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Quick guide</p>
                <ol className="mt-2 space-y-1 text-sm text-zinc-300">
                  <li>1. Build your squad</li>
                  <li>2. Register for events</li>
                  <li>3. View match fixtures</li>
                </ol>
              </div>
            </nav>
          </aside>

          <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
              <div className="flex h-16 items-center justify-between px-6">
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
                  <div className="hidden text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 sm:block">Dashboard</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                      {userInitial}
                    </div>
                    <span className="hidden max-w-[140px] truncate text-sm font-semibold text-zinc-700 sm:block">
                      {currentUser?.name || 'Player'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-zinc-700 transition hover:border-zinc-300 hover:text-black"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 bg-[#f5f5f5] p-6">{children}</main>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
