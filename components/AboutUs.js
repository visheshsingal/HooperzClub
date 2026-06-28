'use client';

import React, { useEffect, useRef } from 'react';

export default function AboutUs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.getBoundingClientRect().width || canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.getBoundingClientRect().height || canvas.offsetHeight || 500;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Basketball properties
    const basketballs = [];
    const numBasketballs = 6;

    class Basketball {
      constructor() {
        this.reset();
      }


      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 35 + Math.random() * 25;
        const speedMultiplier = 1.8;
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * speedMultiplier);
        this.vy = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * speedMultiplier);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.015 + Math.random() * 0.02);
        this.opacity = 0.45 + Math.random() * 0.25;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Glow
        ctx.shadowColor = 'rgba(249, 115, 22, 0.35)';
        ctx.shadowBlur = 40;

        // Main ball
        const gradient = ctx.createRadialGradient(
          -this.radius * 0.3, -this.radius * 0.3, 0,
          0, 0, this.radius
        );
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
        gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)');
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.05)');

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Basketball lines
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.lineWidth = 1.2;

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(0, this.radius);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(this.radius, 0);
        ctx.stroke();

        // Curved lines
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.7, -Math.PI / 2.5, Math.PI / 2.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.7, Math.PI / 1.5, Math.PI * 1.5);
        ctx.stroke();

        // Small details
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * this.radius * 0.85;
          const y = Math.sin(angle) * this.radius * 0.85;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -this.radius && this.vx < 0) {
          this.vx *= -1;
        } else if (this.x > canvas.width + this.radius && this.vx > 0) {
          this.vx *= -1;
        }
        if (this.y < -this.radius && this.vy < 0) {
          this.vy *= -1;
        } else if (this.y > canvas.height + this.radius && this.vy > 0) {
          this.vy *= -1;
        }
      }
    }

    for (let i = 0; i < numBasketballs; i++) {
      basketballs.push(new Basketball());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      basketballs.forEach(ball => {
        ball.update();
        ball.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section id="about" className="relative bg-black overflow-hidden py-24 sm:py-32 border-t border-white/5">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />

      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-white/10" />
            <span className="text-[10px] font-light tracking-[0.3em] text-white/30 uppercase">
              About Us
            </span>
            <span className="h-px w-8 bg-white/10" />
          </div>
          <h2 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
            Built for the
            <span className="block font-bold bg-gradient-to-r from-white via-white/70 to-white/40 bg-clip-text text-transparent mt-2">
              Basketball Community
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-sm font-light leading-relaxed text-white/40">
            Empowering players, coaches, and fans to connect, compete, and grow together.
            Your ultimate platform for basketball excellence.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">

          {/* Card 1 */}
          <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.05] transition-all duration-500 hover:border-white/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30 group-hover:border-white/20 group-hover:text-white/60 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-light tracking-tight text-white">
                Create Leagues
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-white/30">
                Design custom tournaments, manage teams, and schedule matches with ease. Full control over your league format.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-light tracking-[0.15em] text-white/20">
                <span>Learn More</span>
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.05] transition-all duration-500 hover:border-white/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30 group-hover:border-white/20 group-hover:text-white/60 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-light tracking-tight text-white">
                Join Games
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-white/30">
                Find open courts, connect with local players, and jump into pickup games instantly. Never miss a game again.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-light tracking-[0.15em] text-white/20">
                <span>Learn More</span>
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.05] transition-all duration-500 hover:border-white/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30 group-hover:border-white/20 group-hover:text-white/60 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-light tracking-tight text-white">
                Track Stats
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-white/30">
                Log every game, track player performance, and build your legacy with detailed statistics and analytics.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-light tracking-[0.15em] text-white/20">
                <span>Learn More</span>
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/10" />
          <span className="relative flex h-1 w-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/20" />
            <span className="relative inline-flex h-1 w-1 rounded-full bg-white/10" />
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>
    </section>
  );
}