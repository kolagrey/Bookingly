export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1">
      <section className="relative py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Last updated: January 1, 2024
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl prose prose-gray dark:prose-invert">
          <h2>Introduction</h2>
          <p>
            We take your privacy seriously. This policy describes how we collect,
            use, and protect your personal information when you use our platform.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email, professional
              background, and profile photo
            </li>
            <li>
              <strong>Payment Information:</strong> Payment method details
              (processed securely by our payment providers)
            </li>
            <li>
              <strong>Session Data:</strong> Booking details, messages, and
              session recordings (with consent)
            </li>
            <li>
              <strong>Usage Data:</strong> How you interact with our platform
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>Facilitating expert-client connections</li>
            <li>Processing payments and refunds</li>
            <li>Improving our services</li>
            <li>Sending important updates and notifications</li>
            <li>Preventing fraud and abuse</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data:
          </p>
          <ul>
            <li>End-to-end encryption for messages and sessions</li>
            <li>Secure payment processing</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            our Data Protection Officer at privacy@example.com
          </p>
        </div>
      </section>
    </main>
  )
}