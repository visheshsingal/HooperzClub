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
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative w-full border-t border-white/5 bg-black overflow-hidden">
      {/* Animated Gradient Line */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-1 h-1 bg-white/5 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-[30%] w-1 h-1 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 right-[40%] w-0.5 h-0.5 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-40 right-[15%] w-1 h-1 bg-white/5 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">

          {/* Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 group">
              <span className="text-lg font-light tracking-tight text-white group-hover:text-white/80 transition-colors duration-300">
                Hooperz<span className="font-bold">club</span>
              </span>
            </div>

            <p className="max-w-xs text-xs font-light leading-relaxed text-white/30">
              Where champions are made. Join the ultimate basketball community.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {['twitter', 'instagram', 'youtube', 'discord'].map((social, index) => (
                <a
                  key={social}
                  href="#"
                  className="relative group/social h-8 w-8 flex items-center justify-center rounded-full border border-white/5 bg-white/5 text-white/30 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-xs font-light">{social[0].toUpperCase()}</span>
                  <span className="absolute -bottom-6 scale-0 group-hover/social:scale-100 text-[8px] text-white/20 transition-transform duration-300">
                    {social}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-white/20 uppercase mb-3">
                Platform
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#leagues" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Leagues
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#join" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-white/20 uppercase mb-3">
                Resources
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#help" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#community" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-white/20 uppercase mb-3">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#terms" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#cookies" className="text-xs text-white/30 hover:text-white/70 transition-colors duration-200">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-light tracking-[0.2em] text-white/20 uppercase mb-3">
                Connect
              </h4>
              <ul className="space-y-2.5">
                <li className="text-xs text-white/30">
                  <span className="block">support@hooperz.com</span>
                </li>
                <li className="text-xs text-white/30">
                  <span className="block">+1 (555) 000-0000</span>
                </li>
                <li className="text-xs text-white/30 flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500/60" />
                  </span>
                  <span className="font-light">Available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-light tracking-[0.1em] text-white/20">
              © {new Date().getFullYear()} Hooperzclub.
            </p>
            <span className="hidden sm:block h-3 w-px bg-white/5" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-1 w-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/60" />
                <span className="relative inline-flex h-1 w-1 rounded-full bg-green-500/60" />
              </span>
              <span className="text-[10px] font-light tracking-[0.1em] text-white/20">
                Operational
              </span>
            </div>
          </div>

          {/* Live Clock & Moving Elements */}
          <div className="flex items-center gap-4">
            {/* Animated Progress Bar */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 h-px bg-white/5 overflow-hidden">
                <div className="h-full w-1/2 bg-white/20 animate-slide" />
              </div>
            </div>

            <span className="h-3 w-px bg-white/5" />

            {/* Live Clock */}
            <div className="flex items-center gap-3 text-[10px] font-light tracking-[0.1em] text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="animate-pulse text-white/40 text-[6px]">●</span>
                <span>LIVE</span>
              </span>
              <span className="h-3 w-px bg-white/5" />
              <span className="font-mono text-white/50 tabular-nums">{time || '--:--:--'}</span>
              <span className="h-3 w-px bg-white/5" />
              <span className="text-white/20">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Animated Dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/20" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white/10" />
            </span>
          </div>
        </div>

        {/* Animated Marquee */}
        <div className="mt-6 pt-4 border-t border-white/5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="text-[8px] font-light tracking-[0.3em] text-white/10 uppercase mx-8">
              • Build Your Legacy • Join the Community • Create Leagues • Track Stats • Rise to the Top •
            </span>
            <span className="text-[8px] font-light tracking-[0.3em] text-white/10 uppercase mx-8">
              • Build Your Legacy • Join the Community • Create Leagues • Track Stats • Rise to the Top •
            </span>
          </div>
        </div>
      </div>

      {/* Global Animations */}
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