import Link from 'next/link';

const services = [
  {
    title: 'League hosting',
    text: 'Set up divisions, fixtures, standings, and entry flows for organized basketball events and tournaments.',
  },
  {
    title: 'Court discovery',
    text: 'Find the best local courts and match-ready spaces with smart filters for time, location, and player count.',
  },
  {
    title: 'Team management',
    text: 'Manage player rosters, event registrations, availability, and match updates in one place.',
  },
  {
    title: 'Community events',
    text: 'Run pickup days, challenge nights, training sessions, and high-energy social basketball meetups.',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Our services</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Everything your basketball community needs.</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="rounded-[28px] border border-black/10 bg-[#f8f8f8] p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg text-white">⚡</div>
              <h2 className="text-2xl font-bold tracking-[-0.05em]">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-black/65">{service.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[32px] bg-black p-8 text-white md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">Built for organizers</p>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-white/85 md:text-2xl">
            Manage events, players, and locations without the friction — so the focus stays on the hoop, the crowd, and the competition.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/signup" className="rounded-full bg-red-600 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white">Start today</Link>
        </div>
      </div>
    </main>
  );
}
