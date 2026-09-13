import Link from 'next/link';

const values = [
  {
    title: 'Pick-up culture',
    text: 'Bring players together around a simple idea: more games, more runs, and better vibes on the court.',
  },
  {
    title: 'Trusted courts',
    text: 'Discover quality spaces with reliable access, solid lighting, and energy that keeps the game alive.',
  },
  {
    title: 'Competitive energy',
    text: 'From casual rotation to serious league nights, every session is built around the love of basketball.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">About Hooperzclub</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Built for the love of basketball.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-black/70">
          Hooperzclub helps players, teams, and organizers create better basketball experiences — from local courts to full league nights.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <div key={item.title} className="rounded-[28px] border border-black/10 bg-[#f8f8f8] p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg text-white">🏀</div>
              <h2 className="text-xl font-bold tracking-[-0.05em]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/65">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[32px] border border-black/10 bg-black p-8 text-white md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">Our mission</p>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-white/85 md:text-2xl">
            To make basketball more accessible, more social, and more organized — so every session feels worth showing up for.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/signup" className="rounded-full bg-red-600 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white">Join now</Link>
          <Link href="/services" className="rounded-full border border-black/15 bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black">Explore services</Link>
        </div>
      </div>
    </main>
  );
}
