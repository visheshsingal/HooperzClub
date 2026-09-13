export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 text-black md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-black/10 bg-[#f8f8f8] p-8 md:p-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">Privacy</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.08em] md:text-6xl">Privacy policy</h1>

        <div className="mt-10 space-y-8 text-sm leading-7 text-black/75">
          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">1. Information we collect</h2>
            <p>We collect information you provide directly, such as your name, email address, phone number, team details, court preferences, and event participation data. We also collect technical information such as browser type, device information, IP address, and usage patterns to improve delivery and security.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">2. How we use information</h2>
            <p>Your information is used to create and manage your account, facilitate sign-ups, organize basketball events, enable match coordination, send relevant communications, and improve the user experience. We may also use it to troubleshoot service issues and maintain the safety and integrity of the platform.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">3. Sharing of data</h2>
            <p>We do not sell your personal data. We may share information with trusted service providers who assist in hosting, analytics, customer support, or payment processing, and with organizers when necessary to deliver event participation or team management features.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">4. Account security</h2>
            <p>We use secure systems, authentication controls, and encrypted handling practices to protect account information. However, no method of digital transmission or storage is completely risk-free, and users should maintain strong passwords and secure devices.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">5. Your choices</h2>
            <p>You can update your profile, contact preferences, and notification settings from your account. You may also request access to, correction of, or deletion of your personal information, subject to legal obligations and operational needs.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">6. Retention</h2>
            <p>We retain personal information only as long as needed to support the services we provide, meet legal obligations, resolve disputes, and maintain platform continuity. Inactive accounts may be removed subject to our retention policies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold tracking-[-0.04em] text-black">7. Updates</h2>
            <p>We may revise this Privacy Policy from time to time as the platform evolves. Any changes take effect once published on the platform, and continued use of Hooperzclub after such changes means you accept the updated policy.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
