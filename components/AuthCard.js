'use client';

import { useState } from 'react';

export default function AuthCard({ title, subtitle, onSubmit, children, submitLabel }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-black/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300/70">{title}</p>
        <h1 className="text-3xl font-semibold text-white">{subtitle}</h1>
        <p className="text-sm leading-relaxed text-slate-400">Create an account or log in to manage your sports community with secure access and a smooth dashboard experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {children}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Processing...' : submitLabel}
        </button>
      </form>
    </div>
  );
}
