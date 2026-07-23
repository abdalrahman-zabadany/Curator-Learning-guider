export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 20, 2026</p>

      <div className="mt-8 space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>When you create an account, we collect your email address and display name. We do not collect payment information, as Curator is entirely free. We also collect usage data such as pages visited, reviews submitted, and voice notes recorded to improve the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve Curator, personalize your experience, and communicate with you about platform updates. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Voice Notes</h2>
          <p>Voice notes you record in Community Circles are stored securely and are only accessible to members of that circle. You may delete your voice notes at any time. We do not use voice data for advertising or share it with third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Cookies</h2>
          <p>We use essential cookies to maintain your session and preferences (such as dark mode). We do not use tracking cookies or third-party analytics that compromise your privacy.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>You can access, update, or delete your account data at any time. To request a full data export or deletion, contact us at privacy@curator.dev. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
          <p>For questions about this privacy policy, contact us at privacy@curator.dev.</p>
        </section>
      </div>
    </div>
  );
}
