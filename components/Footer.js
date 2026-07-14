'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative w-full border-t border-red-600/20 bg-black text-slate-300 overflow-hidden">
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-[12%] h-1 w-1 rounded-full bg-red-500/15 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-36 right-[18%] h-1.5 w-1.5 rounded-full bg-red-500/10 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-[28%] h-1 w-1 rounded-full bg-red-500/10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-56 right-[42%] h-0.5 w-0.5 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-44 right-[14%] h-1 w-1 rounded-full bg-red-500/15 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-light tracking-tight text-white">
                Hooperz<span className="font-bold text-red-500">club</span>
              </span>
            </div>

            <p className="max-w-xs text-xs font-light leading-relaxed text-slate-300">
              Where every sport finds a league. Organize, join, and celebrate competition across football, basketball, and badminton.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {['twitter', 'instagram', 'youtube', 'discord'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="relative group/social h-8 w-8 flex items-center justify-center rounded-none border border-white/10 bg-black/70 text-white/30 hover:text-white hover:border-red-500/50 hover:bg-black/95 transition-all duration-300"
                >
                  <span className="text-xs font-light">{social[0].toUpperCase()}</span>
                  <span className="absolute -bottom-6 scale-0 group-hover/social:scale-100 text-[8px] text-white/20 transition-transform duration-300">
                    {social}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase mb-3">
                Platform
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#sports" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Sports
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#join" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase mb-3">
                Resources
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#help" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#community" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase mb-3">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#terms" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#cookies" className="text-xs text-slate-300 hover:text-red-400 transition-colors duration-200">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-slate-400 uppercase mb-3">
                Connect
              </h4>
              <ul className="space-y-2.5">
                <li className="text-xs text-slate-300">
                  <span className="block">support@hooperzclub.com</span>
                </li>
                <li className="text-xs text-slate-300">
                  <span className="block">+1 (555) 000-0000</span>
                </li>
                <li className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500/60" />
                  </span>
                  <span className="font-light">Available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-red-600/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-light tracking-[0.1em] text-slate-400">
              © {new Date().getFullYear()} Hooperzclub.
            </p>
            <span className="hidden sm:block h-3 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-1 w-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/60" />
                <span className="relative inline-flex h-1 w-1 rounded-full bg-red-500/60" />
              </span>
              <span className="text-[10px] font-light tracking-[0.1em] text-slate-400">
                Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 h-px bg-white/10 overflow-hidden">
                <div className="h-full w-1/2 bg-red-500/20 animate-slide" />
              </div>
            </div>

            <span className="h-3 w-px bg-white/10" />

            <div className="flex items-center gap-3 text-[10px] font-light tracking-[0.1em] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="animate-pulse text-red-300 text-[6px]">●</span>
                <span>LIVE</span>
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono text-slate-400 tabular-nums">{time || '--:--:--'}</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-slate-400">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/10" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white/15" />
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-red-600/20 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="text-[8px] font-light tracking-[0.3em] text-slate-500 uppercase mx-8">
              • All sports. One league. One club. • Manage tournaments. • Follow results. • Build your legacy. •
            </span>
            <span className="text-[8px] font-light tracking-[0.3em] text-slate-500 uppercase mx-8">
              • All sports. One league. One club. • Manage tournaments. • Follow results. • Build your legacy. •
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.8;
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-slide {
          animation: slide 3s linear infinite;
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </footer>
  );
}
