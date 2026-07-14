'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    href: '/dashboard/teams',
    label: 'Teams',
    step: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: '/dashboard/events',
    label: 'Events',
    step: 4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/organize',
    label: 'Organize',
    step: 5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    href: '/dashboard/credits',
    label: 'Credits',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <p className="text-sm text-zinc-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider user={currentUser}>
      <div className="min-h-screen bg-black text-zinc-200">
        <div className="flex min-h-screen">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-900 bg-[#070709] transition duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:flex-shrink-0 lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex h-16 items-center border-b border-zinc-900 px-5">
              <Link href="/dashboard/overview" className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-[0.25em] text-white">HOOPERZ</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Club</span>
              </Link>
            </div>

            <nav className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto p-4">
              <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                Welcome Back.
              </p>
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-md border px-3 py-2 text-xs transition duration-150 relative ${
                        active
                          ? 'border-zinc-800 bg-[#0e0e11] font-bold text-white shadow-none before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4.5 before:bg-accent before:rounded-r-sm'
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                      }`}
                    >
                      <span className={active ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-350'}>{link.icon}</span>
                      <span className="flex-1 ml-1">{link.label}</span>
                      {link.step && (
                        <span className={`text-[9px] font-bold ${active ? 'text-accent' : 'text-zinc-650'}`}>
                          {link.step}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto rounded-xl border border-zinc-900 bg-black/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Quick guide</p>
                <ol className="mt-2 space-y-1 text-xs text-zinc-500">
                  <li>1. Create your squad</li>
                  <li>2. Browse & join events</li>
                  <li>3. Organize your own</li>
                </ol>
              </div>
            </nav>
          </aside>

          <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-zinc-900 bg-black/85 backdrop-blur-xl">
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((open) => !open)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 transition hover:border-zinc-700 hover:text-white lg:hidden"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </button>
                  <div className="hidden text-xs font-bold uppercase tracking-wider text-zinc-500 sm:block">Welcome back</div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/credits"
                    className="hidden items-center gap-2 rounded-md border border-zinc-800 bg-[#0a0a0c] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-700 hover:text-white sm:flex"
                  >
                    <span>Credits</span>
                    <span className="font-extrabold text-accent">{currentUser?.credits ?? 0}</span>
                  </Link>
                  <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-[#0a0a0c] px-2.5 py-1.5">
                    <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {userInitial}
                    </div>
                    <span className="hidden max-w-[120px] truncate text-xs font-bold text-zinc-300 sm:block">
                      {currentUser?.name || 'Player'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-900/30 cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
