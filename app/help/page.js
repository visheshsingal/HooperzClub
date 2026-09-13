export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Help</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Need a hand?</h1>
        <div className="mt-10 space-y-5 text-black/75">
          <p>We help players find games, organizers manage events, and communities build a better basketball rhythm.</p>
          <p>Use the app to create an account, join a community, book a court, or set up an event for your local group.</p>
          <p>For support, reach out through the contact page or your organizer dashboard.</p>
        </div>
      </div>
    </main>
  );
}
