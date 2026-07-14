import Link from 'next/link';

export function PageHeader({ label, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {label && (
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{label}</p>
        )}
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '', glow = false }) {
  return (
    <div
      className={`rounded-xl border border-zinc-800/80 bg-[#0a0a0c] p-6 sm:p-8 transition-all ${
        glow ? 'border-accent/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, accent = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition duration-205 ${
        accent
          ? 'border-accent/30 bg-[#0d0a0b]'
          : 'border-zinc-800/80 bg-[#0a0a0c] hover:border-zinc-700 hover:bg-[#0e0e11]'
      }`}
    >
      {accent && (
        <div className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
        </div>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-accent">
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
    'inline-flex items-center justify-center gap-2 rounded-md px-4.5 py-2 text-xs uppercase tracking-wider font-bold transition duration-150 focus:outline-none disabled:opacity-50 cursor-pointer';
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'border border-zinc-800 hover:border-zinc-700 text-white bg-transparent hover:bg-zinc-900/40',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-950',
    danger: 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20',
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
    <label className="block space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
      {label}
      <input
        className={`w-full rounded-md border border-zinc-805 bg-[#050507] px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-650 focus:border-accent focus:ring-0 transition duration-150 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="block space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
      {label}
      <select
        className={`w-full rounded-md border border-zinc-805 bg-[#050507] px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:ring-0 transition duration-150 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="block space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
      {label}
      <textarea
        className={`w-full rounded-md border border-zinc-805 bg-[#050507] px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-650 focus:border-accent focus:ring-0 transition duration-150 ${className}`}
        {...props}
      />
    </label>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-[#050507] px-6 py-12 text-center">
      <p className="text-base font-bold text-white tracking-tight">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-xs text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function FlowStep({ step, title, description, href, completed, active }) {
  return (
    <Link
      href={href}
      className={`group relative flex gap-4 rounded-xl border p-4.5 transition duration-150 ${
        active
          ? 'border-accent bg-[#0e0a0b]'
          : completed
            ? 'border-zinc-800 bg-[#0a0a0c] hover:border-zinc-700'
            : 'border-zinc-800 bg-[#0a0a0c] hover:border-zinc-700'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition duration-150 ${
          completed
            ? 'bg-accent text-white'
            : active
              ? 'border-2 border-accent text-accent'
              : 'border border-zinc-800 text-zinc-500 group-hover:text-zinc-300'
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
        <p className="text-sm font-bold text-white transition group-hover:text-accent tracking-tight">{title}</p>
        <p className="mt-1 text-xs text-zinc-500 leading-normal">{description}</p>
      </div>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4.5 w-4.5 shrink-0 self-center text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-accent"
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
      className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-[#0a0a0c] p-4 transition duration-150 hover:border-zinc-700 hover:bg-[#0e0e11]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-accent transition duration-150 group-hover:bg-accent group-hover:text-white group-hover:border-accent">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white transition duration-150 group-hover:text-accent tracking-tight">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'border-zinc-800 bg-[#0e0e11] text-zinc-400',
    red: 'border-accent/20 bg-accent/5 text-accent',
    green: 'border-emerald-600/20 bg-emerald-600/5 text-emerald-400',
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
      {title && <h2 className="mt-1 text-lg font-bold tracking-tight text-white">{title}</h2>}
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const styles = {
    success: 'border-emerald-500/20 bg-emerald-950/90 text-emerald-300',
    error: 'border-accent/20 bg-red-950/90 text-red-300',
    info: 'border-zinc-800 bg-[#0e0e11] text-zinc-300',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-lg border px-4.5 py-2.5 text-xs font-semibold shadow-2xl ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-2 cursor-pointer opacity-60 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}
