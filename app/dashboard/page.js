'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('hooperz_token');
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
        localStorage.removeItem('hooperz_token');
        router.replace('/login');
        return;
      }
      setUser(data.user);
    };

    verify();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('hooperz_token');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-black/80 px-8 py-12 text-center text-slate-300 shadow-2xl shadow-black/20">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-black/95 p-10 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">Dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Welcome back, {user.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Your sports control panel is ready. Create leagues, manage teams, and keep your community engaged from one secure place.</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Logout
            </button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active leagues</p>
              <p className="mt-4 text-3xl font-semibold text-white">12</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total teams</p>
              <p className="mt-4 text-3xl font-semibold text-white">34</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Upcoming matches</p>
              <p className="mt-4 text-3xl font-semibold text-white">8</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
