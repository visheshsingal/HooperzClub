import Link from 'next/link';

export function PageHeader({ label, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {label && (
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">{label}</p>
        )}
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '', glow = false }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 transition-all ${
        glow ? 'border-red-200 shadow-red-100' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, accent = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition duration-200 ${
        accent
          ? 'border-red-200 bg-red-50'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
      }`}
    >
      {accent && (
        <div className="absolute inset-y-0 left-0 w-[3px] bg-red-600" />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-black">{value}</p>
        </div>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-red-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4.5 py-2.5 text-xs uppercase tracking-[0.18em] font-bold transition duration-150 focus:outline-none disabled:opacity-50 cursor-pointer';
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-500',
    secondary: 'border border-zinc-300 bg-white text-black hover:border-zinc-400 hover:bg-zinc-50',
    ghost: 'text-zinc-600 hover:text-black hover:bg-zinc-100',
    danger: 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
      {label}
      <input
        className={`w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-red-500 focus:ring-0 transition duration-150 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
      {label}
      <select
        className={`w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-red-500 focus:ring-0 transition duration-150 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
      {label}
      <textarea
        className={`w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-red-500 focus:ring-0 transition duration-150 ${className}`}
        {...props}
      />
    </label>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
      <p className="text-base font-bold text-black tracking-tight">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-xs text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function FlowStep({ step, title, description, href, completed, active }) {
  return (
    <Link
      href={href}
      className={`group relative flex gap-4 rounded-2xl border p-4.5 transition duration-150 ${
        active
          ? 'border-red-200 bg-red-50'
          : completed
            ? 'border-zinc-200 bg-white hover:border-zinc-300'
            : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition duration-150 ${
          completed
            ? 'bg-red-600 text-white'
            : active
              ? 'border-2 border-red-600 text-red-600'
              : 'border border-zinc-300 text-zinc-500 group-hover:text-black'
        }`}
      >
        {completed ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          step
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-black transition group-hover:text-red-600 tracking-tight">{title}</p>
        <p className="mt-1 text-xs text-zinc-500 leading-normal">{description}</p>
      </div>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4.5 w-4.5 shrink-0 self-center text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-red-600"
      >
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}

export function QuickAction({ title, subtitle, href, icon }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition duration-150 hover:border-zinc-300 hover:bg-zinc-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-red-600 transition duration-150 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-black transition duration-150 group-hover:text-red-600 tracking-tight">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'border-zinc-200 bg-zinc-100 text-zinc-700',
    red: 'border-red-200 bg-red-50 text-red-600',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function SectionTitle({ label, title }) {
  return (
    <div>
      {label && <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">{label}</p>}
      {title && <h2 className="mt-1 text-lg font-bold tracking-tight text-black">{title}</h2>}
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-zinc-200 bg-zinc-100 text-zinc-700',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-lg ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-2 cursor-pointer opacity-70 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}
