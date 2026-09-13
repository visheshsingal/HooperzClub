'use client';

export default function StatsBanner() {
  const stats = [
    { label: 'Active Ballers', value: '15,000+', change: '+24% this month' },
    { label: 'Verified Courts', value: '120+', change: 'Indoor & Outdoor' },
    { label: 'Tournaments Hosted', value: '450+', change: 'Over ₹25L in prizes' },
    { label: 'On-Time Tip-Off', value: '99.4%', change: 'Sanctioned & Refereed' },
  ];

  const cities = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chandigarh', 'Pune', 'Kolkata', 'Chennai'];

  return (
    <section className="relative z-10 border-y border-white/10 bg-[#09090b] text-white">
      {/* Live running ticker header */}
      <div className="border-b border-white/5 bg-red-950/30 px-4 py-2.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </span>
            <span className="font-bold uppercase tracking-[0.2em] text-red-400">Live Court Activity</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">38 pickup runs & 4 league matches active right now</span>
          </div>

          <div className="hidden items-center gap-2 text-[11px] font-semibold text-white/50 sm:flex">
            <span>Trending Cities:</span>
            {cities.slice(0, 4).map((city) => (
              <span key={city} className="rounded-md bg-white/5 px-2 py-0.5 text-white/75">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main stats grid */}
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-red-500/30 hover:bg-white/[0.05]"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
                0{idx + 1} // Metric
              </div>
              <div className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-white/90">
                {stat.label}
              </div>
              <div className="mt-2 text-xs text-white/50">
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
