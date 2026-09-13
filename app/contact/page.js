export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-black/10 bg-[#f8f8f8] p-8 md:p-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Contact</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Let’s build better hoops.</h1>

        <div className="mt-8 space-y-4 text-black/70">
          <p>Email: support@hooperzclub.com</p>
          <p>Phone: +1 (555) 000-0000</p>
          <p>Location: Built for local basketball communities everywhere.</p>
        </div>
      </div>
    </main>
  );
}
