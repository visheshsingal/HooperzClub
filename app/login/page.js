'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthCard from '../../components/AuthCard';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('hooperz_token');
    if (!token) return;

    const verifyToken = async () => {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        localStorage.removeItem('hooperz_token');
        return;
      }

      const body = await response.json();
      if (body.valid && body.user?.admin) {
        router.replace('/admin');
      } else if (body.valid) {
        router.replace('/dashboard');
      } else {
        localStorage.removeItem('hooperz_token');
      }
    };

    verifyToken();
  }, [router]);

  const handleLogin = async (data) => {
    setError('');
    const response = await fetch('/api/auth/login', {
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
      setError(body.error || `Unable to log in. ${response.statusText || ''}`.trim());
      return;
    }

    localStorage.setItem('hooperz_token', body.token);
    if (body.admin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1462618/pexels-photo-1462618.jpeg)',
            filter: 'saturate(0.8) brightness(0.8)',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
            <span className="text-sm uppercase tracking-[0.3em] text-red-300">Hooperzclub</span>
            <h1 className="mt-6 text-5xl font-semibold leading-tight">Sign in and manage every match.</h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75">
              Secure login for your club dashboard with JWT, MongoDB-backed users, and instant redirect to your control panel.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white p-8 sm:p-12">
          <div className="w-full max-w-md">
            <AuthCard title="Login" subtitle="Welcome back" submitLabel="Sign in" onSubmit={handleLogin}>
              {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-12 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-black/60">
                New here? <a href="/signup" className="text-red-600 hover:text-red-500">Create account</a>
              </p>
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}
