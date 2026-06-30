'use client';

const sports = ['Basketball', 'Football', 'Tennis'];

export default function Hero() {
  return (
    <section id="sports" className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{
            animation: 'slowZoom 25s ease-in-out infinite alternate',
            willChange: 'transform',
          }}
        >
          <source
            src="https://res.cloudinary.com/dewaaz2si/video/upload/12355471_1920_1080_30fps_hgyyrn.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.96) 100%)' }} />
      </div>

      <div className="absolute left-1/4 top-1/4 z-0 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[150px]" />
      <div className="absolute right-1/4 bottom-1/4 z-0 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl w-full h-full flex items-center px-8 sm:px-12">
        <div className="flex flex-col items-start text-left space-y-8 max-w-3xl">
          <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
            [ SPORTS HQ • ALL GAMES WELCOME ]
          </div>

          <div className="space-y-4">
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
              ONE PLATFORM FOR <br />
              <span className="text-red-500">
                EVERY SPORT.
              </span>
            </h1>

            <p className="max-w-lg text-sm text-slate-300 leading-relaxed font-light">
              A premium destination for organizers, teams, and fans. Manage leagues, schedule matchdays, and scale your community with a modern black-and-red experience.
            </p>

            <div className="flex flex-wrap gap-3">
              {sports.map((item) => (
                <span key={item} className="border border-red-500/20 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-red-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <a
              href="/login"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-none border border-red-500 bg-red-600 px-8 py-3.5 text-xs font-semibold tracking-[0.25em] text-white transition-all duration-500 hover:bg-red-500 hover:scale-105"
            >
              <span>EXPLORE SPORTS</span>
              <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slowZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }
      `}</style>
    </section>
  );
}
