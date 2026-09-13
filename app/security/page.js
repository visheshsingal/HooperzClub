export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-black/10 bg-[#f8f8f8] p-8 md:p-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Security</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Security and trust</h1>

        <div className="mt-10 space-y-8 text-sm leading-7 text-black/75">
          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">1. Account protection</h2>
            <p>We apply access controls to protect user accounts, including secure authentication patterns and session management tools. All users are encouraged to keep passwords private, avoid shared credentials, and sign out from devices they do not control.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">2. Data handling</h2>
            <p>We handle personal and event-related information with care and apply security measures intended to reduce unauthorized access, misuse, or accidental disclosure. This includes protected storage practices, limited access permissions, and platform monitoring for unusual activity.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">3. Community safety</h2>
            <p>Our platform is built for active communities, and we expect all users to behave responsibly. Harassment, threatening communication, fake activity, or manipulation of events is not tolerated and may lead to account restrictions or removal.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">4. Payment and booking safety</h2>
            <p>When payment or booking features are used, we implement secure processing practices and require clear confirmation steps before finalization. Users should verify venue details, event rules, and organizer information before making a commitment.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">5. Reporting concerns</h2>
            <p>If you suspect misuse, a security concern, or a rule violation, you should report it immediately through the platform’s support route or direct contact channels. We review reports as quickly as possible and act on credible concerns in line with our safety procedures.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
