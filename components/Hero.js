'use client';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/12993253/pexels-photo-12993253.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          filter: 'saturate(1) brightness(0.95)',
        }}
      />

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.34)_30%,rgba(0,0,0,0.12)_60%,rgba(0,0,0,0.45)_100%)]" />

      <div className="relative mx-auto flex min-h-[840px] max-w-6xl items-center px-5 pb-20 pt-32 md:px-8 lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white/80 backdrop-blur-[2px]">
            Basketball culture
          </div>

          <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.08em] text-white md:text-7xl lg:text-[6rem]">
            Play hard.
            <span className="mt-2 block text-red-500">Own the court.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 md:text-lg">
            Find local hoops, book your next game, organize pickup sessions, and build your squad around the next possession.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-500"
            >
              Join the league
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-white/30 hover:bg-white/10"
            >
              Explore
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
            {['pickup', 'tournaments', 'courts', 'teams'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-[2px]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
