export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-black/10 bg-[#f8f8f8] p-8 md:p-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Cookies</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Cookie policy</h1>

        <div className="mt-10 space-y-8 text-sm leading-7 text-black/75">
          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">1. What are cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help websites recognize returning users, keep login sessions active, remember preferences, and improve the overall experience.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">2. Why we use cookies</h2>
            <p>We use cookies to understand how users interact with the platform, keep navigation smooth, maintain authentication state, and support features such as saved settings, event preferences, and community engagement tools.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">3. Types of cookies</h2>
            <p>Essential cookies keep the platform functioning properly. Preference cookies remember your settings. Analytics cookies are used to understand usage trends and improve the product. Marketing cookies may be used only where clearly disclosed and permitted.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">4. Browser controls</h2>
            <p>You can configure your browser to reject cookies, limit them, or alert you when a cookie is being set. However, disabling some cookies may affect login sessions, saved data, and the ability to use certain features of Hooperzclub.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">5. Changes</h2>
            <p>We may update this Cookie Policy whenever our platform changes or as necessary to reflect legal and technical developments. Continued use of Hooperzclub after updates means you accept the revised cookie usage.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
