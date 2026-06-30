'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthCard from '../../components/AuthCard';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('hooperz_token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSignup = async (data) => {
    setError('');
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    let body = {};
    try {
      body = await response.json();
    } catch {
      body = {};
    }

    if (!response.ok) {
      setError(body.error || `Unable to sign up. ${response.statusText || ''}`.trim());
      return;
    }

    localStorage.setItem('hooperz_token', body.token);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/6777243/pexels-photo-6777243.jpeg' }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
            <span className="text-sm uppercase tracking-[0.3em] text-red-300/70">Hooperzclub</span>
            <h1 className="mt-6 text-5xl font-semibold leading-tight">Join the next generation of sports leagues.</h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-200/90">Create teams, run tournaments, and keep your community connected. Sign up and access your dashboard instantly with secure JWT auth.</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <AuthCard title="Sign Up" subtitle="Start your journey" submitLabel="Create account" onSubmit={handleSignup}>
              {error ? <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
              <label className="block text-sm font-medium text-slate-300">Full name</label>
              <input name="name" type="text" required className="w-full rounded-3xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20" />
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input name="email" type="email" required className="w-full rounded-3xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20" />
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input name="password" type="password" required minLength="6" className="w-full rounded-3xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20" />
              <p className="text-xs text-slate-400">Already have an account? <a href="/login" className="text-red-300 hover:text-red-200">Log in</a></p>
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}
