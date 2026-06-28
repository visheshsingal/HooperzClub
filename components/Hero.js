'use client';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          style={{
            animation: 'slowZoom 25s ease-in-out infinite alternate',
            willChange: 'transform',
          }}
        >
          <source
            src="https://res.cloudinary.com/dewaaz2si/video/upload/WhatsApp_Video_2026-06-28_at_10.14.32_PM_olmgf1.mp4"
            type="video/mp4"
          />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(9, 9, 11, 0.7) 0%, rgba(9, 9, 11, 0.95) 100%)',
          }}
        />
      </div>

      {/* Premium Light Effects */}
      <div className="absolute left-1/3 top-1/4 z-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[150px]" />
      <div className="absolute right-1/4 bottom-1/4 z-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full h-full flex items-center px-8 sm:px-12">
        <div className="flex flex-col items-start text-left space-y-8 max-w-3xl">
          
          {/* Monospace System Badge */}
          <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
            [ SYSTEM v1.0 • OPEN COURT ]
          </div>

          {/* Elegant Heading */}
          <div className="space-y-4">
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
              REDEFINING THE <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
                STREET GAME.
              </span>
            </h1>

            <p className="max-w-md text-sm text-zinc-400 leading-relaxed font-light">
              A digital hub for organizers, scouts, and street hoopers. Set up tournament brackets, log scores, and build your digital card.
            </p>
          </div>

          {/* Minimal Refined CTA */}
          <div>
            <a
              href="#leagues"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-orange-500/30 bg-orange-500/10 px-8 py-3.5 text-xs font-semibold tracking-[0.25em] text-orange-400 backdrop-blur-xl transition-all duration-500 hover:bg-orange-500 hover:text-white hover:scale-105 hover:border-orange-500/50"
            >
              <span>ENTER COURT</span>
              <svg
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Global Animations */}
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