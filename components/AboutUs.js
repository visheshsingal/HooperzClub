'use client';

const highlights = [
  {
    title: 'Pickup games',
    text: 'Jump into the next open run, meet new players, and get on the court without the hassle.',
  },
  {
    title: 'League play',
    text: 'Run your own bracket, track the standings, and keep the competition moving all season.',
  },
  {
    title: 'Court bookings',
    text: 'Lock in your turf, host practice sessions, and build the right basketball atmosphere.',
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="bg-white py-20 text-black md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        <div className="mb-12 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Built for hoops</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.07em] text-black md:text-5xl">
            Basketball is the whole game.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-black/10 bg-[#f8f8f8] p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-red-600/40"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl text-white shadow-[0_10px_25px_rgba(220,38,38,0.3)]">
                ⛹
              </div>
              <h3 className="text-xl font-bold tracking-[-0.05em] text-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/65">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
