'use client';

import { useEffect, useRef } from 'react';

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

    const sportsTypes = ['basketball', 'soccer', 'volleyball', 'tennis'];
    const orbs = [];
    const orbitCount = 6;

    class SportsOrb {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 28 + Math.random() * 28;
        const speedMultiplier = 1.5;
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * speedMultiplier);
        this.vy = (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * speedMultiplier);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.008 + Math.random() * 0.02);
        this.opacity = 0.3 + Math.random() * 0.25;
        this.type = sportsTypes[Math.floor(Math.random() * sportsTypes.length)];
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.shadowColor = 'rgba(34, 211, 238, 0.25)';
        ctx.shadowBlur = 30;

        const colorMap = {
          basketball: ['#22d3ee', '#38bdf8'],
          soccer: ['#818cf8', '#a5b4fc'],
          volleyball: ['#34d399', '#6ee7b7'],
          tennis: ['#facc15', '#fde68a'],
        };

        const [startColor, endColor] = colorMap[this.type];
        const gradient = ctx.createRadialGradient(-this.radius * 0.3, -this.radius * 0.3, 0, 0, 0, this.radius);
        gradient.addColorStop(0, `${startColor}cc`);
        gradient.addColorStop(0.55, `${endColor}80`);
        gradient.addColorStop(1, `${endColor}10`);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = `${startColor}80`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.strokeStyle = `${startColor}aa`;
        ctx.lineWidth = 1.2;

        if (this.type === 'basketball') {
          ctx.beginPath();
          ctx.moveTo(0, -this.radius);
          ctx.lineTo(0, this.radius);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-this.radius, 0);
          ctx.lineTo(this.radius, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.7, -Math.PI / 2.6, Math.PI / 2.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.7, Math.PI / 1.5, Math.PI * 1.5);
          ctx.stroke();
        } else if (this.type === 'soccer') {
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * this.radius * 0.8, Math.sin(angle) * this.radius * 0.8);
            ctx.stroke();
          }
          ctx.fillStyle = `${startColor}40`;
          const patch = this.radius * 0.35;
          ctx.beginPath();
          ctx.moveTo(-patch, 0);
          ctx.lineTo(-patch * 0.25, -patch * 0.65);
          ctx.lineTo(patch * 0.25, -patch * 0.65);
          ctx.lineTo(patch, 0);
          ctx.lineTo(patch * 0.25, patch * 0.65);
          ctx.lineTo(-patch * 0.25, patch * 0.65);
          ctx.closePath();
          ctx.fill();
        } else if (this.type === 'volleyball') {
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.9, -Math.PI / 4, Math.PI / 3);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.9, Math.PI / 4, Math.PI * 1.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.5, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        } else if (this.type === 'tennis') {
          ctx.beginPath();
          ctx.arc(-this.radius * 0.3, 0, this.radius * 0.65, Math.PI / 5, Math.PI * 1.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(this.radius * 0.3, 0, this.radius * 0.65, Math.PI * 1.2, Math.PI / 5);
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

    for (let i = 0; i < orbitCount; i++) {
      orbs.push(new SportsOrb());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((orb) => {
        orb.update();
        orb.draw(ctx);
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
    <section id="about" className="relative bg-black overflow-hidden py-24 sm:py-32 border-t border-white/10">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-white/10" />
            <span className="text-[10px] font-light tracking-[0.3em] text-white/30 uppercase">
              About Us
            </span>
            <span className="h-px w-8 bg-white/10" />
          </div>
          <h2 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
            Built for every
            <span className="block font-bold bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent mt-2">
              sports community.
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-sm font-light leading-relaxed text-slate-300">
            Empowering organizers, teams, and fans with one platform to launch leagues, manage events, and follow performance across all your favorite sports.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="group relative rounded-3xl border border-white/10 bg-black/70 p-8 transition-all duration-500 hover:border-red-500/20 hover:bg-black/90 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-200 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">Launch leagues</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Set up schedules, team groups, and rules for competitions across basketball, soccer, volleyball, and more.
            </p>
          </div>

          <div className="group relative rounded-3xl border border-white/10 bg-black/70 p-8 transition-all duration-500 hover:border-red-500/20 hover:bg-black/90 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-200 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v2m0 14v2M5.636 5.636l1.414 1.414M16.95 16.95l1.414 1.414M3 12h2m14 0h2M5.636 18.364l1.414-1.414M16.95 7.05l1.414-1.414" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">Manage teams</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Keep rosters, stats, and player profiles in sync so every squad can focus on the game, not the admin.
            </p>
          </div>

          <div className="group relative rounded-3xl border border-white/10 bg-black/70 p-8 transition-all duration-500 hover:border-red-500/20 hover:bg-black/90 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-200 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">Follow every event</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Track live results, standings, and highlights so supporters can follow the momentum across every match.
            </p>
          </div>
          <div className="group relative rounded-3xl border border-white/10 bg-black/70 p-8 transition-all duration-500 hover:border-red-500/20 hover:bg-black/90 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-200 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">Follow every event</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Track live results, standings, and highlights so supporters can follow the momentum across every match.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
