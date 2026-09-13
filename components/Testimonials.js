'use client';

const reviews = [
  {
    name: 'Kabir Singhania',
    role: 'Captain & Point Guard',
    team: 'North Delhi Ballers',
    location: 'Delhi NCR',
    quote:
      'We used to spend 3 days arguing in WhatsApp groups just to confirm 10 players for a run. With Hooperzclub, we book the court, confirm slots, and our weekend bracket is locked in 5 minutes flat.',
    rating: 5,
    tag: '3v3 Tournament Finalist',
  },
  {
    name: 'Preeti Deshmukh',
    role: 'Tournament Director',
    team: 'Mumbai Hardwood League',
    location: 'Mumbai',
    quote:
      'The automated bracket generator and real-time score updates completely took the pain out of managing our 32-team tournament. The players loved tracking their individual stats on their player cards.',
    rating: 5,
    tag: 'League Organizer',
  },
  {
    name: 'Arjun Menon',
    role: 'Power Forward',
    team: 'Bangalore Skyline',
    location: 'Bangalore',
    quote:
      'The court discovery is insane. Found an indoor wooden court 10 minutes from my apartment that I had no idea existed. The lighting, rims, and reservation flow are top tier.',
    rating: 5,
    tag: 'Verified Hooper',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0b0b0e] py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
              Community Voices
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.07em] text-white md:text-5xl lg:text-6xl">
              Respect the hustle.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/65">
            Hear from captains, ballers, and court managers who are building the country’s most passionate grassroots basketball network.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:border-red-500/40 hover:bg-white/[0.05]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {'★'.repeat(r.rating)}
                  </div>
                  <span className="rounded-full bg-red-600/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {r.tag}
                  </span>
                </div>

                <p className="mt-6 text-sm leading-7 text-white/80">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="font-bold text-white">{r.name}</div>
                <div className="text-xs text-white/50">
                  {r.role} • {r.team}
                </div>
                <div className="mt-1 text-[11px] text-red-400">
                  📍 {r.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
