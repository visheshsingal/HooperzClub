import Link from 'next/link';

const groups = [
  'Local pickup groups',
  'Neighborhood leagues',
  'Weekend tournaments',
  'Training camps',
  'Women’s basketball circles',
  'Youth hoops programs',
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Community</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">A better basketball circle starts here.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-black/70">
          Connect with players who want structured games, better sessions, and a stronger local basketball culture.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group} className="rounded-[22px] border border-black/10 bg-[#f8f8f8] p-5 text-base font-medium text-black/80">
              {group}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[32px] bg-black p-8 text-white md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">Why it matters</p>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/85 md:text-2xl">
            Basketball grows when people keep showing up — for games, for energy, and for community.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/signup" className="rounded-full bg-red-600 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white">Join the community</Link>
        </div>
      </div>
    </main>
  );
}
