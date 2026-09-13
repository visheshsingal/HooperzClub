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
    <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-red-600">{title}</p>
        <h1 className="text-3xl font-semibold text-black">{subtitle}</h1>
        <p className="text-sm leading-relaxed text-black/60">
          Create an account or log in to manage your sports community with secure access and a smooth dashboard experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {children}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Processing...' : submitLabel}
        </button>
      </form>
    </div>
  );
}
